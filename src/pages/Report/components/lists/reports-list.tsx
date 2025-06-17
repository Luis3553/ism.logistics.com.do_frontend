import { Fragment, useEffect, useState } from "react";
import { HiArrowPath, HiEllipsisVertical, HiOutlineTrash, HiXMark } from "react-icons/hi2";
import cn from "classnames";
import { format } from "date-fns";
import { GeneratedReportRow } from "@utils/types";
import { useApiQuery } from "@hooks/useQuery";
import { LoadSpinner } from "@components/LoadSpinner";
import { Message, Tooltip, useToaster, Whisper } from "rsuite";
import { Menu, Transition } from "@headlessui/react";
import { scaleAnimationProps } from "@utils/animations";
import { LuDownload } from "react-icons/lu";
import { Modal } from "@components/Modal";
import api from "@api/index";

export const reportTypes: { id: number; name: string }[] = [{ id: 0, name: "Todos" }];

type UpdatedReportMessage = {
    message: string;
    percent: number;
};

export function ReportRow({
    data,
    selected,
    onClick,
    refetch,
    setActiveReport,
}: {
    data: GeneratedReportRow;
    selected: boolean;
    onClick: () => void;
    setActiveReport: (report: GeneratedReportRow | null) => void;
    refetch: () => void;
}) {
    const [percent, setPercent] = useState(data.percent);
    const [pollingEnabled, setPollingEnabled] = useState(data.percent < 100);
    const [hasError, setHasError] = useState(data.percent < 0);

    const { data: updated } = useApiQuery<UpdatedReportMessage>(`/reports/${data.id}/status`, {
        interval: pollingEnabled ? 1000 * 3 : false,
        disable: !pollingEnabled,
        retry: false,
        staleTime: 1000 * 60 * 2,
    });

    const toaster = useToaster();
    const [isOpen, setIsOpen] = useState(false);

    async function deleteReport() {
        toaster.push(messageToaster(`Eliminando reporte "${data.title}"...`, "info"), { duration: 5000, placement: "topEnd" });
        setIsOpen(false);
        try {
            await api.delete(`/reports/${data.id}/delete`).then(() => {
                toaster.push(messageToaster(`Reporte "${data.title}" eliminado correctamente`, "success"), { duration: 5000, placement: "topEnd" });
                setActiveReport(null);
                refetch();
            });
        } catch (error) {
            toaster.push(messageToaster(`No se ha podido eliminar el reporte "${data.title}"`, "error"), { duration: 5000, placement: "topEnd" });
            console.error("Failed to delete report:", error);
        }
    }

    const messageToaster = (message: string, type: "warning" | "success" | "info" | "error" = "error") => (
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

    const tooltip = <Tooltip>{data.title}</Tooltip>;

    const isLoading = percent < 100;

    useEffect(() => {
        if (updated) {
            if (updated.percent >= 100) {
                toaster.push(messageToaster(`Reporte generado correctamente`, "success"), { duration: 5000, placement: "topEnd" });
                setPercent(100);
                setHasError(false);
                setPollingEnabled(false); // Stop polling
            } else if (updated.percent < 0) {
                if (data.percent >= 0)
                    // Only show error if it was previously loading
                    toaster.push(messageToaster(`Error generando reporte "${data.title}"`, "error"), { duration: 5000, placement: "topEnd" });
                setPercent(0);
                setHasError(true);
                setPollingEnabled(false); // Stop polling
            } else {
                setHasError(false);
                setPercent(updated.percent);
            }
        }
    }, [updated]);

    if (!hasError)
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling to parent elements
                    onClick();
                }}
                disabled={isLoading}
                className={cn(
                    "grid grid-cols-[90%_10%] w-full outline-none text-start items-center border-t justify-between flex-row px-5 py-2 md:py-3 transition-all",
                    selected && "bg-brand-blue focus-visible:bg-brand-dark-blue text-white hover:bg-brand-dark-blue",
                    isLoading && "bg-gray-50 *:pointer-events-none cursor-not-allowed",
                    !selected && !isLoading && "hover:bg-brand-light-blue",
                    hasError && "bg-red-200",
                )}>
                <div className='flex flex-col w-full'>
                    <span className={cn("font-medium text-[.9rem] truncate", isLoading && "opacity-50")}>
                        <Whisper speaker={tooltip} onMouseOver={() => tooltip} trigger='hover' placement='topStart'>
                            {data.title}
                        </Whisper>
                    </span>
                    <small className={cn("opacity-50 text-[.75rem]", isLoading && "opacity-25")}>Generado: {format(new Date(data.created_at), "dd/MM/yyyy hh:mm:ss aa")}</small>
                    {isLoading && (
                        <div className='h-2 mt-2 overflow-hidden bg-gray-200 rounded-sm'>
                            <div className='h-full transition-all rounded-sm bg-brand-blue animate-pulse' style={{ width: `${percent}%` }}></div>
                        </div>
                    )}
                </div>
                <Menu as='div' className={"relative"}>
                    <Menu.Button
                        className='block p-1.5 transition mx-auto rounded-full outline-none hover:bg-black/10 active:bg-black/20 focus-visible:bg-black/20'
                        onClick={e => e.stopPropagation()}
                    >
                        <HiEllipsisVertical />
                    </Menu.Button>
                    <Transition as={Fragment} {...scaleAnimationProps}>
                        <Menu.Items className='absolute z-50 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-28 right-2 ring-1 ring-black/5 focus:outline-none'>
                            <div className='px-1 py-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div
                                            onClick={async (e) => {
                                                e.stopPropagation(); // Prevent event bubbling to parent elements
                                                toaster.push(messageToaster(`Descargando reporte "${data.title}"`, "info"), { duration: 5000, placement: "topEnd" });
                                                try {
                                                    const response = await api.get(`/reports/${data.id}/download?format=xlsx`, {
                                                        responseType: "blob",
                                                    });
                                                    const blob = response.data as Blob;
                                                    const url = window.URL.createObjectURL(blob);

                                                    const link = document.createElement("a");
                                                    link.href = url;
                                                    link.setAttribute("download", `${data.title.split(" ").join("_")}.xlsx`); 
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.remove();
                                                } catch (error) {
                                                    toaster.push(messageToaster(`No se ha podido descargar el reporte "${data.title}"`, "error"), {
                                                        duration: 5000,
                                                        placement: "topEnd",
                                                    });
                                                    console.error("Failed to download report:", error);
                                                }
                                            }}
                                            className={`${
                                                active ? "bg-brand-blue text-white" : "text-gray-900"
                                            } cursor-pointer group gap-x-4 transition flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                            <LuDownload />
                                            Excel
                                        </div>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent event bubbling to parent elements
                                                setIsOpen(true);
                                            }}
                                            className={`${
                                                active ? "bg-red-500 text-white" : "text-gray-900"
                                            } cursor-pointer group gap-x-4 transition divide-x divide-white flex flex-row w-full items-center rounded-md px-2 py-2 text-sm`}>
                                            <HiOutlineTrash />
                                            Eliminar
                                        </div>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
                <Modal className='h-min max-w-[500px]' onClose={() => setIsOpen(false)} isOpen={isOpen}>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-lg font-semibold'>Confirmación</h1>
                        <button
                            className='flex items-center justify-center p-1 transition rounded-full outline-none focus-visible:bg-black/10 hover:bg-black/10 active:bg-black/20'
                            onClick={() => setIsOpen(false)}>
                            <HiXMark className='size-5' />
                        </button>
                    </div>
                    <div>¿Está seguro de querer eliminar este reporte?</div>
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
            </button>
        );
}

export function ReportList({
    reports,
    filter = "",
    isError,
    showInitialLoading,
    refetch,
    activeReport,
    setActiveReport,
    setIsMenuOpen,
}: {
    reports: GeneratedReportRow[];
    isError: boolean;
    showInitialLoading: boolean;
    refetch: () => void;
    filter: string;
    activeReport: GeneratedReportRow | null;
    setActiveReport: React.Dispatch<React.SetStateAction<GeneratedReportRow | null>>;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>; 
}) {
    if (showInitialLoading)
        return (
            <div className='relative py-8 h-52'>
                <LoadSpinner />
            </div>
        );

    // const normalizedFilter = filter.trim().toLowerCase();

    // Normalize string by removing all tildes/accents for comparison
    const normalizeString = (str: string) =>
        str
            .normalize("NFD")
            .trim()
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const results = filter !== "" ? reports.filter((report) => normalizeString(report.title).includes(normalizeString(filter))) : reports;

    if (results.length === 0) return <div className='p-4 text-center text-gray-500'>No se ha encontrado ningún reporte</div>;

    if (isError)
        return (
            <div className='flex items-center justify-center h-full'>
                <div className='flex flex-col gap-4 text-center'>
                    <span className='text-lg font-medium'>Error cargando los reportes</span>
                    <button
                        onClick={() => refetch()}
                        className='flex flex-row items-center justify-center w-full gap-4 py-2 transition-all rounded-lg shadow group bg-brand-light-blue text-brand-blue hover:bg-white'>
                        <HiArrowPath className='transition group-hover:animate-spin' />
                        Recargar
                    </button>
                </div>
            </div>
        );

    return (
        <div className='flex flex-col w-full divide-y'>
            {results.map((type) => (
                <ReportRow
                    key={type.id} // avoid key collision
                    data={type}
                    onClick={() => {
                        setActiveReport(type)
                        setIsMenuOpen(false);
                    }}
                    refetch={refetch}
                    setActiveReport={setActiveReport}
                    selected={type.id === activeReport?.id}
                />
            ))}
        </div>
    );
}
