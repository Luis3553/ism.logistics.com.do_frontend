import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { chartMenus } from "./constants";
import { useState } from "react";

const generateData = () => {
    return Array.from({ length: 30 }).map((_, i) => ({
        x: `${i + 1}`,
        y: Math.round(Math.random() * 400),
        fillColor: "var(--blue)",
    }));
};

export const ChartComponent = () => {
    const [selectedTabIndex, setTabIndex] = useState(0);
    const options: ApexOptions = {
        chart: {
            type: "bar",
        },
        xaxis: {
            type: "category",
            labels: {
                style: {
                    fontSize: "10px",
                    fontWeight: 700,
                },
            },
        },
        legend: {
            show: false,
        },
        title: {
            text: "Tiempo promedio de estadía en centro (h)",
        },
        plotOptions: {
            bar: {
                borderRadius: 3,
                borderRadiusApplication: "end",
                distributed: true,
            },
        },
        colors: Array(31).fill("var(--blue)"),
    };

    const series = [
        {
            name: "sales",
            data: generateData(),
        },
    ];

    return (
        <>
            <TabGroup
                onChange={(n) => setTabIndex(n)}
                className={"grid grid-cols-1 min-[640px]:grid-cols-[min(170px,_20%)_1fr] p-4 mt-4 bg-white rounded-lg shadow-sm gap-y-4 grow"}>
                <TabList className="hidden min-[640px]:flex flex-col gap-3 my-auto w-full h-fit">
                    {chartMenus.map((name, i) => (
                        <Tab
                            key={i}
                            aria-selected="true"
                            className={`${
                                selectedTabIndex == i ? "bg-[var(--blue)] text-white" : "bg-white text-[var(--blue)]"
                            } cursor-pointer rounded-lg px-4 py-2 hover:bg-[var(--blue)] shadow-sm shadow-black/10 outline-none hover:text-white transition-all duration-100`}>
                            {name}
                        </Tab>
                    ))}
                </TabList>
                <div className="form-select-wrapper w-full min-[640px]:hidden!">
                    <select id="filter" name="country" autoComplete="country-name" className="form-select">
                        <option>Vehículos</option>
                        <option>Destinos</option>
                        <option>Viajes</option>
                        <option>Viaje Promedio</option>
                        <option>Viaje por día</option>
                        <option>Tiempo estadía</option>
                    </select>
                    <svg className="form-select-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <Chart options={options} series={series} type="bar" height="99%" />
            </TabGroup>
        </>
    );
};
