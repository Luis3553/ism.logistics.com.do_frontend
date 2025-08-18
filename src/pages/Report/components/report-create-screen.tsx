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
    setIsMenuOpen,
}: {
    setActiveReportType: React.Dispatch<React.SetStateAction<ReportType | null>>;
    setCreateScreen: React.Dispatch<React.SetStateAction<boolean>>;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    activeReportType: ReportType | null;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <>
            <div className='sticky top-0 z-50 bg-white'>
                <div className='flex items-center justify-between py-2 bg-white ps-4 pe-2'>
                    <span className='font-medium text-gray-700'>Reportes disponibles</span>
                    <button
                        onClick={() => {
                            setActiveReportType(null);
                            setCreateScreen(false);
                        }}
                        className='p-1 transition rounded-full outline-none hover:bg-black/10 focus-visible:bg-black/10 active:bg-black/20'>
                        <HiChevronLeft />
                    </button>
                </div>
                <Filter className='border-y' filter={filter} setFilter={setFilter} />
            </div>
            <ReportTypesList filter={filter} activeReportType={activeReportType} setActiveReportType={setActiveReportType} setIsMenuOpen={setIsMenuOpen} />
        </>
    );
}
