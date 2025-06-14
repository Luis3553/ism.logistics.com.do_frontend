// import { Transition } from "@headlessui/react";
// import { Group, Item } from "./check-boxes";
// import { LoadSpinner } from "@components/LoadSpinner";
// import { useState } from "react";
// import { HiArrowPath } from "react-icons/hi2";
import { TrackersGroup } from "@utils/types";
import ItemsList from "./items-list";

export default function TrackersList({
    trackerGroups,
    error,
    isLoading,
    selectedTrackers,
    fetcher,
    toggleGroup,
    toggleItem,
}: {
    trackerGroups: TrackersGroup[] | undefined;
    isLoading: boolean;
    error: boolean;
    selectedTrackers: Set<number>;
    fetcher: () => void;
    toggleGroup: (group: TrackersGroup) => void;
    toggleItem: (id: number) => void;
}) {
    return (
        <ItemsList
            error={error}
            fetcher={fetcher}
            groups={trackerGroups}
            isLoading={isLoading}
            selectedItems={selectedTrackers}
            toggleGroup={toggleGroup}
            toggleItem={toggleItem}
            type='trackers'
        />
    );
}
