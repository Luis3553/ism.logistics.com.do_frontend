import { LoadSpinner } from "@components/LoadSpinner";
import { TrackerRow } from "./tracker-row";
import { useApiQuery } from "@hooks/useQuery";
import { AlertsByGroup, AlertsByTracker, AlertsByType } from "@utils/types";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { NotificationTypeRow } from "./notification-type-row";
import { GroupRow } from "./group-row";
// import { toISOString } from "@utils/dateISOformatter";

// function formatDate(date: Date | null): string {
//     if (date === null) return "";
//     return toISOString(date);
//     // return format(date, "yyyy-MM-dd HH:mm:ss");
// }

export function AlertsByGroupTable({
    query,
    from,
    to,
    groupsQuery,
    notificationsQuery,
    trackersQuery,
    allAlerts,
    allGroups,
    allTrackers,
}: {
    query: string;
    from: Date | null;
    to: Date;
    groupsQuery: Array<number | string>;
    notificationsQuery: Array<number | string>;
    trackersQuery: Array<number | string>;
    allAlerts: Array<number | string>;
    allGroups: Array<number>;
    allTrackers: Array<number>;
}) {
    const fromUtc = from ? from.toISOString() : "";
    const toUtc = to ? to.toISOString() : "";
    // send fromUtc and toUtc to the API

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=groups&s=${query}&from=${fromUtc}&to=${toUtc}&groups=${groupsQuery[0] === "all" ? allGroups : groupsQuery.join(",")}&notifications=${
            notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
        }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, groupsQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=groups&s=${debouncedQuery}&from=${fromUtc}&to=${toUtc}&groups=${groupsQuery[0] === "all" ? allGroups : groupsQuery.join(",")}&notifications=${
                notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
            }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
        );
    }, [debouncedQuery, from, to, groupsQuery, notificationsQuery, trackersQuery]);

    const { data, isLoading, error } = useApiQuery<AlertsByGroup>(url, { interval: 1000 * 60 });

    if (isLoading || !data)
        return (
            <tr>
                <td colSpan={5} className='relative h-52'>
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

    if (data && data.groups.length == 0)
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
        // exportStyledAlertsReport(data, "10/05/2025 00:00 AM - 15/05/2025 00:00 AM")
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
    allAlerts,
    allGroups,
    allTrackers,
}: {
    query: string;
    from: Date | null;
    to: Date;
    groupsQuery: Array<number | string>;
    notificationsQuery: Array<number | string>;
    trackersQuery: Array<number | string>;
    allAlerts: Array<number | string>;
    allGroups: Array<number>;
    allTrackers: Array<number>;
}) {
    const fromUtc = from ? from.toISOString() : null;
    const toUtc = to ? to.toISOString() : null;
    // send fromUtc and toUtc to the API

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=notifications&s=${query}&from=${fromUtc}&to=${toUtc}&groups=${groupsQuery[0] === "all" ? allGroups : groupsQuery.join(",")}&notifications=${
            notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
        }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, groupsQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=notifications&s=${debouncedQuery}&from=${fromUtc}&to=${toUtc}&groups=${
                groupsQuery[0] === "all" ? allGroups : groupsQuery.join(",")
            }&notifications=${notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")}&trackers=${
                trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")
            }`,
        );
    }, [debouncedQuery, from, to, groupsQuery, notificationsQuery, trackersQuery]);

    const { data, isLoading, error } = useApiQuery<AlertsByType>(url, { interval: 1000 * 60 });

    if (isLoading || !data)
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

    if (data && data.notifications.length == 0)
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
    allAlerts,
    // @ts-ignore
    allGroups,
    allTrackers,
}: {
    query: string;
    from: Date | null;
    to: Date;
    notificationsQuery: Array<number | string>;
    trackersQuery: Array<number | string>;
    allAlerts: Array<number | string>;
    allGroups: Array<number>;
    allTrackers: Array<number>;
}) {
    const fromUtc = from ? from.toISOString() : null;
    const toUtc = to ? to.toISOString() : null;
    // send fromUtc and toUtc to the API

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=trackers&s=${query}&from=${fromUtc}&to=${toUtc}&notifications=${
            notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
        }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=trackers&s=${debouncedQuery}&from=${fromUtc}&to=${toUtc}&notifications=${
                notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
            }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
        );
    }, [debouncedQuery, from, to, notificationsQuery, trackersQuery]);

    const { data, isLoading, error } = useApiQuery<AlertsByTracker>(url, { interval: 1000 * 60 });

    if (isLoading || !data)
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

    if (data && data.trackers.length == 0)
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
