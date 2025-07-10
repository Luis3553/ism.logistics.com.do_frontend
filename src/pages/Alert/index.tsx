import "@charts/plugins/scrollWheelZoom";

import { Option } from "@utils/types";
import { useEffect, useMemo, useState } from "react";
import AlertHeader from "./components/header";
// import { useFetch } from "@hooks/useFetch";
import { LuDownload } from "react-icons/lu";
import { PiFileXlsFill } from "react-icons/pi";
import { useApiQuery } from "@hooks/useQuery";
import DropdownMenuButton from "./components/dropdown-button";
import { toISOString } from "@utils/dateISOformatter";
import { useFetch } from "@hooks/useFetch";
import api from "@api/index";
import { CustomProvider, Message, useToaster } from "rsuite";
import { esES } from "rsuite/esm/locales";
import { format } from "date-fns";
import cn from "classnames";
import { AlertsByGroupTable, AlertsByObjectTable, AlertsByTypeTable } from "./components/alert-tables-tabs";
import { Transition } from "@headlessui/react";
import { appearAnimationProps } from "@utils/animations";
import { ErrorBoundary } from "react-error-boundary";

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
    const [from, setFrom] = useState<Date | null>(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));
    const [to, setTo] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

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

        setPayload(newPayload);
    }, [from, to, option.value, groupsQuery, alertsData, notificationsQuery, groupsData, trackersQuery, trackersData, tagsQuery]);

    type Response = {
        message: string;
        report: {
            id: number;
            title: string;
            percent: number;
            report_payload: any;
            report_type_id: number;
            user_id: number;
            created_at: string;
            updated_at: string;
        };
    };

    const toaster = useToaster();

    const messageToaster = (message: string, type: "warning" | "success" | "info" | "error" = "error") => (
        <Message
            className={cn(
                "*:flex *:flex-row *:items-center border bg-white/75 my-2 *:gap-x-4 p-4 rounded-lg transition-all duration-500 backdrop-blur-sm hover:backdrop-blur-md",
                type === "success" && "border-green-500/75 text-green-500",
                type === "warning" && "border-amber-400/75 text-amber-400",
                type === "info" && "border-blue-500/75 text-blue-500",
                type === "error" && "border-red-500/75 text-red-500",
            )}
            showIcon
            type={type ?? "error"}
            closable>
            {message}
        </Message>
    );

    const [reportId, setReportId] = useState<number | null>(null);
    const [reportTitle, setReportTitle] = useState<string | null>(null);
    const [pollingEnabled, setPollingEnabled] = useState(reportId !== null);
    const [hasDownloaded, setHasDownloaded] = useState(false);

    type ReportStatus = {
        id: number;
        percent: number;
        status: string;
    };
    const { data: updated } = useApiQuery<ReportStatus>(`/reports/${reportId}/status`, {
        interval: pollingEnabled ? 1000 * 3 : false,
        disable: !pollingEnabled,
        retry: false,
        staleTime: 1000 * 60 * 2,
    });

    useEffect(() => {
        const handleDownload = async () => {
            if (updated?.percent! >= 100) {
                setPollingEnabled(false);
                try {
                    const response = await api.get(`/reports/${reportId}/download?format=xlsx`, {
                        responseType: "blob",
                    });
                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `${(reportTitle ?? "Reporte de alertas").split(" ").join("_")}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setHasDownloaded(true);
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    toaster.push(messageToaster(`No se ha podido descargar el reporte "${reportTitle}"`, "error"), {
                        duration: 5000,
                        placement: "topEnd",
                    });
                    console.error("Failed to download report:", error);
                }
                toaster.push(messageToaster(`El reporte se ha generado correctamente`, "success"), {
                    duration: 1000 * 5,
                    placement: "topStart",
                });
                setPollingEnabled(false);
                setReportId(null);
                setReportTitle(null);
            }
        };
        if (!hasDownloaded) handleDownload();
    }, [updated]);
    return (
        <>
            <div className='flex justify-between mb-2'>
                <h1 className='text-lg font-medium text-brand-dark-gray'>Listado de alertas</h1>

                <div className='relative flex items-center group gap-x-2'>
                    {updated && reportId !== null && (
                        <Transition show={updated !== undefined} {...appearAnimationProps}>
                            <div className='flex items-center gap-x-2'>
                                <small className='text-green-500'>{updated?.percent}%</small>
                                <div className='w-40 h-2 overflow-hidden bg-gray-300 rounded-lg'>
                                    <div
                                        style={{
                                            width: `${updated.percent ?? 0}%`,
                                        }}
                                        className='h-full transition-all duration-500 bg-green-500 rounded-lg animate-pulse'></div>
                                </div>
                            </div>
                        </Transition>
                    )}
                    <DropdownMenuButton
                        className={updated && reportId !== null && updated.percent < 100 ? "animate-pulse pointer-events-none" : undefined}
                        name='Descargar'
                        icon={<LuDownload />}
                        options={[
                            // {
                            //     label: "PDF",
                            //     disabled: true,
                            //     onClick: () => {
                            //         api.post("/reports/generate", { ...payload, format: "pdf" });
                            //     },
                            //     icon: <PiFilePdfFill />,
                            // },
                            {
                                label: "XLS",
                                disabled: false,
                                onClick: async () => {
                                    toaster.push(messageToaster("Generando reporte...", "info"), { duration: 1000 * 5, placement: "topStart" });
                                    try {
                                        await api
                                            .post<Response>("/reports/generate", { ...payload, format: "xls" })
                                            .then(async (res) => {
                                                if (res.status === 201) {
                                                    toaster.clear();
                                                    toaster.push(messageToaster("Descargando reporte...", "success"), { duration: 1000 * 5, placement: "topStart" });

                                                    setHasDownloaded(false);
                                                    setReportId(res.data.report.id);
                                                    setReportTitle(res.data.report.title);
                                                    setPollingEnabled(true);
                                                }
                                                if (res.data.report.percent < 0) {
                                                    setReportId(null);
                                                    setPollingEnabled(false);
                                                    toaster.push(messageToaster("Hubo un error generando el reporte", "error"), { duration: 1000 * 5, placement: "topStart" });
                                                    throw new Error("Error al generar el reporte");
                                                }
                                            })
                                            .catch(() => {
                                                setReportId(null);
                                                setPollingEnabled(false);
                                                toaster.push(messageToaster("Hubo un error generando el reporte", "error"), { duration: 1000 * 5, placement: "topStart" });
                                                throw new Error("Error al generar el reporte");
                                            });
                                    } catch (error) {
                                        setReportId(null);
                                        setPollingEnabled(false);
                                        toaster.push(messageToaster("Hubo un error generando el reporte", "error"), { duration: 1000 * 5, placement: "topStart" });
                                    }
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
                                <ErrorBoundary fallback={<div className='text-red-500'>Hubo un error al cargar la tabla. Por favor, inténtelo de nuevo.</div>}>
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
                                </ErrorBoundary>
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </>
    );
};
