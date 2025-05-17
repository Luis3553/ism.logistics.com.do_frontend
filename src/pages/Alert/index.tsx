import "@charts/plugins/scrollWheelZoom";

import { GroupRow } from "./components/group-row";
import { AlertsByGroup, AlertsByType, Option } from "@utils/types";
import { useEffect, useMemo, useState } from "react";
import AlertHeader from "./components/header";
import { useFetch } from "@hooks/useFetch";
import { LoadSpinner } from "@components/LoadSpinner";
import debounce from "debounce";
import { DateRange } from "rsuite/esm/DateRangePicker";
import { NotificationTypeRow } from "./components/notification-type-row";
import { Button } from "@headlessui/react";

// const data: AlertsByGroup = {
//     groups: [
//         {
//             id: 201,
//             name: "Santo Domingo",
//             notifications: [
//                 {
//                     name: "Tracker Apagado o Pérdida de Conexión",
//                     trackers: [
//                         {
//                             notification_id: 649297082,
//                             name: "30-73 L0002901",
//                             emergency: false,
//                             vehicle_id: null,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:35:40 p.m.",
//                             time: "13d 9h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país, Direccion, municipio, ciudad, provincia, país",
//                         },
//                         {
//                             notification_id: 692292999,
//                             name: "30-73 L0002901",
//                             emergency: true,
//                             vehicle_id: 12345,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:30:20 p.m.",
//                             time: "7h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país",
//                         },
//                         {
//                             notification_id: 690392323,
//                             name: "30-73 L0002901",
//                             emergency: false,
//                             vehicle_id: null,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:35:40 p.m.",
//                             time: "9h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país, Direccion, municipio, ciudad, provincia, país",
//                         },
//                         {
//                             notification_id: 692292999,
//                             name: "30-73 L0002901",
//                             emergency: true,
//                             vehicle_id: 12345,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:30:20 p.m.",
//                             time: "7h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país",
//                         },
//                         {
//                             notification_id: 690392323,
//                             name: "30-73 L0002901",
//                             emergency: false,
//                             vehicle_id: null,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:35:40 p.m.",
//                             time: "9h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país, Direccion, municipio, ciudad, provincia, país",
//                         },
//                         {
//                             notification_id: 692292999,
//                             name: "30-73 L0002901",
//                             emergency: true,
//                             vehicle_id: 12345,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:30:20 p.m.",
//                             time: "7h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país",
//                         },
//                         {
//                             notification_id: 690392323,
//                             name: "30-73 L0002901",
//                             emergency: false,
//                             vehicle_id: null,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:35:40 p.m.",
//                             time: "9h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país, Direccion, municipio, ciudad, provincia, país",
//                         },
//                         {
//                             notification_id: 692292999,
//                             name: "30-73 L0002901",
//                             emergency: true,
//                             vehicle_id: 12345,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:30:20 p.m.",
//                             time: "7h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país",
//                         },
//                     ],
//                 },
//                 {
//                     name: "Ralentí",
//                     trackers: [
//                         {
//                             notification_id: 690392323,
//                             name: "30-73 L0002901",
//                             emergency: false,
//                             vehicle_id: null,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:30:20 p.m.",
//                             time: "9h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país",
//                         },
//                     ],
//                 },
//             ],
//         },
//         {
//             id: 202,
//             name: "Santiago Rodriguez",
//             notifications: [
//                 {
//                     name: "Tracker Apagado o Pérdida de Conexión",
//                     trackers: [
//                         {
//                             notification_id: 69032992323,
//                             name: "30-73 L0003033",
//                             emergency: true,
//                             vehicle_id: 12542,
//                             start_date: "08/05/2025 08:30:20 p.m.",
//                             end_date: "08/05/2025 08:30:20 p.m.",
//                             time: "2h 30min",
//                             address: "Direccion, municipio, ciudad, provincia, país",
//                         },
//                     ],
//                 },
//             ],
//         },
//     ],
// };

function formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

export function AlertsByGroupTable({ query, range }: { query: string; range: DateRange }) {
    const from = formatDate(range[0]);
    const to = formatDate(range[1]);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(`/notifications?groupBy=groups&s=${query}&from=${from}&to=${to}`);

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, range, debouncedSetQuery]);

    useEffect(() => {
        setUrl(`/notifications?groupBy=groups&s=${debouncedQuery}&from=${from}&to=${to}`);
    }, [debouncedQuery, range]);

    const { data, isLoading, error } = useFetch<AlertsByGroup>(url);

    if (isLoading) return <LoadSpinner />;

    if (error)
        return (
            <div className='py-8 m-4 font-medium text-center text-red-500 bg-red-100 border border-red-500 rounded-md'>
                <i className='mgc_warning_fill me-2'></i>
                Ha ocurrido un error
            </div>
        );

    if (data.groups.length == 0)
        return (
            <div className='p-8 m-4 font-medium text-center text-blue-500 bg-blue-100 border border-blue-500 rounded-md'>
                <i className='mgc_information_fill me-2'></i>
                No hay datos en el rango de fecha seleccionado
            </div>
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

export function AlertsByTypeTable({ query, range }: { query: string; range: DateRange }) {
    const from = formatDate(range[0]);
    const to = formatDate(range[1]);

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [url, setUrl] = useState(`/notifications?groupBy=notifications&s=${query}&from=${from}&to=${to}`);

    const debouncedSetQuery = useMemo(() => debounce((value: string) => setDebouncedQuery(value), 500), []);

    useEffect(() => {
        debouncedSetQuery(query);
    }, [query, range, debouncedSetQuery]);

    useEffect(() => {
        setUrl(`/notifications?groupBy=notifications&s=${debouncedQuery}&from=${from}&to=${to}`);
    }, [debouncedQuery, range]);

    const { data, isLoading, error } = useFetch<AlertsByType>(url);

    if (isLoading) return <LoadSpinner />;

    if (error)
        return (
            <div className='py-8 m-4 font-medium text-center text-red-500 bg-red-100 border border-red-500 rounded-md'>
                <i className='mgc_warning_fill me-2'></i>
                Ha ocurrido un error
            </div>
        );

    if (data.notifications.length == 0)
        return (
            <div className='p-8 m-4 font-medium text-center text-blue-500 bg-blue-100 border border-blue-500 rounded-md'>
                <i className='mgc_information_fill me-2'></i>
                No hay datos en el rango de fecha seleccionado
            </div>
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

const options: Option[] = [
    { id: 0, value: "Por grupos", component: (query: string, range: DateRange) => <AlertsByGroupTable query={query} range={range} />, icon: "mgc_group_line" },
    { id: 1, value: "Por alertas", component: (query: string, range: DateRange) => <AlertsByTypeTable query={query} range={range} />, icon: "mgc_notification_line" },
];

export const Alerts = () => {
    const today = useMemo(() => new Date(), []);

    const [option, setOption] = useState<Option>(options[0]);

    const [query, setQuery] = useState<string>("");
    const [range, setRange] = useState<DateRange>([
        new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 00:00:00`),
        new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 23:59:59`),
    ]);

    return (
        <>
            <div className='flex justify-between mb-2'>
                <h1 className='text-lg font-medium text-brand-dark-gray'>Listado de alertas</h1>
                <Button className='flex gap-2 px-3 py-1 font-medium transition rounded shadow cursor-pointer focus-visible:outline-0 focus-visible:text-white focus-visible:bg-brand-blue bg-brand-light-blue hover:bg-brand-blue hover:text-white text-brand-blue'>
                    <i className={`text-2xl text-inherit mgc_print_line`}></i>
                    <span>Imprimir</span>
                </Button>
            </div>
            <main className='p-4 bg-white rounded-lg shadow text-[#393939]'>
                <AlertHeader options={options} query={query} range={range} setRange={setRange} setQuery={setQuery} selectedOption={option} setOption={setOption} />
                <div className='p-0 mt-4 overflow-hidden rounded-lg shadow border border-[#CECECE]'>
                    <table className='w-full table-fixed'>
                        <tbody>{option.component(query, range)}</tbody>
                    </table>
                </div>
            </main>
        </>
    );
};
