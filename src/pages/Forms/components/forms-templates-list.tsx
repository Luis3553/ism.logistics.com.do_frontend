import { LoadSpinner } from "@components/LoadSpinner";
import { useReportStore } from "@contexts/report.context";
import { RadioGroup, Transition } from "@headlessui/react";
import { useApiQuery } from "@hooks/useQuery";
import { appearAnimationProps } from "@utils/animations";
import { Report } from "@utils/types";
import useWindowSize from "@utils/use-window-size";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HiArrowPath, HiBars3, HiCheckCircle, HiXMark } from "react-icons/hi2";

export default function FormsTemplatesList() {
    const { data, isLoading, isError, refetch } = useApiQuery<{ list: Report[] }>("form/template/list", {});
    const [open, setOpen] = useState(true);
    const { setActiveReport } = useReportStore();
    const [reports, setReports] = useState<Report[]>(data?.list || []);
    const [filter, setFilter] = useState("");
    const { width } = useWindowSize();

    useEffect(() => {
        if (data) {
            setReports(data.list);
        }
    }, [data]);

    useEffect(() => {
        if (reports) {
            if (filter === "") {
                setReports(data?.list || []);
            } else setReports(reports.filter((report) => report.label.toLowerCase().includes(filter.toLowerCase())));
        }
    }, [filter]);

    return (
        <aside
            className={classNames(
                "z-50 h-min transition-all relative bg-white shadow rounded-xl max-lg:absolute border",
                open ? "p-4 w-[30%] max-md:w-full max-lg:min-w-[300px]" : "p-0 w-min m-2",
            )}>
            <div className='flex items-center gap-4'>
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className='p-3 transition-all rounded-lg outline-none focus-visible:bg-gray-100 active:bg-gray-200 hover:bg-gray-100 text-slate-700'>
                    <HiBars3 className='size-7' />
                </button>
                {open && <h1 className='font-medium text-md text-slate-700'>Formularios disponibles</h1>}
            </div>
            {isLoading && open && (
                <div className='flex items-center justify-center w-full p-4 text-gray-500 h-52'>
                    <LoadSpinner />
                </div>
            )}
            {isError && open && (
                <div className='flex flex-col items-center justify-center w-full text-center h-52'>
                    <div className='p-4 text-red-500'>Error al cargar los formularios</div>
                    <button
                        onClick={() => refetch()}
                        className='flex flex-row items-center gap-2 p-2 px-4 text-white transition-all rounded-full outline-none bg-brand-blue hover:bg-brand-blue/80 w-fit focus-visible:bg-brand-blue/80 active:bg-brand-dark-blue'>
                        <HiArrowPath /> <span>Intentar de nuevo</span>
                    </button>
                </div>
            )}
            <ErrorBoundary fallback={<div className='p-4 text-red-500'>Error al cargar los formularios</div>}>
                {reports && (
                    <Transition show={open} {...appearAnimationProps}>
                        {open && data && !isLoading && (
                            <div className='relative my-2'>
                                <input
                                    type='text'
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className='w-full p-2 transition-all border rounded-full outline-none text-slate-700 pe-12 ps-4 caret-brand-blue bg-slate-100 hover:bg-slate-200'
                                    placeholder='Buscar formulario...'
                                />
                                <button
                                    type='button'
                                    onClick={() => {}}
                                    className='absolute inset-0 p-1 my-auto transition-all rounded-full outline-none w-min ms-auto me-4 h-min hover:bg-black/10 focus-visible:bg-black/10 active:bg-black/20'>
                                    <HiXMark />
                                </button>
                            </div>
                        )}
                        {reports.length > 0 ? (
                            <>
                                <div className={classNames("max-h-[calc(100vh-64px)] h-min overflow-y-auto px-1 pe-2 pb-4", !open && "hidden")}>
                                    <RadioGroup>
                                        <div className='flex flex-col gap-2 mt-2'>
                                            {reports.map((template) => (
                                                <RadioGroup.Option
                                                    key={template.id}
                                                    value={template.id}
                                                    onClick={() => {
                                                        if (width! < 768) setOpen(false);
                                                        setActiveReport(template);
                                                    }}
                                                    className={({ checked }) =>
                                                        classNames(
                                                            "shadow cursor-pointer select-none transition-all outline-none p-4 rounded-lg hover:shadow-md hover:bg-brand-light-blue",
                                                            checked ? "text-white bg-gradient-to-r to-[#497792] from-[#497792]" : "bg-slate-50 text-slate-700",
                                                        )
                                                    }>
                                                    {({ checked }) => (
                                                        <div className='flex flex-row items-center justify-between'>
                                                            <div className=''>
                                                                <span className={classNames("block font-medium")}>{template.label}</span>
                                                                <div className='flex text-sm opacity-80 gap-x-2'>
                                                                    <span>{template.created}</span>
                                                                    {template.description && <span>・{template.description}</span>}
                                                                </div>
                                                            </div>
                                                            <div>{checked ? <HiCheckCircle className='text-white size-6' /> : null}</div>
                                                        </div>
                                                    )}
                                                </RadioGroup.Option>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            </>
                        ) : (
                            <>
                                {!isLoading && !isError && open && (
                                    <div className='flex flex-col items-center justify-center w-full p-4 text-gray-500 h-52'>
                                        No hay formularios disponibles
                                        {data?.list.length == 0 && (
                                            <button
                                                onClick={() => refetch()}
                                                className='flex flex-row items-center gap-2 p-2 px-4 mt-4 text-white transition-all rounded-full outline-none bg-brand-blue hover:bg-brand-blue/80 w-fit focus-visible:bg-brand-blue/80 active:bg-brand-dark-blue'>
                                                <HiArrowPath /> <span>Intentar de nuevo</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </Transition>
                )}
            </ErrorBoundary>
        </aside>
    );
}
