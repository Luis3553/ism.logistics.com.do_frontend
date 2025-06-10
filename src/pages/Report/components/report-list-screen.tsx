import { HiPlus } from "react-icons/hi2";
import { Filter } from "./utils/filter";
import { GeneratedReportRow } from "@utils/types";
import { ReportList } from "./lists/reports-list";

export default function ReportListScreen({
    setActiveReport,
    setCreateScreen,
    reports,
    isLoadingReports,
    hasLoadedOnce,
    refetchReports,
    isError,
    filter,
    activeReport,
    setFilter,
}: {
    setActiveReport: React.Dispatch<React.SetStateAction<GeneratedReportRow | null>>;
    activeReport: GeneratedReportRow | null;
    setCreateScreen: React.Dispatch<React.SetStateAction<boolean>>;
    reports: GeneratedReportRow[];
    isLoadingReports: boolean;
    hasLoadedOnce: React.MutableRefObject<boolean>;
    refetchReports: () => void;
    isError: boolean;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <>
            <div className='sticky top-0 z-50 px-4 py-2 bg-white border-b'>
                <span className='font-medium text-gray-700'>Reportes disponibles</span>
            </div>
            <div className="sticky z-50 bg-white top-[36px]">
                <button
                    onClick={() => {
                        setActiveReport(null);
                        setCreateScreen(true);
                    }}
                    className='flex flex-row items-center w-full h-full gap-4 px-4 py-2 font-medium transition text-brand-blue hover:bg-brand-light-blue'>
                    <HiPlus className='size-5' />
                    Crear reporte
                </button>
            </div>
            <Filter className="sticky z-50 top-[71px]" filter={filter} setFilter={setFilter} />
            <ReportList
                reports={reports}
                showInitialLoading={isLoadingReports && !hasLoadedOnce.current}
                refetch={refetchReports}
                isError={isError}
                filter={filter}
                activeReport={activeReport}
                setActiveReport={setActiveReport}
            />
        </>
    );
}
