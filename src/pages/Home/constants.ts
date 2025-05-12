type CardInfo = {
    label: string;
    accessor: string;
    endpoint: string;
    icon: string;
    value: number;
};

export const cardsInfo: CardInfo[] = [
    {
        label: "Vehículos",
        accessor: "vehicles_count",
        endpoint: "/home/count/vehicles",
        icon: "mgc_truck_line",
        value: 0,
    },
    {
        label: "Destinos",
        accessor: "destinies_count",
        icon: "mgc_map_line",
        endpoint: "/home/count/destinies",
        value: 0,
    },
    {
        label: "Viajes",
        accessor: "travels_count",
        icon: "mgc_route_line",
        endpoint: "/home/count/travels",
        value: 0,
    },
    {
        label: "Promedio",
        accessor: "average_count",
        icon: "mgc_chart_horizontal_line",
        endpoint: "/home/count/average",
        value: 0,
    },
    {
        label: "Viajes por día",
        accessor: "travels_per_day_count",
        icon: "mgc_map_pin_line",
        endpoint: "/home/count/travels_per_day",
        value: 0,
    },
    {
        label: "Tiempo estadía",
        accessor: "stay_time_count",
        icon: "mgc_time_duration_line",
        endpoint: "/home/count/stay_time",
        value: 0,
    },
];

export const chartMenus = ["Vehículos", "Destinos", "Viajes", "Promedio", "Viajes por día", "Tiempo estadía"];
