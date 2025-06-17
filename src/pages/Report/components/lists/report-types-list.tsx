import { Transition } from "@headlessui/react";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";
import cn from "classnames";
import { ReportType } from "@utils/types";
import { expandAnimationProps } from "@utils/animations";
import { reports } from "../report-types";


export const reportTypes: { id: number; name: string }[] = [];
reports.forEach((category) => {
    category.types.forEach((type) => {
        reportTypes.push({ id: type.id, name: type.name });
    });
});

export function ReportTypeRow({ data, selected, onClick }: { data: ReportType; selected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={data.disabled}
            className={cn(
                "flex w-full outline-none text-start items-center border-t justify-between flex-row px-5 py-2 md:py-3 transition-all",
                selected && "bg-brand-blue focus-visible:bg-brand-dark-blue text-white hover:bg-brand-dark-blue",
                data.disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
                !selected && !data.disabled && "focus-visible:bg-gray-50 active:bg-gray-100 hover:bg-gray-50",
            )}>
            <div className='flex flex-col w-full'>
                <span className='font-medium text-[.9rem]'>{data.name}</span>
                <small className='opacity-50 text-[.75rem]'>{data.description}</small>
            </div>
        </button>
    );
}

export function ReportTypesList({
    filter = "",
    activeReportType,
    setActiveReportType,
    setIsMenuOpen,
}: {
    filter: string;
    activeReportType: ReportType | null;
    setActiveReportType: React.Dispatch<React.SetStateAction<ReportType | null>>;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});

    const toggleOpen = (idx: number) => {
        setOpenStates((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const normalizedFilter = filter.trim().toLowerCase();

    return (
        <div className='flex flex-col w-full divide-y'>
            {reports.map((reportCategory, reportCategoryIdx) => {
                const filteredReports = reportCategory.types.filter(
                    (type) =>
                        type.name
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .includes(normalizedFilter.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
                        type.description
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .includes(normalizedFilter.normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
                );

                if (filteredReports.length === 0) return null;

                return (
                    <div key={`category-${reportCategoryIdx}`}>
                        <div className='flex items-center justify-between font-medium text-gray-700 bg-gray-100 hover:bg-gray-200'>
                            <span className='px-4 py-1 md:py-2 text-[.9rem]'>{reportCategory.category}</span>
                            <button
                                onClick={() => toggleOpen(reportCategoryIdx)}
                                className='flex items-center justify-center p-2 transition outline-none md:p-3 focus-visible:bg-gray-300 hover:bg-gray-300 aspect-square'>
                                <HiOutlineChevronDown className={cn(openStates[reportCategoryIdx] && "rotate-180", "transition-all")} />
                            </button>
                        </div>
                        <Transition show={!!openStates[reportCategoryIdx]} {...expandAnimationProps}>
                            {filteredReports.map((type) => {
                                return (
                                    <ReportTypeRow
                                        key={type.id}
                                        data={type}
                                        onClick={() => {
                                            setActiveReportType(type);
                                            setIsMenuOpen(false);
                                        }}
                                        selected={type.id === activeReportType?.id}
                                    />
                                );
                            })}
                        </Transition>
                    </div>
                );
            })}
        </div>
    );
}
