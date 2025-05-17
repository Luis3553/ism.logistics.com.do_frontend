import { months } from "../constants/dates";

type DatePickerFielldsProps = {
    daysInMonth: number;
    months: typeof months;
    todaysDate: Date;
    day: string;
    month: string;
    year: string;
    setDay: (day: string) => void;
    setMonth: (month: string) => void;
    setYear: (year: string) => void;
};
export const DatePickerFields = ({ daysInMonth, months, todaysDate, setDay, setMonth, setYear, day, month, year }: DatePickerFielldsProps) => {
    return (
        <>
            {/* Day Selector */}
            <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-2">
                <span className="font-semibold text-brand-dark-gray text-base">Día</span>
                <div className="form-select-wrapper w-full min-[640px]:w-fit">
                    <select className="form-select" value={day} onChange={(e) => setDay(e.target.value)}>
                        {Array.from({ length: daysInMonth }).map((_, i) => (
                            <option key={i} value={`${i + 1}`.padStart(2, "0")}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                    <svg className="form-select-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Month Selector */}
            <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-2">
                <span className="font-semibold text-brand-dark-gray text-base">Mes</span>
                <div className="form-select-wrapper w-full min-[640px]:w-fit">
                    <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                        {months.map((monthLabel, i) => (
                            <option key={i} value={`${i + 1}`.padStart(2, "0")}>
                                {monthLabel}
                            </option>
                        ))}
                    </select>
                    <svg className="form-select-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Year Selector */}
            <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-2">
                <span className="font-semibold text-brand-dark-gray text-base">Año</span>
                <div className="form-select-wrapper w-full min-[640px]:w-fit">
                    <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                        {Array.from({ length: 10 }).map((_, i) => {
                            const y = todaysDate.getFullYear() - 5 + i;
                            return (
                                <option key={y} value={String(y)}>
                                    {y}
                                </option>
                            );
                        })}
                    </select>
                    <svg className="form-select-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </>
    );
};
