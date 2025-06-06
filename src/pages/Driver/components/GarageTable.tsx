import React from "react";
import { BrandGroup, DriverGroup, GarageGroup, ModelGroup, VehicleLabelGroup } from "../types";
import { useNestedExpansion } from "../../../hooks/useNestedExpansion";
import { useFetch } from "../../../hooks/useFetch";
import { LoadSpinner } from "../../../components/LoadSpinner";
import useResizeObserver from "use-resize-observer";

export default function GarageTable() {
    const { expandedLevels, toggle } = useNestedExpansion();
    const { data, isLoading, error } = useFetch<VehicleLabelGroup[]>("/drivers/garages");
    const { ref, width } = useResizeObserver();

    return (
        <div className='flex flex-col p-4 transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-md' ref={ref}>
            <div className='relative overflow-auto grow'>
                {isLoading && <LoadSpinner />}
                {error && <div className='grid text-center place-items-center mt-9'>Ocurrio un error</div>}
                {data?.length === 0 && (
                    <div className='grid h-full place-items-center'>
                        <span className='mt-10'>No existen garajes</span>
                    </div>
                )}
                <table className='absolute top-0 left-0 w-full border-collapse'>
                    <thead className='sticky top-0 z-10 bg-white'>
                        <tr>
                            <th className='pb-2 text-left text-gray-700'>Áreas Asignadas</th>
                            <th className='pb-2 text-right text-gray-700 text-nowrap'>Cant. Vehículos</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {!isLoading && !error && <GenerateDepartmentRows data={data} toggle={toggle} containerWidth={width} expandedLevels={expandedLevels} />}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function GenerateDepartmentRows({
    data,
    toggle,
    containerWidth,
    expandedLevels,
}: {
    data: VehicleLabelGroup[];
    toggle: (key: string) => void;
    containerWidth: number | undefined;
    expandedLevels: Record<string, boolean>;
}) {
    return (
        <>
            {data.map((department, deIdx) => {
                const departmentKey = `department-${deIdx}`;
                const styleWhenSelected = expandedLevels[departmentKey] ? "bg-brand-blue" : deIdx % 2 === 0 ? "bg-[#eeeeeeb1] hover:bg-[#e9f4fa]" : "hover:bg-[#e9f4fa]";

                return (
                    <React.Fragment key={departmentKey}>
                        <tr className={`cursor-pointer ${styleWhenSelected}`} onClick={() => toggle(departmentKey)}>
                            <td className='flex items-center gap-1 text-left'>
                                <i className='mgc_add_square_line'></i>
                                <span className='overflow-hidden text-ellipsis whitespace-nowrap' style={{ maxWidth: (containerWidth || 0) - 160 }}>
                                    {department.department}
                                </span>
                            </td>
                            <td className='pr-4 text-right'>0</td>
                        </tr>
                        {expandedLevels[departmentKey] && (
                            <GenerateGarageRows data={department.garages} toggle={toggle} departmentKey={departmentKey} expandedLevels={expandedLevels} />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
}

function GenerateGarageRows({
    data,
    toggle,
    departmentKey,
    expandedLevels,
}: {
    data: GarageGroup[];
    toggle: (key: string) => void;
    departmentKey: string;
    expandedLevels: Record<string, boolean>;
}) {
    return (
        <>
            {data.map((garage, gIdx) => {
                const garageKey = `${departmentKey}-garage-${gIdx}`;

                return (
                    <React.Fragment key={garageKey}>
                        <tr className='cursor-pointer hover:bg-[#e9f4fa]' onClick={() => toggle(garageKey)}>
                            <td className='flex items-center gap-1 ps-5'>
                                <i className='mgc_add_square_line'></i> {garage.garage}
                            </td>
                            <td className='pr-4 text-right'>0</td>
                        </tr>
                        {expandedLevels[garageKey] && <GenerateDriverRows data={garage.drivers} garageKey={garageKey} expandedLevels={expandedLevels} toggle={toggle} />}
                    </React.Fragment>
                );
            })}
        </>
    );
}

function GenerateDriverRows({
    data,
    garageKey,
    expandedLevels,
    toggle,
}: {
    data: DriverGroup[];
    garageKey: string;
    expandedLevels: Record<string, boolean>;
    toggle: (key: string) => void;
}) {
    return (
        <>
            {data.map((driver, dIdx) => {
                const driverKey = `${garageKey}-driver-${dIdx}`;

                return (
                    <React.Fragment key={driverKey}>
                        <tr className='cursor-pointer hover:bg-[#f0f0f0]' onClick={() => toggle(driverKey)}>
                            <td className='text-sm text-gray-700 ps-10'>👤 {driver.driver}</td>
                            <td className='pr-4 text-sm text-right'>0</td>
                        </tr>
                        {expandedLevels[driverKey] && <GenerateBrandRows expandedLevels={expandedLevels} toggle={toggle} data={driver.vehicles} driverKey={driverKey} />}
                    </React.Fragment>
                );
            })}
        </>
    );
}

function GenerateBrandRows({
    data,
    driverKey,
    toggle,
    expandedLevels,
}: {
    data: BrandGroup[];
    driverKey: string;
    toggle: (key: string) => void;
    expandedLevels: Record<string, boolean>;
}) {
    return (
        <>
            {data.map((brand, bIdx) => {
                const brandKey = `${driverKey}-brand-${bIdx}`;
                return (
                    <React.Fragment key={brandKey}>
                        <tr className='cursor-pointer hover:bg-[#f5faff]' onClick={() => toggle(brandKey)}>
                            <td className='text-sm text-blue-700 ps-14'>🚗 {brand.brand}</td>
                            <td className='pr-4 text-sm text-right'>0</td>
                        </tr>
                        {expandedLevels[brandKey] && <GenerateModelRows data={brand.models} brandKey={brandKey} toggle={toggle} expandedLevels={expandedLevels} />}
                    </React.Fragment>
                );
            })}
        </>
    );
}

function GenerateModelRows({
    data,
    brandKey,
    toggle,
    expandedLevels,
}: {
    data: ModelGroup[];
    brandKey: string;
    toggle: (key: string) => void;
    expandedLevels: Record<string, boolean>;
}) {
    return (
        <>
            {data.map((model, mIdx) => {
                const modelKey = `${brandKey}-model-${mIdx}`;
                return (
                    <React.Fragment key={modelKey}>
                        <tr className='cursor-pointer hover:bg-[#f8f8f8]' onClick={() => toggle(modelKey)}>
                            <td className='text-sm text-green-700 ps-20'>📦 {model.model}</td>
                            <td className='pr-4 text-sm text-right'>{model.labels.length}</td>
                        </tr>
                        {expandedLevels[modelKey] && <GenerateLabelRows labels={model.labels} modelKey={modelKey} />}
                    </React.Fragment>
                );
            })}
        </>
    );
}

function GenerateLabelRows({ labels, modelKey }: { labels: string[]; modelKey: string }) {
    return (
        <>
            {labels.map((label, lIdx) => {
                const labelKey = `${modelKey}-label-${lIdx}`;
                return (
                    <tr key={labelKey}>
                        <td className='text-sm text-gray-600 ps-28'>🔹 {label}</td>
                        <td className='pr-4 text-sm text-right'>1</td>
                    </tr>
                );
            })}
        </>
    );
}
