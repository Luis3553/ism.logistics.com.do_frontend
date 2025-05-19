import { Button, Input } from "@headlessui/react";
import { CustomProvider, DateRangePicker } from "rsuite";
import esES from "rsuite/locales/es_ES";
import cn from "classnames";
import { Option } from "@utils/types";
import React from "react";
import useWindowSize from "../use-window-size";
import { DateRange } from "rsuite/esm/DateRangePicker";

export default function AlertHeader({
    query,
    options,
    selectedOption,
    range,
    setOption,
    setQuery,
    setRange,
}: {
    query: string;
    options: Option[];
    selectedOption: Option;
    range: DateRange;
    setOption: React.Dispatch<React.SetStateAction<Option>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setRange: React.Dispatch<React.SetStateAction<DateRange>>;
}) {
    const { width } = useWindowSize();

    function handleChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
    }

    function handleChangeDate(e: DateRange | null) {
        if (e) setRange(e);
    }

    const allowedRangeDates = (date: Date) => {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        today.setHours(23, 59, 59, 59);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        // date.setHours(0, 0, 0, 0);
        return date < sixMonthsAgo || date > today;
    };

    return (
        <div className="flex flex-col justify-between md:items-center gap-y-4 md:flex-row">
            <div className="flex flex-row flex-wrap items-center gap-4">
                <div className="grid w-full gap-2 p-1 rounded md:grid-cols-2 justify-stretch md:w-80 bg-brand">
                    {options.map((option, optionIdx) => (
                        <Button
                            key={optionIdx}
                            onClick={() => setOption(options[optionIdx])}
                            aria-selected={selectedOption === option}
                            className="flex items-center gap-2 uppercase font-medium btns-details-chart aria-selected:bg-brand-blue focus-visible:outline-1 outline-brand-blue aria-selected:text-white truncate bg-white py-0.5 px-3 rounded cursor-pointer shadow border border-transparent hover:border-brand-blue transition">
                            <i className={cn(option.icon)}></i>
                            {option.value}
                        </Button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Input
                        type="text"
                        id="search-filter"
                        placeholder="Buscar objeto..."
                        className="peer w-full border focus-visible:outline-1 outline-brand-blue caret-brand-blue placeholder:text-slate-400 rounded py-1.5 ps-3 pe-[30px] border-slate-200"
                        value={query}
                        onChange={handleChangeSearch}
                    />
                    {query.length == 0 ? (
                        <label htmlFor="search-filter">
                            <i className="absolute end-1.5 top-1.5 text-2xl mgc_search_2_line peer-focus:text-brand-blue text-slate-400" />
                        </label>
                    ) : (
                        <Button className={"pointer-cursor"} onClick={() => setQuery("")}>
                            <i className="absolute end-1.5 top-1.5 text-2xl mgc_close_line peer-focus:text-brand-blue text-slate-400" />
                        </Button>
                    )}
                </div>
            </div>
            <div className="relative flex flex-row items-center gap-2">
                {/* <Button
                    onClick={() => setAsc(!isAsc)}
                    title={isAsc ? "Cambiar a descendente" : "Cambiar a ascendente"}
                    className={cn(
                        "transition-all rounded-lg cursor-pointer size-10 aspect-square text-brand-dark-gray hover:bg-brand-light-blue/50 active:bg-brand-light-blue focus-visible:text-white",
                        isAsc && " rotate-x-180",
                    )}>
                    {<i className='mgc_sort_descending_line'></i>}
                </Button> */}
                <CustomProvider locale={esES}>
                    <DateRangePicker
                        showOneCalendar={width! < 768}
                        lang="es"
                        menuStyle={{ zIndex: 20 }}
                        className="w-[375px]"
                        placement="bottomEnd"
                        format="dd-MM-yyyy hh:mm:ss aa"
                        character=" - "
                        value={range}
                        shouldDisableDate={allowedRangeDates}
                        cleanable={false}
                        onChange={handleChangeDate}
                    />
                </CustomProvider>
            </div>
        </div>
    );
}
