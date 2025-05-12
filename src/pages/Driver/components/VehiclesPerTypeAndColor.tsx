import { useEffect } from "react";
import { LoadSpinner } from "../../../components/LoadSpinner";
import Highcharts, { SeriesOptionsType } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useResponsiveChartHeight } from "../../../hooks/useResponsiveChartHeight";
import { useFetch } from "../../../hooks/useFetch";

type SeriesType = { categories: string[]; series: SeriesOptionsType[] };

export const VehiclesPerTypeAndColor = () => {
    const { wrapperRef, resizeRef, initialHeight, setChartOptions, chartOptions } = useResponsiveChartHeight();
    const { isLoading, data, error } = useFetch<SeriesType>("/drivers/vehicles_per_type_and_color");

    useEffect(() => {
        if (initialHeight !== undefined && !isLoading && data && !error) {
            const totalPoints = data.categories.length;
            const visiblePoints = 5;
            const needsScrollbar = totalPoints > visiblePoints;

            setChartOptions({
                chart: {
                    type: "column",
                    height: needsScrollbar ? initialHeight : initialHeight + 15,
                    marginBottom: needsScrollbar ? 65 : 55,
                    spacingRight: 0,
                    spacingLeft: 0,
                },
                title: {
                    text: undefined,
                },
                xAxis: {
                    type: "category",
                    categories: data.categories,
                    min: 0,
                    max: 5,
                    title: {
                        text: "Color",
                        style: {
                            fontSize: "12px",
                            fontWeight: "600",
                            fontFamily: "Arial, sans-serif",
                        },
                    },
                    tickLength: 0,
                    scrollbar: { enabled: needsScrollbar },
                    labels: {
                        rotation: 0,
                        y: 20,
                        style: {
                            fontSize: "10px",
                            fontWeight: "400",
                            fontFamily: "Arial, sans-serif",
                        },
                    },
                },
                tooltip: {
                    shared: false,
                    useHTML: true,
                    formatter: function () {
                        if (this.y === 0) return false;
                        return `<p style="text-transform: uppercase; font-size: 10px;">${this.category}</p><span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b>`;
                    },
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
                    reversed: true,
                    align: "center",
                    verticalAlign: "top",
                    y: -19,
                    itemDistance: 10,
                },
                plotOptions: {
                    series: {
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
                        stacking: "normal",
                    },
                    column: {
                        pointPadding: 0.05,
                        groupPadding: 0.05,
                    },
                },

                series: data.series,
            });
        }
    }, [initialHeight, data]);

    return (
        <div className="flex flex-col p-4 transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-md relative">
            <span className="mx-auto mb-3 font-bold text-gray-700 uppercase">Vehículos por tipo y color</span>
            <div className="relative z-20 flex flex-col grow" ref={wrapperRef}>
                <div className="w-full h-full absolute overflow-hidden" ref={resizeRef}>
                    {error ? (
                        <div className="w-fit mx-auto">Ocurrio un error</div>
                    ) : isLoading || !chartOptions ? (
                        <LoadSpinner />
                    ) : data.series.length === 0 ? (
                        <div className="grid place-items-center h-full">No existen vehículos</div>
                    ) : (
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    )}
                </div>
            </div>
        </div>
    );
};
