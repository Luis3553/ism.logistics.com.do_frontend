import { CardProps } from "./types";

export const bottomCardsStructure: CardProps[] = [
    {
        title: "odómetro",
        icon: "mgc_route_line",
        value: 0,
        valueSubfix: " Km",
    },
    {
        title: "horas trabajadas",
        icon: "mgc_dashboard_3_line",
        value: "00:00",
    },
    {
        title: "EMPTY",
        icon: "",
        value: "00:00",
    },
    {
        title: "horas inactivas",
        icon: "mgc_parking_line",
        value: "00:00",
    },
];

export const averageGeneralDataCardsStructure: CardProps[] = [
    {
        title: "Tiempo de viaje",
        icon: "mgc_time_duration_line",
        value: "00:00",
    },
    {
        title: "Distancia recorrida",
        icon: "mgc_route_line",
        value: 0,
        valueSubfix: " Km",
    },
    {
        title: "Velocidad",
        icon: "mgc_dashboard_3_line",
        value: 0,
        valueSubfix: " Km/h",
    },
    {
        title: "Tiempo en movimiento",
        icon: "mgc_navigation_line",
        value: "00:00",
    },
];

export const VehicleCardLineInfoStructure: Pick<CardProps, "title" | "value">[] = [
    { title: "Vehículos", value: 0 },
    { title: "Viajes totales", value: 0 },
    { title: "Horas en movimiento", value: "00:00" },
    { title: "Horas de viaje", value: "00:00" },
];
