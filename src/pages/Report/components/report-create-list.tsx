import { Transition } from "@headlessui/react";
import { FaTruck } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { TiLocationArrow } from "react-icons/ti";
import { Filter } from "./utils/filter";
import { CheckBox } from "./utils/check-boxes";
import TrackersList from "./lists/trackers-list";
import DriversList from "./lists/drivers-list";
import VehiclesList from "./lists/vehicles-list";
import { DriversGroup, ReportType, TrackersGroup, VehiclesGroup } from "@utils/types";
import { appearAnimationProps } from "@utils/animations";

export default function ReportCreateList({
    activeReportType,
    trackerGroups,
    isLoadingTrackers,
    trackersError,
    trackersFetcher,
    selectedTrackers,
    setSelectedTrackers,
    driverGroups,
    isLoadingDrivers,
    driversError,
    driversFetcher,
    selectedDrivers,
    setSelectedDrivers,
    vehicleGroups,
    isLoadingVehicles,
    vehiclesError,
    vehiclesFetcher,
    selectedVehicles,
    setSelectedVehicles,
    filterItem,
    setFilterItem,
    isAllSelected,
    isIndeterminate,
    allTrackerIds,
}: {
    activeReportType: ReportType;
    trackerGroups: TrackersGroup[] | undefined;
    isLoadingTrackers: boolean;
    trackersError: boolean;
    selectedTrackers: Set<number>;
    driverGroups: DriversGroup[] | undefined;
    isLoadingDrivers: boolean;
    driversError: boolean;
    selectedDrivers: Set<number>;
    vehicleGroups: VehiclesGroup[] | undefined;
    isLoadingVehicles: boolean;
    vehiclesError: boolean;
    selectedVehicles: Set<number>;
    filterItem: string;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    allTrackerIds: number[];
    trackersFetcher: () => void;
    driversFetcher: () => void;
    vehiclesFetcher: () => void;
    setFilterItem: React.Dispatch<React.SetStateAction<string>>;
    setSelectedTrackers: React.Dispatch<React.SetStateAction<Set<number>>>;
    setSelectedDrivers: React.Dispatch<React.SetStateAction<Set<number>>>;
    setSelectedVehicles: React.Dispatch<React.SetStateAction<Set<number>>>;
}) {
    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedTrackers(new Set());
        } else {
            setSelectedTrackers(new Set(allTrackerIds));
        }
    };

    function toggleGroupGeneric<T extends { id: number }>(
        group: { [key: string]: T[] },
        groupKey: string,
        selectedSet: Set<number>,
        setter: React.Dispatch<React.SetStateAction<Set<number>>>,
    ) {
        const items = group[groupKey] ?? [];
        const groupIds = items.map((item) => item.id);
        const allInGroup = groupIds.every((id) => selectedSet.has(id));

        const newSet = new Set(selectedSet);
        if (allInGroup) {
            groupIds.forEach((id) => newSet.delete(id));
        } else {
            groupIds.forEach((id) => newSet.add(id));
        }
        setter(newSet);
    }

    function toggleItemGeneric(id: number, selectedSet: Set<number>, setter: React.Dispatch<React.SetStateAction<Set<number>>>) {
        const newSet = new Set(selectedSet);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setter(newSet);
    }

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='flex flex-row items-center px-4 font-bold text-gray-700 bg-gray-200 min-h-10 max-h-10 gap-x-4'>
                {activeReportType?.list === "trackers" ? (
                    <TiLocationArrow className='size-6' />
                ) : activeReportType?.list === "drivers" ? (
                    <IoPerson className='size-6' />
                ) : (
                    <FaTruck className='size-6' />
                )}
                <span>{activeReportType?.list === "trackers" ? "Objetos" : activeReportType?.list === "drivers" ? "Conductores" : "Vehículos"}</span>
            </div>
            {trackerGroups && (
                <Transition show={trackerGroups.length > 0} {...appearAnimationProps}>
                    <Filter filter={filterItem} setFilter={setFilterItem} />
                    <div className='flex w-full transition shadow-lg hover:bg-gray-50'>
                        <CheckBox label='Seleccionar todo' id='select-all' checked={isAllSelected} indeterminate={isIndeterminate} onChange={toggleSelectAll} />
                    </div>
                </Transition>
            )}
            <div className='h-full overflow-y-scroll'>
                {activeReportType.list == "trackers" ? (
                    <TrackersList
                        trackerGroups={trackerGroups}
                        isLoading={isLoadingTrackers}
                        error={trackersError}
                        fetcher={trackersFetcher}
                        selectedTrackers={selectedTrackers}
                        toggleGroup={(group) => toggleGroupGeneric({ [group.name]: group.trackers }, group.name, selectedTrackers, setSelectedTrackers)}
                        toggleItem={(id) => toggleItemGeneric(id, selectedTrackers, setSelectedTrackers)}
                    />
                ) : activeReportType.list == "drivers" ? (
                    <DriversList
                        driverGroups={driverGroups}
                        isLoading={isLoadingDrivers}
                        error={driversError}
                        fetcher={driversFetcher}
                        selectedDrivers={selectedDrivers}
                        toggleGroup={(group) => toggleGroupGeneric({ [group.name]: group.trackers }, group.name, selectedTrackers, setSelectedTrackers)}
                        toggleItem={(id) => toggleItemGeneric(id, selectedDrivers, setSelectedDrivers)}
                    />
                ) : (
                    <VehiclesList
                        vehicleGroups={vehicleGroups}
                        isLoading={isLoadingVehicles}
                        error={vehiclesError}
                        fetcher={vehiclesFetcher}
                        selectedVehicles={selectedVehicles}
                        toggleGroup={(group) => toggleGroupGeneric({ [group.name]: group.trackers }, group.name, selectedVehicles, setSelectedVehicles)}
                        toggleItem={(id) => toggleItemGeneric(id, selectedVehicles, setSelectedVehicles)}
                    />
                )}
            </div>
        </div>
    );
}
