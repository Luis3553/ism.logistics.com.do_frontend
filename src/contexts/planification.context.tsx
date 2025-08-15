import { create } from "zustand";

/* 
'*.title'         => 'required|string',
'*.province'      => 'nullable|string',
'*.zone'          => 'nullable|string',
'*.sector'        => 'nullable|string',
'*.address'       => 'nullable|string',
'*.lat'           => 'required|numeric|between:-90,90',
'*.lng'           => 'required|numeric|between:-180,180',
'*.description'   => 'nullable|string',
'*.order_time'    => 'required|date',
'*.external_id'   => 'required|string|min:1',
*/

export type Order = {
    id: number;
    title: string;
    province: string;
    zone: string;
    sector: string;
    address: string;
    lat: number;
    lng: number;
    description: string;
    order_time: Date;
    external_id: string;
    is_dispatched?: boolean;
}

type PlanificationStore = {
    routeName: string;
    setRouteName: (name: string) => void;
    routePaneOpen: boolean;
    setRoutePaneOpen: (open: boolean) => void;
    orders: Order[];
    setOrders: (orders: any[]) => void;
    selectedOrders: Order[];
    setSelectedOrders: (orders: Order[]) => void;
};

export const usePlanificationStore = create<PlanificationStore>((set) => ({
    routeName: "Ruta 1",
    setRouteName: (name: string) => set({ routeName: name }),
    routePaneOpen: true,
    setRoutePaneOpen: (open: boolean) => set({ routePaneOpen: open }),
    orders: [
        // {
        //     id: 1,
        //     title: "Orden 1",
        //     province: "Santo Domingo",
        //     zone: "Zona A",
        //     sector: "Sector 1",
        //     address: "Calle 1, Ciudad",
        //     lat: 18.4861,
        //     lng: -69.9312,
        //     description: "Descripción de la orden 1",
        //     order_time: new Date("2023-10-01"),
        //     external_id: "0"
        // },
        // {
        //     id: 2,
        //     title: "Orden 2",
        //     province: "Samana",
        //     zone: "Zona B",
        //     sector: "Sector 1",
        //     address: "Calle 1, Ciudad",
        //     lat: 18.4861,
        //     lng: -69.9312,
        //     description: "Descripción de la orden 1",
        //     order_time: new Date("2023-10-01"),
        //     external_id: "0"
        // },
        // {
        //     id: 3,
        //     title: "Orden 3",
        //     province: "Santiago",
        //     zone: "Zona C",
        //     sector: "Sector 3",
        //     address: "Calle 3, Ciudad",
        //     lat: 18.4861,
        //     lng: -69.9312,
        //     description: "Descripción de la orden 1",
        //     order_time: new Date("2023-10-01"),
        //     external_id: "0"
        // },
        // {
        //     id: 4,
        //     title: "Orden 4",
        //     province: "Santiago",
        //     zone: "Zona C",
        //     sector: "Sector 3",
        //     address: "Calle 3, Ciudad",
        //     lat: 18.4861,
        //     lng: -69.9312,
        //     description: "Descripción de la orden 1",
        //     order_time: new Date("2023-10-01"),
        //     external_id: "0"
        // },
        // {
        //     id: 5,
        //     title: "Orden 5",
        //     province: "Santiago",
        //     zone: "Zona C",
        //     sector: "Sector 3",
        //     address: "Calle 3, Ciudad",
        //     lat: 18.4861,
        //     lng: -69.9312,
        //     description: "Descripción de la orden 1",
        //     order_time: new Date("2023-10-01"),
        //     external_id: "0"
        // },
    ],
    setOrders: (orders: Order[]) => set({ orders }),
    selectedOrders: [],
    setSelectedOrders: (orders: any[]) => set({ selectedOrders: orders }),
}));
