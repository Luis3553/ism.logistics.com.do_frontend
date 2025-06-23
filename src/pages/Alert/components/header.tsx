import { CustomProvider, DatePicker, Message, useToaster } from "rsuite";
import esES from "rsuite/locales/es_ES";
import cn from "classnames";
import { Option } from "@utils/types";
import React from "react";
import ListOfTrackers from "./select-trackers";
import ListOfGroups from "./select-groups";
import ListOfAlerts from "./select-alerts";

export default function AlertHeader({
    options,
    selectedOption,
    from,
    to,
    alertsData,
    groupsData,
    trackersData,
    setOption,
    setFrom,
    setTo,
    setGroupsQuery,
    setNotificationsQuery,
    setTrackersQuery,
    // setTagsQuery,
}: {
    query: string;
    options: Option[];
    selectedOption: Option;
    from: Date | null;
    to: Date;
    alertsData: any;
    groupsData: any;
    trackersData: any;
    setOption: React.Dispatch<React.SetStateAction<Option>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setFrom: React.Dispatch<React.SetStateAction<Date | null>>;
    setTo: React.Dispatch<React.SetStateAction<Date>>;
    setGroupsQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>;
    setNotificationsQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>;
    setTrackersQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>;
    setTagsQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>;
}) {
    const toaster = useToaster();
    const message = (message: string) => (
        <Message
            className='*:flex *:flex-row my-2 *:gap-x-4 p-4 text-white rounded-lg bg-amber-400/75 transition-all duration-500 backdrop-blur-sm hover:backdrop-blur-md'
            showIcon
            type={"warning"}
            closable>
            <strong>Error!</strong> {message}
        </Message>
    );

    function handleChangeDate(e: Date | null, action: "from" | "to") {
        if (!e) return;
        if (action === "from") {
            if (to && e > to) {
                toaster.push(message('La fecha "Desde" no puede ser mayor que la fecha "Hasta".'), { duration: 5000, placement: "topEnd" });
                return;
            }
            setFrom(e);
        } else if (action === "to") {
            if (from && e < from) {
                toaster.push(message('La fecha "Hasta" no puede ser menor que la fecha "Desde".'), { duration: 5000, placement: "topEnd" });
                return;
            }
            setTo(e);
        }
    }

    const allowedRangeDates = (date: Date) => {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        // Set time boundaries
        today.setHours(23, 59, 59, 999);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Only allow dates between sixMonthsAgo and today
        // Also, only allow a range of 129 days at a time
        if (date < sixMonthsAgo || date > today) {
            return true;
        }
        if (from && date > from) {
            const diff = (date.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
            if (diff > 120) return true;
        }
        if (to && date < to) {
            const diff = (to.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
            if (diff > 120) return true;
        }
        return false;
    };

    return (
        <div className='flex flex-col gap-1 divide-y'>
            <div className='flex flex-col flex-wrap justify-between pb-2 lg:items-center gap-y-4 lg:flex-row'>
                <div className='flex flex-row flex-wrap items-center gap-4'>
                    <div className='grid gap-2 p-1 rounded w-full lg:w-fit min-[600px]:grid-cols-3 lg:grid-cols-3 justify-stretch bg-brand'>
                        {options.map((option, optionIdx) => (
                            <button
                                key={optionIdx}
                                onClick={() => setOption(options[optionIdx])}
                                aria-selected={selectedOption === option}
                                className='flex items-center gap-2 font-medium btns-details-chart aria-selected:bg-brand-blue focus-visible:outline-1 outline-brand-blue aria-selected:text-white truncate bg-white py-0.5 px-3 rounded cursor-pointer shadow border border-transparent hover:border-brand-blue transition'>
                                <i className={cn(option.icon)}></i>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='relative flex flex-row items-center justify-between w-full gap-2 lg:w-auto lg:justify-normal'>
                    <CustomProvider locale={esES}>
                        <div className='flex flex-row items-center w-full gap-2 lg:w-auto text-brand-gray'>
                            <small className='text-sm font-medium'>Desde</small>
                            <DatePicker
                                lang='es'
                                value={from}
                                cleanable={false}
                                shouldDisableDate={allowedRangeDates}
                                className='w-full rounded-md shadow'
                                menuClassName='shadow-lg z-30'
                                format='dd/MM/yyyy hh:mm:ss aa'
                                placement='bottomEnd'
                                onChange={(e: Date | null) => handleChangeDate(e, "from")}
                            />
                        </div>
                        <div className='flex flex-row items-center w-full gap-2 lg:w-auto text-brand-gray ms-4'>
                            <small className='text-sm font-medium'>Hasta</small>
                            <DatePicker
                                lang='es'
                                value={to}
                                cleanable={false}
                                shouldDisableDate={allowedRangeDates}
                                className='w-full rounded-md shadow'
                                menuClassName='shadow-lg z-30'
                                format='dd/MM/yyyy hh:mm:ss aa'
                                placement='bottomEnd'
                                onChange={(e: Date | null) => handleChangeDate(e, "to")}
                            />
                        </div>
                    </CustomProvider>
                </div>
            </div>
            <div className='grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3'>
                {(selectedOption.id == 0 || selectedOption.id == 1) && (
                    <div className='flex flex-row items-center w-full gap-3'>
                        <small className='mb-1 text-sm font-medium opacity-80'>Grupos</small>
                        <ListOfGroups data={groupsData.data} isLoading={groupsData.isLoading} setGroupsQuery={setGroupsQuery} />
                    </div>
                )}
                <div className='flex flex-row items-center w-full gap-3'>
                    <small className='mb-1 text-sm font-medium opacity-80'>Alertas</small>
                    <ListOfAlerts data={alertsData.data} isLoading={alertsData.isLoading} setNotificationsQuery={setNotificationsQuery} />
                </div>
                <div className='flex flex-row items-center w-full gap-3'>
                    <small className='mb-1 text-sm font-medium opacity-80'>Objetos</small>
                    <ListOfTrackers data={trackersData.data} isLoading={trackersData.isLoading} setTrackersQuery={setTrackersQuery} />
                </div>
                {/* <div className='flex flex-row items-center w-full gap-3'>
                    <small className='mb-1 text-sm font-medium opacity-80'>Etiquetas</small>
                    <ListOfTags setTagsQuery={setTrackersQuery} />
                </div> */}
            </div>
        </div>
    );
}
