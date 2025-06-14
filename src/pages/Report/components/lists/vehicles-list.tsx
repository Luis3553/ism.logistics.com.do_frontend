// import { Transition } from "@headlessui/react";
// import { Group, Item } from "./check-boxes";
// import { LoadSpinner } from "@components/LoadSpinner";
// import { useState } from "react";
// import { HiArrowPath } from "react-icons/hi2";
import { VehiclesGroup } from "@utils/types";
import ItemsList from "./items-list";

export default function VehiclesList({
    vehicleGroups,
    error,
    isLoading,
    selectedVehicles,
    fetcher,
    toggleGroup,
    toggleItem,
}: {
    vehicleGroups: VehiclesGroup[] | undefined;
    isLoading: boolean;
    error: boolean;
    selectedVehicles: Set<number>;
    fetcher: () => void;
    toggleGroup: (group: VehiclesGroup) => void;
    toggleItem: (id: number) => void;
}) {
    return (
        <ItemsList
            error={error}
            fetcher={fetcher}
            groups={vehicleGroups}
            isLoading={isLoading}
            selectedItems={selectedVehicles}
            toggleGroup={toggleGroup}
            toggleItem={toggleItem}
            type='trackers'
        />
    );
}
