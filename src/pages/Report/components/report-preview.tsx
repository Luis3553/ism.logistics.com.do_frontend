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
import { expandAnimationProps, scaleAnimationProps } from "@utils/animations";
import { Message, Tooltip, useToaster, Whisper } from "rsuite";
import { Modal } from "@components/Modal";
import { ReactNode } from "react";

export function ReportGroup({ data, column_dimensions, nested = false }: { data: RetrievedReportData; column_dimensions: { [key: string]: number }; nested?: boolean }) {
    const [open, setOpen] = useState(true);
    const colKeys = Object.values(column_dimensions);

    const isNested = Array.isArray(data.content);

    return (
        <>
            <div className={cn("grid overflow-hidden divide-y shadow", !nested && "my-3 rounded-lg")}>
                <div
                    className={cn(
                        "flex items-center justify-between transition",
                        nested ? "bg-[#EFEFEF] hover:bg-[#DFDFDF] text-gray-800" : "text-white bg-brand-blue hover:bg-brand-dark-blue",
                    )}>
                    <span className='px-2 font-bold'>{data.groupLabel}</span>
                    <button onClick={() => setOpen(!open)} className='h-full p-3 transition outline-none hover:bg-black/20 focus-visible:bg-black/20'>
                        <HiChevronUp className={cn("transition", !open && "rotate-180")} />
                    </button>
                </div>
                <Transition show={open} as='div' {...expandAnimationProps}>
                    {isNested ? (
                        (data.content as RetrievedReportData[]).map((child, idx) => <ReportGroup key={idx} data={child} column_dimensions={column_dimensions} nested={true} />)
                    ) : (
                        <Table data={(data.content as any).rows} virtualized maxHeight={400} autoHeight cellBordered>
                            {(data.content as any).columns.map((col: any, colIdx: number) => (
                                <Column key={colIdx} flexGrow={colKeys[colIdx]} fullText>
                                    <HeaderCell className='font-bold'>{col.name}</HeaderCell>
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
                    )}
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
        <div className='grid w-full overflow-hidden divide-y rounded-lg shadow lg:w-1/2'>
            <div className='flex items-center justify-between font-bold text-white transition bg-brand-blue hover:bg-brand-dark-blue'>
                <span className='px-2'>{data.title}</span>
                <button onClick={() => setOpen(!open)} className='h-full p-2 transition outline-none hover:bg-black/20 focus-visible:bg-black/20'>
                    <HiChevronUp className={cn("transition", !open && "rotate-180")} />
                </button>
            </div>
            <Transition show={open} as='div' {...expandAnimationProps}>
                <>
                    {data.rows.map((row, rowIdx) => (
                        <div className='grid grid-cols-2 divide-x *:p-2 *:py-1 hover:bg-gray-100 transition' key={`row-${rowIdx}`}>
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

    const toaster = useToaster();

    const messageToaster = (message: ReactNode, type: "warning" | "success" | "info" | "error" = "error") => (
        <Message
            className={cn(
                "*:flex *:flex-row *:items-center my-2 *:gap-x-4 p-4 text-white rounded-lg transition-all duration-500 backdrop-blur-sm hover:backdrop-blur-md",
                type === "success" && "bg-green-500/75",
                type === "warning" && "bg-amber-400/75",
                type === "info" && "bg-blue-500/75",
                type === "error" && "bg-red-500/75",
            )}
            showIcon
            type={type ?? "error"}
            closable>
            {message}
        </Message>
    );

    const [isOpen, setIsOpen] = useState(false);

    async function deleteReport() {
        toaster.push(messageToaster(`Eliminando reporte ${activeReport.title}...`, "info"), { duration: 5000, placement: "topEnd" });
        setIsOpen(false);
        try {
            await api.delete(`/reports/${activeReport.id}/delete`).then(() => {
                toaster.push(messageToaster(`Reporte "${activeReport.title}" eliminado correctamente`, "success"), { duration: 5000, placement: "topEnd" });
                setActiveReport(null);
                refetch();
            });
        } catch (error) {
            toaster.push(messageToaster(`No se ha podido eliminar el reporte "${activeReport.title}"`, "error"), { duration: 5000, placement: "topEnd" });
            console.error("Failed to delete report:", error);
        }
    }

    const tooltip = (message: string) => <Tooltip>{message}</Tooltip>;

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
                toaster.push(messageToaster(`Descargando reporte "${activeReport.title}"`, "info"), { duration: 5000, placement: "topEnd" });
                try {
                    const response = await api.get(`/reports/${activeReport.id}/download?format=xlsx`, {
                        responseType: "blob",
                    });
                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `${activeReport.title.split(" ").join("_")}.xlsx`); // or .xls
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } catch (error) {
                    toaster.push(messageToaster(`No se ha podido descargar el reporte "${activeReport.title}"`, "error"), { duration: 5000, placement: "topEnd" });
                    console.error("Failed to download report:", error);
                }
            },
            icon: <PiFileXlsFill />,
        },
    ];

    if (isLoading)
        return (
            <div className='relative h-full'>
                <LoadSpinner />
            </div>
        );

    if (data)
        return (
            <div className='flex flex-col w-full h-full'>
                <div className='relative flex items-center justify-between w-full h-8 bg-gray-100 border-b'>
                    <div className='flex flex-row w-full h-full rounded-t-lg'>
                        <Menu as='div'>
                            {({ open }) => (
                                <>
                                    <Whisper speaker={tooltip("Descargar reporte")} onMouseOver={() => tooltip} trigger='hover' placement='top'>
                                        <Menu.Button className='h-full flex items-center text-white transition outline-none focus-visible:bg-brand-dark-blue bg-brand-blue hover:bg-sky-600 aria-expanded:bg-brand-dark-blue py-1.5 px-4 pe-3'>
                                            <LuDownload />
                                            <HiChevronDown className={cn("ms-2 size-3 transition-all", open ? "rotate-180" : "rotate-0")} />
                                        </Menu.Button>
                                    </Whisper>

                                    <Transition as={Fragment} {...scaleAnimationProps}>
                                        <Menu.Items className='absolute left-0 z-50 w-32 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none'>
                                            <div className='px-1 py-1'>
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
                                </>
                            )}
                        </Menu>
                        <Whisper speaker={tooltip("Eliminar reporte")} onMouseOver={() => tooltip} trigger='hover' placement='top'>
                            <button
                                onClick={() => setIsOpen(true)}
                                className='h-full text-white rounded-tr-xl transition outline-none focus-visible:bg-red-700 bg-red-500 hover:bg-red-700 py-1.5 px-4'>
                                <HiTrash />
                            </button>
                        </Whisper>
                        <Modal className='h-min max-w-[500px]' onClose={() => setIsOpen(false)} isOpen={isOpen}>
                            <div className='flex items-center justify-between mb-4'>
                                <h1 className='text-lg font-semibold'>Confirmación</h1>
                                <button
                                    className='flex items-center justify-center p-1 transition rounded-full outline-none focus-visible:bg-black/10 hover:bg-black/10 active:bg-black/20'
                                    onClick={() => setIsOpen(false)}>
                                    <HiXMark className='size-5' />
                                </button>
                            </div>
                            <div className=''>¿Está seguro de querer eliminar este reporte?</div>
                            <small className='text-gray-500'>Esta acción no podrá revertirse.</small>
                            <div className='flex justify-between mt-4'>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className='py-1.5 px-4 bg-gray-100 text-gray-500 hover:bg-gray-500 active:bg-gray-600 shadow hover:text-white active:text-white focus-visible:bg-gray-400 focus-visible:text-white transition outline-none rounded-lg'>
                                    Cancelar
                                </button>
                                <button
                                    onClick={deleteReport}
                                    className='py-1.5 px-4 bg-red-100 text-red-500 hover:bg-red-500 active:bg-red-600 shadow hover:text-white active:text-white focus-visible:bg-red-400 focus-visible:text-white transition outline-none rounded-lg'>
                                    Eliminar
                                </button>
                            </div>
                        </Modal>
                    </div>
                    <div className='w-full text-sm font-medium text-gray-500 truncate ms-auto text-end pe-4 text-nowrap'>
                        <Whisper speaker={tooltip(activeReport.title)} onMouseOver={() => tooltip} trigger='hover' placement='bottomStart'>
                            {activeReport.title}
                        </Whisper>
                    </div>
                    <Whisper speaker={tooltip("Cerrar reporte")} onMouseOver={() => tooltip} trigger='hover' placement='topEnd'>
                        <button className='p-2 text-red-600 transition outline-none focus-visible:bg-red-300 hover:bg-red-300' onClick={() => setActiveReport(null)}>
                            <HiXMark />
                        </button>
                    </Whisper>
                </div>
                <div className='p-4 z-0 overflow-y-scroll h-full relative!'>
                    {data.summary && <ReportSummary data={data.summary} />}
                    {data.data.map((group, groupIdx) => (
                        <ReportGroup key={groupIdx} data={group} column_dimensions={data.columns_dimensions_for_excel_file} />
                    ))}
                </div>
            </div>
        );
}
