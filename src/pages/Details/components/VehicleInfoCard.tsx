import React from "react";
import { VehicleCardLineInfoStructure } from "../constants";

export const VehicleInfoCard = () => {
    return (
        <div className="flex flex-col p-4 text-center bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-[var(--blue)] bottom-0 hover:bottom-1 group relative transition-all duration-300">
            <i className="group-hover:text-white mgc_truck_line text-[100px]"></i>
            <div className="grid w-full grid-cols-2 grow">
                {VehicleCardLineInfoStructure.map((line, i) => (
                    <React.Fragment key={i}>
                        <span className="text-left text-[var(--dark-gray)] group-hover:text-white">{line.title}</span>
                        <span className="font-bold text-right group-hover:text-white">{line.value}</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
