// import { Transition } from "@headlessui/react";
// import { Group, Item } from "./check-boxes";
// import { LoadSpinner } from "@components/LoadSpinner";
// import { useState } from "react";
// import { HiArrowPath } from "react-icons/hi2";
import { DriversGroup } from "@utils/types";
import ItemsList from "./items-list";

export default function DriversList({
    driverGroups,
    error,
    isLoading,
    selectedDrivers,
    fetcher,
    toggleGroup,
    toggleItem,
}: {
    driverGroups: DriversGroup[] | undefined;
    isLoading: boolean;
    error: boolean;
    selectedDrivers: Set<number>;
    fetcher: () => void;
    toggleGroup: (group: DriversGroup) => void;
    toggleItem: (id: number) => void;
}) {
    return (
        <ItemsList
            error={error}
            fetcher={fetcher}
            groups={driverGroups}
            isLoading={isLoading}
            selectedItems={selectedDrivers}
            toggleGroup={toggleGroup}
            toggleItem={toggleItem}
            type='drivers'
        />
    );
}
