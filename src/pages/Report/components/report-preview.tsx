import { Menu, Transition } from "@headlessui/react";
import { GeneratedReportRow, RetrievedReport, RetrievedReportData } from "@utils/types";
import { HiChevronDown, HiChevronUp, HiTrash, HiXMark } from "react-icons/hi2";
import { LuDownload } from "react-icons/lu";
import { Fragment } from "react/jsx-runtime";
import api from "@api/index";
import { PiFileXlsFill } from "react-icons/pi";
import { useApiQuery } from "@hooks/useQuery";
import { useState } from "react";
import cn from "classnames";
import { Cell, Column, HeaderCell, Table } from "rsuite-table";
import { LoadSpinner } from "@components/LoadSpinner";

export function ReportGroup({ data, column_dimensions }: { data: RetrievedReportData; column_dimensions: { [key: string]: number; } }) {
    const [open, setOpen] = useState(true);
    const colKeys = Object.values(column_dimensions);

    return (
        <>
            <div className='grid my-4 overflow-hidden divide-y rounded-lg shadow'>
                <div className='flex items-center justify-between text-white transition bg-brand-blue hover:bg-brand-dark-blue'>
                    <span className="px-2 font-bold">{data.groupLabel}</span>
                    <button onClick={() => setOpen(!open)} className='h-full p-3 transition hover:bg-black/20'>
                        <HiChevronUp className={cn("transition", !open && "rotate-180")} />
                    </button>
                </div>
                <Transition
                show={open}
                appear
                as='div'
                leave='transition-[height] duration-500'
                enter='transition-[height] duration-500'
                enterFrom='h-0!'
                enterTo='h-full'
                leaveFrom='h-full'
                leaveTo='h-0!'>
                    <Table data={data.content.rows} virtualized maxHeight={300} cellBordered>
                        {data.content.columns.map((col, colIdx) => (
                            <Column key={colIdx} flexGrow={colKeys[colIdx]} fullText>
                                <HeaderCell className="font-bold">
                                    {col.name}
                                </HeaderCell>
                                <Cell dataKey={col.key}>
                                    {(rowData) => {
                                        const cellValue = rowData[col.key];
                                        return (
                                            <span className={cn("text-sm", col.key === "name" && "font-semibold")}>
                                                {cellValue !== null && cellValue !== undefined ? cellValue.toString() : "-"}
                                            </span>
                                        );
                                    }}
                                </Cell>
                            </Column>
                        ))}
                    </Table>
                    {/* <div className={cn(`grid grid-cols-${data.content.columns.length}`)}>
                        {data.content.columns.map((col, colIdx) => (
                            <div className=''>{col.name}</div>
                        ))}
                    </div> */}
                </Transition>
            </div>
        </>
    );
}

export function ReportSummary({ data }: { data: RetrievedReport["summary"] }) {
    const [open, setOpen] = useState(true);
    return (
        <div className='grid w-full overflow-hidden divide-y rounded-lg shadow lg:w-1/3'>
            <div className='flex items-center justify-between font-bold text-white transition bg-brand-blue hover:bg-brand-dark-blue'>
                <span className='px-2'>{data.title}</span>
                <button onClick={() => setOpen(!open)} className='h-full p-3 transition hover:bg-black/20'>
                    <HiChevronUp className={cn("transition", !open && "rotate-180")} />
                </button>
            </div>
            <Transition
                show={open}
                appear
                as='div'
                leave='transition-[height] duration-500'
                enter='transition-[height] duration-500'
                enterFrom='h-0!'
                enterTo='h-full'
                leaveFrom='h-full'
                leaveTo='h-0!'>
                <>
                    {data.rows.map((row, rowIdx) => (
                        <div className='grid grid-cols-2 divide-x *:p-2 hover:bg-gray-100 transition' key={`row-${rowIdx}`}>
                            <div className='font-bold'>{row.title}</div>
                            <div>{row.value}</div>
                        </div>
                    ))}
                </>
            </Transition>
        </div>
    );
}

export function ReportPreview({
    activeReport,
    setActiveReport,
    refetch,
}: {
    activeReport: GeneratedReportRow;
    setActiveReport: React.Dispatch<React.SetStateAction<GeneratedReportRow | null>>;
    refetch: () => void;
}) {
    const { data, isLoading } = useApiQuery<RetrievedReport>(`/reports/${activeReport.id}/retrieve`, {});

    const options = [
        // {
        //     label: "PDF",
        //     onClick: () => {
        //         api.post("/reports/generate");
        //     },
        //     icon: <PiFilePdfFill />,
        // },
        {
            label: "XLS",
            onClick: async () => {
                const response = await api.get(`/reports/${activeReport.id}/download?format=xlsx`, {
                    responseType: "blob",
                });
                const blob = response.data as Blob;
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${activeReport.title.replace(" ", "_")}.xlsx`); // or .xls
                document.body.appendChild(link);
                link.click();
                link.remove();
            },
            icon: <PiFileXlsFill />,
        },
    ];

    if (isLoading) return (
        <div className="relative h-full">
            <LoadSpinner />
        </div>
    )

    if (data)
        return (
            <div className='flex flex-col w-full'>
                <div className='relative flex items-center justify-between w-full h-8 overflow-hidden bg-gray-100 border-b'>
                    <div className='flex flex-row w-full h-full overflow-hidden rounded-t-lg'>
                        <Menu as='div'>
                            <Menu.Button className='h-full text-white transition bg-brand-blue hover:bg-brand-dark-blue py-1.5 px-4'>
                                <LuDownload />
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter='transition ease-out duration-100'
                                enterFrom='transform opacity-0 scale-95'
                                enterTo='transform opacity-100 scale-100'
                                leave='transition ease-in duration-75'
                                leaveFrom='transform opacity-100 scale-100'
                                leaveTo='transform opacity-0 scale-95'>
                                <Menu.Items className='absolute z-50 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg left-2 ring-1 ring-black/5 focus:outline-none'>
                                    <div className='px-1 py-1 '>
                                        {options.map((option, optionIdx) => (
                                            <Menu.Item key={optionIdx}>
                                                {({ active }) => (
                                                    <button
                                                        onClick={option.onClick}
                                                        className={`${
                                                            active ? "bg-brand-blue text-white" : "text-gray-900"
                                                        } group gap-x-4 flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                        {option.icon}
                                                        {option.label}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                        <button
                            onClick={async () => {
                                try {
                                    await api.delete(`/reports/${activeReport.id}/delete`).then(() => {
                                        setActiveReport(null);
                                        refetch();
                                    });
                                } catch (error) {
                                    console.error("Failed to delete report:", error);
                                }
                            }}
                            className='h-full text-white rounded-tr-xl transition bg-brand-blue hover:bg-brand-dark-blue py-1.5 px-4'>
                            <HiTrash />
                        </button>
                    </div>
                    <div className='w-full font-medium text-gray-500 truncate ms-auto text-end pe-4 text-nowrap'>{activeReport.title}</div>
                    <button className='p-2 text-red-600 transition hover:bg-red-300' onClick={() => setActiveReport(null)}>
                        <HiXMark />
                    </button>
                </div>
                <div className='p-4 overflow-y-scroll h-[calc(100vh-64px)] relative!'>
                    {data.summary && <ReportSummary data={data.summary} />}
                    {data.data.map((group, groupIdx) => (
                        <ReportGroup key={groupIdx} data={group} column_dimensions={data.columns_dimensions_for_excel_file} />
                    ))}
                </div>
            </div>
        );
}
