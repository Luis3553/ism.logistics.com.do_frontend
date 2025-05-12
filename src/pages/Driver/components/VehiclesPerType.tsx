import Highcharts, { Chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useFetch } from "../../../hooks/useFetch";
import { LoadSpinner } from "../../../components/LoadSpinner";
import { useEffect } from "react";
import { useResponsiveChartHeight } from "../../../hooks/useResponsiveChartHeight";

type FetchResponseType = {
    name: "Camión" | "Especial" | "Autobús" | "Vehículo";
    y: number;
}[];

export const VehiclesPerType = () => {
    const { wrapperRef, resizeRef, initialHeight, setChartOptions, chartOptions } = useResponsiveChartHeight();
    const { data, isLoading, error } = useFetch<FetchResponseType>("/drivers/vehicles_per_type");

    useEffect(() => {
        if (initialHeight !== undefined && !isLoading && data && !error) {
            setChartOptions({
                chart: {
                    spacing: [0, 0, 0, 0],
                    margin: [50, 0, 0, 0],
                    height: initialHeight,
                    events: {
                        render: function (this: Chart) {
                            const chart = this;
                            const series = chart.series[0];

                            if (!series || series.type !== "pie" || !series.data) return;

                            const total = series.data.reduce((sum, point) => sum + (point.y || 0), 0);

                            if ((chart as any).customCenterLabel) {
                                (chart as any).customCenterLabel.destroy();
                            }

                            const label = chart.renderer
                                .text(`Total<br><b>${total}</b>`, 0, 0)
                                .css({
                                    color: "#333333",
                                    fontSize: "clamp(14px, 1.4vw, 18px)",
                                    textAlign: "center",
                                })
                                .attr({
                                    align: "center",
                                })
                                .add();

                            const bbox = label.getBBox();

                            label.attr({
                                x: chart.plotLeft + chart.plotWidth / 2 - bbox.width / 10,
                                y: chart.plotTop + chart.plotHeight / 2 + 5,
                            });

                            // Save to chart for reuse/destruction
                            (chart as any).customCenterLabel = label;
                        },
                    },
                },
                title: {
                    text: undefined,
                },
                legend: {
                    enabled: true,
                    align: "center",
                    verticalAlign: "top",
                    layout: "horizontal",
                    x: 0,
                    y: 5,
                    itemDistance: 10,
                },
                series: [
                    {
                        type: "pie",
                        innerSize: "70%",
                        showInLegend: true,
                        tooltip: {
                            pointFormat: "{point.name}: <b>{point.y}</b>",
                            headerFormat: "",
                        },
                        dataLabels: {
                            connectorWidth: 1.5,
                            enabled: true,
                            distance: 15,
                            format: "{point.y} ({point.percentage:.2f}%)",
                            style: {
                                fontSize: "clamp(14px, 1.303vw, 16px)",
                                fontWeight: "400",
                                fontFamily: "Arial, sans-serif",
                            },
                            filter: {
                                property: "y",
                                operator: ">",
                                value: 0,
                            },
                        },
                        data: data,
                    },
                ],
            });
        }
    }, [initialHeight, data]);

    return (
        <div className="grid grid-rows-[auto_1fr] p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 min-h-[272px]">
            <span className="font-bold text-gray-700 uppercase text-center">Vehículos por tipo</span>
            <div className="relative z-20 flex flex-col grow" ref={wrapperRef}>
                <div className="w-full h-full absolute overflow-hidden" ref={resizeRef}>
                    <div className="h-full absolute inset-0 w-full">
                        {isLoading ? (
                            <LoadSpinner />
                        ) : error ? (
                            <div className="w-fit mx-auto mt-4">Ocurrio un error</div>
                        ) : (
                            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
