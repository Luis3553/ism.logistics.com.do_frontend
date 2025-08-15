import { HiArrowRight, HiOutlineTrash, HiPlus } from "react-icons/hi2";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { AgGridReact } from "ag-grid-react";
import { CellValueChangedEvent, ColDef, themeBalham } from "ag-grid-community";
import { Order, usePlanificationStore } from "@contexts/planification.context";
import { Whisper } from "rsuite";
import { tooltip } from "@utils/ui";
import api from "@api/index";
import { useApiQuery } from "@hooks/useQuery";
import { LoadSpinner } from "@components/LoadSpinner";
import { Button } from "@components/Button";
import { useModalAction } from "@contexts/modal-context";
import { AG_GRID_LOCALE_ES } from "@utils/ag-grid-es-ES";
import RoutePane from "./components/routePane";

export const Planification = () => {
    const columnTypes = useMemo(() => {
        return {
            text: {
                cellClass: "text-class",
            },
            date: {
                cellClass: "date-class",
            },
        };
    }, []);

    const columnDefs: ColDef[] = [
        {
            headerName: "",
            cellRenderer: () => (
                <Whisper speaker={tooltip("Mover orden a la ruta")} placement='topStart'>
                    <button className='flex items-center justify-center w-full h-full p-2 transition'>
                        <HiArrowRight />
                    </button>
                </Whisper>
            ),
            editable: false,
            width: 20,
            cellStyle: {
                padding: "0",
            },
            onCellClicked: (e) => {
                // const rowData = e.data;
                const latestSelectedOrders = usePlanificationStore.getState().selectedOrders;
                setSelectedOrders([...latestSelectedOrders, e.data]);
                setOrders(orders.filter((order) => order.id !== e.data.id));
            },
            pinned: true,
            lockPinned: true,
            lockPosition: true,
            suppressMovable: true,
            sortable: false,
            resizable: false,
        },
        {
            headerName: "",
            cellRenderer: () => (
                <Whisper speaker={tooltip("Eliminar orden")} placement='topStart'>
                    <button className='flex items-center justify-center w-full h-full p-2 transition'>
                        <HiOutlineTrash />
                    </button>
                </Whisper>
            ),
            editable: false,
            width: 20,
            cellStyle: {
                padding: "0",
            },
            onCellClicked: (e) => {
                api.delete("/delivery-planner/checkpoint/" + e.data.id).then((response) => {
                    if (response.status == 200) setOrders(orders.filter((order) => order.id !== e.data.id));
                });
            },
            pinned: true,
            lockPinned: true,
            lockPosition: true,
            suppressMovable: true,
            sortable: false,
            resizable: false,
        },
        {
            field: "title",
            headerName: "Título",
            editable: true,
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },
        },
        {
            field: "province",
            headerName: "Provincia",
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },
            editable: true,
            type: "text",
        },
        {
            field: "zone",
            headerName: "Zona",
            editable: true,
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },
            type: "text",
        },
        {
            field: "sector",
            headerName: "Sector",
            editable: true,
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },
            type: "text",
        },
        {
            field: "address",
            headerName: "Dirección",
            editable: true,
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },
            type: "text",
        },
        {
            field: "coordinates",
            valueSetter: (params) => {
                const [latitude, longitude] = params.newValue.split(",").map((coord: string) => parseFloat(coord.trim()));
                params.data.lat = latitude;
                params.data.lng = longitude;
                return true;
            },
            headerName: "Coordenadas",
            cellRendererParams: (params: any) => {
                const coords = params.data.lat && params.data.lng ? `${params.data.lat}, ${params.data.lng}` : `${params.data.lat}, ${params.data.lng}`;
                return {
                    value: coords,
                };
            },
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },

            cellRenderer: (params: any) => {
                return <Whisper speaker={tooltip(`Latitud: ${String(params.value).split(", ")[0]}; Longitud: ${String(params.value).split(", ")[1]}`)}>{params.value}</Whisper>;
            },
            editable: true,
            type: "text",
        },
        {
            field: "description",
            headerName: "Descripción",
            editable: true,
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },
            type: "text",
        },
        {
            field: "order_time",
            headerName: "Fecha",
            editable: true,
            filter: true,
            filterParams: {
                debounceMs: 500,
                trimInput: true,
            },
            type: "date",
        },
    ];

    const { openModal } = useModalAction();
    const { routePaneOpen, setSelectedOrders, orders, setOrders } = usePlanificationStore();
    const [tab, setTab] = useState(0);

    const { data, isLoading } = useApiQuery<{ data: Order[] }>("/delivery-planner/checkpoint", {
        interval: 60000,
        disable: false,
        retry: 3,
        staleTime: 300000,
    });

    useEffect(() => {
        if (data) {
            setOrders(data.data);
            setSelectedOrders([]);
        }
    }, [data]);

    function updateOrder(e: CellValueChangedEvent<any, any, any>) {
        let payload = {};
        if (e.colDef.field === "coordinates") {
            const [lat, lng] = e.value.split(",").map((coord: string) => parseFloat(coord.trim()));
            payload = { lat, lng };
        } else {
            payload = { [e.colDef.field as string]: e.value };
        }
        api.patch("/delivery-planner/checkpoint/" + e.data.id, payload).then((response) => {
            if (response.status == 200) {
                const updatedRows = orders.map((row) => (row.id === e.data.id ? { ...row, [e.colDef.field as string]: e.value } : row));
                setOrders(updatedRows);
            }
        });
    }

    return (
        <div className='text-[0.9rem] px-0'>
            <div className='flex h-[90vh] max-h-[90vh] relative min-h-[500px] p-4 bg-white border shadow rounded-2xl gap-x-4'>
                <div className='h-full overflow-hidden grow'>
                    <div className={classNames("flex items-center justify-between h-16 transition-all", tab === 0 ? "w-2/3" : "w-full")}>
                        <div className='flex items-center gap-x-2'>
                            <Button
                                variant={tab != 0 ? "subtle" : "solid"}
                                rounded='lg'
                                strength={tab != 0 ? "muted" : "primary"}
                                bordered
                                onClick={() => setTab(0)}
                                className={classNames(
                                    tab === 0
                                        ? "bg-brand-blue border-brand-blue text-white shadow-lg"
                                        : "bg-slate-100 border-slate-200 text-slate-500 rounded-xl hover:bg-slate-200 hover:border-slate-300",
                                )}>
                                <span>Órdenes</span>
                            </Button>
                            <Button
                                variant={tab != 1 ? "subtle" : "solid"}
                                rounded='lg'
                                strength={tab != 1 ? "muted" : "primary"}
                                bordered
                                onClick={() => setTab(1)}
                                className={classNames(tab === 1 ? "bg-brand-blue border-brand-blue text-white shadow-lg" : "rounded-xl")}>
                                <span>Despachadas</span>
                            </Button>
                        </div>
                        <Button onClick={() => openModal("CHECKPOINTS_IMPORT", {})} variant='subtle' strength='primary' rounded='full' className='ms-auto'>
                            <HiPlus className='inline me-2' />
                            Importar
                        </Button>
                    </div>
                    {tab === 0 && (
                        <>
                            <div className={classNames("h-[calc(90vh-100px)] min-h-[400px] transition-all", routePaneOpen ? "w-2/3" : "w-full")}>
                                <AgGridReact
                                    noRowsOverlayComponentParams={{ noRowsMessageFunc: () => "No hay datos disponibles" }}
                                    overlayNoRowsTemplate='No hay órdenes disponibles'
                                    columnDefs={columnDefs}
                                    loading={isLoading}
                                    loadingOverlayComponent={() => <LoadSpinner />}
                                    onCellValueChanged={updateOrder}
                                    containerStyle={{
                                        borderRadius: "0.5rem",
                                    }}
                                    columnTypes={columnTypes}
                                    gridOptions={{
                                        localeText: AG_GRID_LOCALE_ES,
                                    }}
                                    rowData={orders.filter((order) => order.is_dispatched == false)}
                                    theme={themeBalham.withParams({ accentColor: "#3b82f6" })}
                                />
                            </div>
                            <RoutePane />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
