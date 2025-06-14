import "@charts/plugins/scrollWheelZoom";

import { GroupRow } from "./components/group-row";
import { AlertsByGroup, AlertsByTracker, AlertsByType, Option } from "@utils/types";
import { useEffect, useMemo, useState } from "react";
import AlertHeader from "./components/header";
// import { useFetch } from "@hooks/useFetch";
import { LoadSpinner } from "@components/LoadSpinner";
import { debounce } from "lodash";
import { NotificationTypeRow } from "./components/notification-type-row";
import { TrackerRow } from "./components/tracker-row";
import { LuDownload } from "react-icons/lu";
import { PiFilePdfFill, PiFileXlsFill } from "react-icons/pi";
import { useApiQuery } from "@hooks/useQuery";
import DropdownMenuButton from "./components/dropdown-button";
import { toISOString } from "@utils/dateISOformatter";
import { useFetch } from "@hooks/useFetch";
import api from "@api/index";
import { CustomProvider } from "rsuite";
import { esES } from "rsuite/esm/locales";
import { format } from "date-fns";

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
    console.log(allTrackers);
    const fromStr = formatDate(from);
    const toStr = formatDate(to);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=groups&s=${query}&from=${fromStr}&to=${toStr}&groups=${groupsQuery[0] === "all" ? allGroups : groupsQuery.join(",")}&notifications=${
            notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
        }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, groupsQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=groups&s=${debouncedQuery}&from=${fromStr}&to=${toStr}&groups=${groupsQuery[0] === "all" ? allGroups : groupsQuery.join(",")}&notifications=${
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
    const fromStr = formatDate(from);
    const toStr = formatDate(to);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=notifications&s=${query}&from=${fromStr}&to=${toStr}&groups=${groupsQuery[0] === "all" ? allGroups : groupsQuery.join(",")}&notifications=${
            notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
        }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, groupsQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=notifications&s=${debouncedQuery}&from=${fromStr}&to=${toStr}&groups=${
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
    const fromStr = formatDate(from);
    const toStr = formatDate(to);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(
        `/notifications?groupBy=tracker&s=${query}&from=${fromStr}&to=${toStr}&notifications=${
            notificationsQuery[0] === "all" ? allAlerts : notificationsQuery.join(",")
        }&trackers=${trackersQuery[0] === "all" ? allTrackers : trackersQuery.join(",")}`,
    );

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, from, to, debouncedSetQuery, notificationsQuery, trackersQuery]);

    useEffect(() => {
        setUrl(
            `/notifications?groupBy=tracker&s=${debouncedQuery}&from=${fromStr}&to=${toStr}&notifications=${
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
        value: "groups",
        label: "Por grupos",
        component: (
            query: string,
            from: Date | null,
            to: Date,
            groupsQuery: Array<number | string>,
            notificationsQuery: Array<number | string>,
            trackersQuery: Array<number | string>,
            allAlerts: Array<number | string>,
            allGroups: Array<number>,
            allTrackers: Array<number>,
        ) => (
            <AlertsByGroupTable
                query={query}
                from={from}
                to={to}
                groupsQuery={groupsQuery}
                notificationsQuery={notificationsQuery}
                trackersQuery={trackersQuery}
                allAlerts={allAlerts}
                allGroups={allGroups}
                allTrackers={allTrackers}
            />
        ),
        icon: "mgc_group_line",
    },
    {
        id: 1,
        value: "notifications",
        label: "Por alertas",
        component: (
            query: string,
            from: Date | null,
            to: Date,
            groupsQuery: Array<number | string>,
            notificationsQuery: Array<number | string>,
            trackersQuery: Array<number | string>,
            allAlerts: Array<number | string>,
            allGroups: Array<number>,
            allTrackers: Array<number>,
        ) => (
            <AlertsByTypeTable
                query={query}
                from={from}
                to={to}
                groupsQuery={groupsQuery}
                notificationsQuery={notificationsQuery}
                trackersQuery={trackersQuery}
                allAlerts={allAlerts}
                allGroups={allGroups}
                allTrackers={allTrackers}
            />
        ),
        icon: "mgc_notification_line",
    },
    {
        id: 2,
        value: "trackers",
        label: "Por objetos",
        component: (
            query: string,
            from: Date | null,
            to: Date,
            // @ts-ignore
            groupsQuery: Array<number | string>,
            notificationsQuery: Array<number | string>,
            trackersQuery: Array<number | string>,
            allAlerts: Array<number | string>,
            allGroups: Array<number>,
            allTrackers: Array<number>,
        ) => (
            <AlertsByObjectTable
                query={query}
                from={from}
                to={to}
                notificationsQuery={notificationsQuery}
                trackersQuery={trackersQuery}
                allAlerts={allAlerts}
                allGroups={allGroups}
                allTrackers={allTrackers}
            />
        ),
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
    const [tagsQuery, setTagsQuery] = useState<Array<number | string>>(["all"]);

    const [payload, setPayload] = useState<Record<string, any>>();

    const alerts = useFetch<Option[]>("/notifications/rules");
    const groups = useFetch<Option[]>("/notifications/groups");
    const trackers = useFetch<Option[]>("/notifications/trackers");

    const [alertsData, setAlertsData] = useState<Option[]>();
    const [groupsData, setGroupsData] = useState<Option[]>();
    const [trackersData, setTrackersData] = useState<Option[]>();

    useEffect(() => {
        if (alerts.data) {
            setAlertsData(alerts.data);
            notificationsQuery;
        }
        if (groups.data) {
            setGroupsData(groups.data);
        }
        if (trackers.data) {
            setTrackersData(trackers.data);
        }
    }, [groups, alerts, trackers]);

    useEffect(() => {
        const newPayload: any = {
            report_type_id: 3,
            report_payload: {},
        };

        newPayload.report_payload.groupBy = option.value;
        newPayload.report_payload.title = `Reporte de eventos - ${format(today, "dd-MM-yyyy hh_mm")}`;

        if (from) newPayload.report_payload.from = toISOString(from);
        if (to) newPayload.report_payload.to = toISOString(to);

        if (groupsQuery && groupsData) newPayload.report_payload.groups = groupsQuery[0] === "all" ? groupsData.flatMap((group) => group.value) : [...groupsQuery];
        if (notificationsQuery && alertsData)
            newPayload.report_payload.notifications = notificationsQuery[0] === "all" ? alertsData.flatMap((alert) => alert.value) : [...notificationsQuery];
        if (trackersQuery && trackersData) newPayload.report_payload.trackers = trackersQuery[0] === "all" ? trackersData.flatMap((tracker) => tracker.value) : [...trackersQuery];
        // groupby, title

        setPayload(newPayload);
    }, [from, to, option.value, groupsQuery, alertsData, notificationsQuery, groupsData, trackersQuery, trackersData, tagsQuery]);

    return (
        <>
            <div className='flex justify-between mb-2'>
                <h1 className='text-lg font-medium text-brand-dark-gray'>Listado de alertas</h1>
                <div className='relative group'>
                    <DropdownMenuButton
                        name='Descargar'
                        icon={<LuDownload />}
                        options={[
                            {
                                label: "PDF",
                                disabled: true,
                                onClick: () => {
                                    api.post("/reports/generate", { ...payload, format: "pdf" });
                                },
                                icon: <PiFilePdfFill />,
                            },
                            {
                                label: "XLS",
                                disabled: false,
                                onClick: () => {
                                    api.post("/reports/generate", { ...payload, format: "xls" });
                                },
                                icon: <PiFileXlsFill />,
                            },
                        ]}
                    />
                </div>
            </div>
            <main className='p-4 bg-white rounded-lg shadow text-[#393939]'>
                <CustomProvider locale={esES}>
                    <AlertHeader
                        options={options}
                        query={query}
                        from={from}
                        to={to}
                        selectedOption={option}
                        alertsData={alerts}
                        groupsData={groups}
                        trackersData={trackers}
                        setFrom={setFrom}
                        setTo={setTo}
                        setQuery={setQuery}
                        setOption={setOption}
                        setGroupsQuery={setGroupsQuery}
                        setNotificationsQuery={setNotificationsQuery}
                        setTrackersQuery={setTrackersQuery}
                        setTagsQuery={setTagsQuery}
                    />
                </CustomProvider>

                {alertsData && groupsData && trackersData && (
                    <div className='p-0 mt-4 overflow-hidden rounded-lg shadow border border-[#CECECE]'>
                        <table className='w-full table-fixed'>
                            <tbody className='*:border-b last:*:border-b-0'>
                                {option.component(
                                    query,
                                    from,
                                    to,
                                    groupsQuery,
                                    notificationsQuery,
                                    trackersQuery,
                                    alertsData.flatMap((alert) => alert.value),
                                    groupsData.flatMap((group) => group.value),
                                    trackersData.flatMap((tracker) => tracker.value),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </>
    );
};
