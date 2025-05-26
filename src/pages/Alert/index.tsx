import "@charts/plugins/scrollWheelZoom";

import { GroupRow } from "./components/group-row";
import { AlertsByGroup, AlertsByTracker, AlertsByType, Option } from "@utils/types";
import { useEffect, useMemo, useState } from "react";
import AlertHeader from "./components/header";
import { useFetch } from "@hooks/useFetch";
import { LoadSpinner } from "@components/LoadSpinner";
import { debounce } from "lodash";
import { NotificationTypeRow } from "./components/notification-type-row";
import { TrackerRow } from "./components/tracker-row";

function formatDate(date: Date | null): string {
    if (date === null) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

export function AlertsByGroupTable({
    query,
    from,
    to,
    groupsQuery,
    notificationsQuery,
    trackersQuery,
}: {
    query: string;
    from: Date | null;
    to: Date;
    groupsQuery: Array<number | string>;
    notificationsQuery: Array<number | string>;
    trackersQuery: Array<number | string>;
}) {
    const fromStr = formatDate(from);
    const toStr = formatDate(to);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=groups&s=${query}&from=${fromStr}&to=${toStr}&groups=${groupsQuery}&notifications=${notificationsQuery.join(",")}&trackers=${trackersQuery.join(
            ",",
        )}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, groupsQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=groups&s=${debouncedQuery}&from=${fromStr}&to=${toStr}&groups=${groupsQuery}&notifications=${notificationsQuery.join(
                ",",
            )}&trackers=${trackersQuery.join(",")}`,
        );
    }, [debouncedQuery, from, to, groupsQuery, notificationsQuery, trackersQuery]);

    const { data, isLoading, error } = useFetch<AlertsByGroup>(url);

    if (isLoading)
        return (
            <tr>
                <td colSpan={5} className='relative h-32 *:top-10'>
                    <LoadSpinner />
                </td>
            </tr>
        );

    if (error)
        return (
            <tr>
                <td colSpan={5}>
                    <div className='py-8 m-4 font-medium text-center text-red-500 bg-red-100 border border-red-500 rounded-md'>
                        <i className='mgc_warning_fill me-2'></i>
                        Ha ocurrido un error
                    </div>
                </td>
            </tr>
        );

    if (data.groups.length == 0)
        return (
            <tr>
                <td colSpan={5}>
                    <div className='p-8 m-4 font-medium text-center text-blue-500 bg-blue-100 border border-blue-500 rounded-md'>
                        <i className='mgc_information_fill me-2'></i>
                        No hay datos en el rango de fecha seleccionado
                    </div>
                </td>
            </tr>
        );

    if (data && !isLoading)
        return (
            <>
                {data.groups.map((group, groupIdx) => (
                    <GroupRow group={group} key={`group-${group.id}-${groupIdx}`} />
                ))}
            </>
        );
}

export function AlertsByTypeTable({
    query,
    from,
    to,
    groupsQuery,
    notificationsQuery,
    trackersQuery,
}: {
    query: string;
    from: Date | null;
    to: Date;
    groupsQuery: Array<number | string>;
    notificationsQuery: Array<number | string>;
    trackersQuery: Array<number | string>;
}) {
    const fromStr = formatDate(from);
    const toStr = formatDate(to);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=notifications&s=${query}&from=${fromStr}&to=${toStr}&groups=${groupsQuery}&notifications=${notificationsQuery.join(
            ",",
        )}&trackers=${trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, groupsQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=notifications&s=${debouncedQuery}&from=${fromStr}&to=${toStr}&groups=${groupsQuery}&notifications=${notificationsQuery.join(
                ",",
            )}&trackers=${trackersQuery.join(",")}`,
        );
    }, [debouncedQuery, from, to, groupsQuery, notificationsQuery, trackersQuery]);

    const { data, isLoading, error } = useFetch<AlertsByType>(url);

    if (isLoading) return;
    <tr>
        <td colSpan={5}>
            <LoadSpinner />
        </td>
    </tr>;

    if (error)
        return (
            <tr>
                <td colSpan={5}>
                    <div className='py-8 m-4 font-medium text-center text-red-500 bg-red-100 border border-red-500 rounded-md'>
                        <i className='mgc_warning_fill me-2'></i>
                        Ha ocurrido un error
                    </div>
                </td>
            </tr>
        );

    if (data.notifications.length == 0)
        return (
            <tr>
                <td colSpan={5}>
                    <div className='p-8 m-4 font-medium text-center text-blue-500 bg-blue-100 border border-blue-500 rounded-md'>
                        <i className='mgc_information_fill me-2'></i>
                        No hay datos en el rango de fecha seleccionado
                    </div>
                </td>
            </tr>
        );

    if (data && !isLoading)
        return (
            <>
                {data.notifications.map((notification, notificationIdx) => (
                    <NotificationTypeRow notification={notification} key={`group-${notificationIdx}`} />
                ))}
            </>
        );
}

export function AlertsByObjectTable({
    query,
    from,
    to,
    notificationsQuery,
    trackersQuery,
}: {
    query: string;
    from: Date | null;
    to: Date;
    notificationsQuery: Array<number | string>;
    trackersQuery: Array<number | string>;
}) {
    const fromStr = formatDate(from);
    const toStr = formatDate(to);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=tracker&s=${query}&from=${fromStr}&to=${toStr}&notifications=${notificationsQuery.join(",")}&trackers=${trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(`/notifications?groupBy=tracker&s=${debouncedQuery}&from=${fromStr}&to=${toStr}&notifications=${notificationsQuery.join(",")}&trackers=${trackersQuery.join(",")}`);
    }, [debouncedQuery, from, to, notificationsQuery, trackersQuery]);

    const { data, isLoading, error } = useFetch<AlertsByTracker>(url);

    if (isLoading) return;
    <tr>
        <td colSpan={5}>
            <LoadSpinner />
        </td>
    </tr>;

    if (error)
        return (
            <tr>
                <td colSpan={5}>
                    <div className='py-8 m-4 font-medium text-center text-red-500 bg-red-100 border border-red-500 rounded-md'>
                        <i className='mgc_warning_fill me-2'></i>
                        Ha ocurrido un error
                    </div>
                </td>
            </tr>
        );

    if (data.trackers.length == 0)
        return (
            <tr>
                <td colSpan={5}>
                    <div className='p-8 m-4 font-medium text-center text-blue-500 bg-blue-100 border border-blue-500 rounded-md'>
                        <i className='mgc_information_fill me-2'></i>
                        No hay datos en el rango de fecha seleccionado
                    </div>
                </td>
            </tr>
        );

    if (data && !isLoading)
        return (
            <>
                {data.trackers.map((tracker, trackerIdx) => (
                    <TrackerRow tracker={tracker} key={`group-${trackerIdx}`} />
                ))}
            </>
        );
}

const options: Option[] = [
    {
        id: 0,
        value: "Por grupos",
        component: (
            query: string,
            from: Date | null,
            to: Date,
            groupsQuery: Array<number | string>,
            notificationsQuery: Array<number | string>,
            trackersQuery: Array<number | string>,
        ) => <AlertsByGroupTable query={query} from={from} to={to} groupsQuery={groupsQuery} notificationsQuery={notificationsQuery} trackersQuery={trackersQuery} />,
        icon: "mgc_group_line",
    },
    {
        id: 1,
        value: "Por alertas",
        component: (
            query: string,
            from: Date | null,
            to: Date,
            groupsQuery: Array<number | string>,
            notificationsQuery: Array<number | string>,
            trackersQuery: Array<number | string>,
        ) => <AlertsByTypeTable query={query} from={from} to={to} groupsQuery={groupsQuery} notificationsQuery={notificationsQuery} trackersQuery={trackersQuery} />,
        icon: "mgc_notification_line",
    },
    {
        id: 2,
        value: "Por objetos",
        component: (
            query: string,
            from: Date | null,
            to: Date,
            // @ts-ignore
            groupsQuery: Array<number | string>,
            notificationsQuery: Array<number | string>,
            trackersQuery: Array<number | string>,
        ) => <AlertsByObjectTable query={query} from={from} to={to} notificationsQuery={notificationsQuery} trackersQuery={trackersQuery} />,
        icon: "mgc_truck_line",
    },
];

export const Alerts = () => {
    const today = useMemo(() => new Date(), []);

    const [option, setOption] = useState<Option>(options[0]);

    const [query, setQuery] = useState<string>("");
    const [from, setFrom] = useState<Date | null>(new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 00:00:00`));
    const [to, setTo] = useState<Date>(new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 23:59:59`));
    const [groupsQuery, setGroupsQuery] = useState<Array<number | string>>(["all"]);
    const [notificationsQuery, setNotificationsQuery] = useState<Array<number | string>>(["all"]);
    const [trackersQuery, setTrackersQuery] = useState<Array<number | string>>(["all"]);
    return (
        <>
            <div className='flex justify-between mb-2'>
                <h1 className='text-lg font-medium text-brand-dark-gray'>Listado de alertas</h1>
                <button className='flex items-center gap-2 px-3 py-1 font-medium transition rounded shadow cursor-pointer focus-visible:outline-0 focus-visible:text-white focus-visible:bg-brand-blue bg-brand-light-blue hover:bg-brand-blue hover:text-white text-brand-blue'>
                    <i className={`text-2xl text-inherit mgc_print_line`}></i>
                    <span>Imprimir</span>
                </button>
            </div>
            <main className='p-4 bg-white rounded-lg shadow text-[#393939]'>
                <AlertHeader
                    options={options}
                    query={query}
                    from={from}
                    setFrom={setFrom}
                    to={to}
                    setTo={setTo}
                    setQuery={setQuery}
                    selectedOption={option}
                    setOption={setOption}
                    setGroupsQuery={setGroupsQuery}
                    setNotificationsQuery={setNotificationsQuery}
                    setTrackersQuery={setTrackersQuery}
                />
                <div className='p-0 mt-4 overflow-hidden rounded-lg shadow border border-[#CECECE]'>
                    <table className='w-full table-fixed'>
                        <tbody className='*:border-b last:*:border-b-0'>{option.component(query, from, to, groupsQuery, notificationsQuery, trackersQuery)}</tbody>
                    </table>
                </div>
            </main>
        </>
    );
};
