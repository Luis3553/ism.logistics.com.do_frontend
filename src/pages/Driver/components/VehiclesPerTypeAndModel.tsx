import Highcharts, { SeriesColumnOptions } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { LoadSpinner } from "../../../components/LoadSpinner";
import { useFetch } from "../../../hooks/useFetch";
import { useEffect, useState } from "react";
import { useResponsiveChartHeight } from "../../../hooks/useResponsiveChartHeight";

type SeriesType = { modelGroup: { categories: string[]; series: SeriesColumnOptions[] }; yearGroup: { categories: string[]; series: SeriesColumnOptions[] } };

export const VehiclesPerTypeAndModel = () => {
    const { wrapperRef, resizeRef, initialHeight, setChartOptions, chartOptions } = useResponsiveChartHeight();
    const { data, isLoading, error } = useFetch<SeriesType>("/drivers/vehicles_per_type_and_model");
    const [mode, setMode] = useState<"modelGroup" | "yearGroup">("modelGroup");

    useEffect(() => {
        if (initialHeight !== undefined && !isLoading && data && !error) {
            const totalPoints = data[mode].categories.length;
            const visiblePoints = 15;
            const needsScrollbar = totalPoints > visiblePoints;

            setChartOptions({
                chart: {
                    type: "bar",
                    height: initialHeight,
                    marginBottom: 55,
                },
                title: {
                    text: undefined,
                },
                xAxis: {
                    type: "category",
                    min: 0,
                    categories: data[mode].categories,
                    labels: {
                        style: {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: 70,
                        },
                    },
                    max: visiblePoints,
                    title: {
                        text: mode === "modelGroup" ? "Modelo" : "Año",
                        style: {
                            fontSize: "12px",
                            fontWeight: "600",
                            fontFamily: "Arial, sans-serif",
                        },
                    },
                    scrollbar: {
                        enabled: needsScrollbar,
                    },
                    tickLength: 0,
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Cantidad",
                        style: {
                            fontSize: "12px",
                            fontWeight: "600",
                            fontFamily: "Arial, sans-serif",
                        },
                    },
                    stackLabels: {
                        enabled: true,
                    },
                },
                legend: {
                    enabled: true,
                    align: "center",
                    verticalAlign: "top",
                    reversed: true,
                    y: -19,
                    itemDistance: 10,
                },
                plotOptions: {
                    series: {
                        stacking: "normal",
                        dataLabels: {
                            enabled: true,
                            allowOverlap: false,
                            overflow: "justify",
                            crop: true,
                            filter: {
                                operator: ">",
                                property: "y",
                                value: 0,
                            },
                        },
                    },
                    bar: {
                        pointPadding: 0.05,
                        groupPadding: 0.05,
                    },
                },
                series: data[mode].series,
            });
        }
    }, [initialHeight, data, mode]);

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-sm grow min-h-[540px]">
            <div className="mb-3">
                <div className="me-2 grid grid-cols-2 gap-2 mb-2 relative overflow-hidden p-1 w-full bg-gray-200/50 h-fit rounded-sm">
                    <button
                        className={`px-3 border-1 border-transparent shadow-xs rounded-sm text-sm font-semibold cursor-pointer py-1 z-20 transition-all duration-300 relative ${
                            mode === "yearGroup" ? "text-white bg-[var(--blue)]" : "bg-white text-gray-700 hover:border-[var(--blue)]"
                        }`}
                        onClick={() => setMode("yearGroup")}>
                        AÑO
                    </button>
                    <button
                        className={`px-3 border-1 border-transparent shadow-xs rounded-sm text-sm font-semibold cursor-pointer py-1 z-20 transition-all duration-300 relative ${
                            mode === "modelGroup" ? "text-white bg-[var(--blue)]" : "bg-white text-gray-700 hover:border-[var(--blue)]"
                        }`}
                        onClick={() => setMode("modelGroup")}>
                        MODELO
                    </button>
                </div>
                <span className="mx-auto font-bold text-gray-700 uppercase">Vehículos por tipo y {mode == "yearGroup" ? "Año" : "Modelo"}</span>
            </div>
            <div className="relative z-20 flex flex-col grow" ref={wrapperRef}>
                <div className="w-full h-full absolute overflow-hidden" ref={resizeRef}>
                    <div className="absolute w-full h-full">
                        {error ? (
                            <div>Ocurrio un error</div>
                        ) : isLoading || !chartOptions ? (
                            <LoadSpinner />
                        ) : data[mode].series.length === 0 ? (
                            <div className="grid place-items-center h-full">No existen vehículos</div>
                        ) : (
                            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
