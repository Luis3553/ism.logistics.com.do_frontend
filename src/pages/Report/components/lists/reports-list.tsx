import { useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import cn from "classnames";
import { format } from "date-fns";
import { GeneratedReportRow } from "@utils/types";
import { useApiQuery } from "@hooks/useQuery";
import { LoadSpinner } from "@components/LoadSpinner";

export const reportTypes: { id: number; name: string }[] = [{ id: 0, name: "Todos" }];

type UpdatedReportMessage = {
    message: string;
    percent: number;
};

export function ReportRow({ data, selected, onClick }: { data: GeneratedReportRow; selected: boolean; onClick: () => void }) {
    const [percent, setPercent] = useState(data.percent);
    const [pollingEnabled, setPollingEnabled] = useState(data.percent < 100);

    const { data: updated } = useApiQuery<UpdatedReportMessage>(`/reports/${data.id}/status`, {
        interval: pollingEnabled ? 1000 : false,
        disable: !pollingEnabled,
        retry: false,
    });

    
    const isLoading = percent < 100;
    
    useEffect(() => {
        if (updated) {
            if (updated.percent >= 100) {
                setPercent(100);
                setPollingEnabled(false); // Stop polling
            } else {
                setPercent(updated.percent);
            }
        }
    }, [updated]);

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={cn(
                "flex w-full outline-none text-start items-center border-t justify-between flex-row px-5 py-3 transition-all",
                selected && "bg-brand-blue focus-visible:bg-brand-dark-blue text-white hover:bg-brand-dark-blue",
                isLoading && "bg-gray-50 *:pointer-events-none cursor-not-allowed",
                !selected && !isLoading && "hover:bg-brand-light-blue",
            )}>
            <div className='flex flex-col w-full'>
                <span className={cn("font-medium", isLoading && "opacity-50")}>{data.title}</span>
                <small className={cn("opacity-50", isLoading && "opacity-25")}>Generado: {format(new Date(data.created_at), "dd/MM/yyyy hh:mm:ss aa")}</small>
                {isLoading && (
                    <div className='h-2 mt-2 overflow-hidden bg-gray-200 rounded-sm'>
                        <div className='h-full transition-all rounded-sm bg-brand-blue animate-pulse' style={{ width: `${percent}%` }}></div>
                    </div>
                )}
            </div>
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
}: {
    reports: GeneratedReportRow[];
    isError: boolean;
    showInitialLoading: boolean;
    refetch: () => void;
    filter: string;
    activeReport: GeneratedReportRow | null;
    setActiveReport: React.Dispatch<React.SetStateAction<GeneratedReportRow | null>>;
}) {
    if (showInitialLoading)
        return (
            <div className='relative py-8 h-52'>
                <LoadSpinner />
            </div>
        );

    const normalizedFilter = filter.trim().toLowerCase();

    const results = reports.filter((report) => report.title.toLowerCase().includes(normalizedFilter));

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
        <div className='flex flex-col w-full h-full overflow-y-scroll divide-y'>
            {reports.map((type) => (
                <ReportRow
                    key={type.id} // avoid key collision
                    data={type}
                    onClick={() => setActiveReport(type)}
                    selected={type.id === activeReport?.id}
                />
            ))}
        </div>
    );
}
