import { HiChevronLeft } from "react-icons/hi2";
import { ReportTypesList } from "./lists/report-types-list";
import { Filter } from "./utils/filter";
import { ReportType } from "@utils/types";

export default function ReportCreateScreen({
    setActiveReportType,
    setCreateScreen,
    filter,
    setFilter,
    activeReportType,
}: {
    setActiveReportType: React.Dispatch<React.SetStateAction<ReportType | null>>;
    setCreateScreen: React.Dispatch<React.SetStateAction<boolean>>;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    activeReportType: ReportType | null;
}) {
    return (
        <>
            <div className='flex items-center justify-between px-4 py-2'>
                <span className='font-medium text-gray-700'>Reportes disponibles</span>
                <button
                    onClick={() => {
                        setActiveReportType(null);
                        setCreateScreen(false);
                    }}
                    className='p-1 transition rounded-full outline-none hover:bg-black/10 focus-visible:bg-black/10'>
                    <HiChevronLeft />
                </button>
            </div>
            <Filter filter={filter} setFilter={setFilter} />
            <ReportTypesList filter={filter} activeReportType={activeReportType} setActiveReportType={setActiveReportType} />
        </>
    );
}
