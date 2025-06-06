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
    // const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});

    // const toggleOpen = (idx: number) => {
    //     setOpenStates((prev) => ({ ...prev, [idx]: !prev[idx] }));
    // };

    // if (isLoading)
    //     return (
    //         <div className='relative p-8'>
    //             <LoadSpinner />
    //         </div>
    //     );

    // if (error)
    //     return (
    //         <div className='flex items-center justify-center h-full'>
    //             <div className='flex flex-col gap-4 text-center'>
    //                 <span className='text-lg font-medium'>Error cargando los objetos</span>
    //                 <button
    //                     onClick={fetcher}
    //                     className='flex flex-row items-center justify-center w-full gap-4 py-2 transition-all rounded-lg shadow group bg-brand-light-blue text-brand-blue hover:bg-white'>
    //                     <HiArrowPath className='transition group-hover:animate-spin' />
    //                     Recargar
    //                 </button>
    //             </div>
    //         </div>
    //     );

    // if (trackerGroups)
    //     if (trackerGroups.length > 0)
    //         return (
    //             <div className='flex flex-col overflow-y-auto'>
    //                 {trackerGroups.map((group, groupIdx) => (
    //                     <Transition
    //                         appear
    //                         enterFrom='opacity-0'
    //                         enterTo='opacity-100'
    //                         leaveFrom='opacity-100'
    //                         leaveTo='opacity-0'
    //                         enter='transition-all duration-500'
    //                         leave='transition duration-500'
    //                         unmount={false}>
    //                         <Group
    //                             key={groupIdx}
    //                             label={group.name}
    //                             group={group}
    //                             open={openStates[groupIdx]}
    //                             selectedItems={selectedTrackers}
    //                             toggleGroup={toggleGroup}
    //                             setOpen={() => toggleOpen(groupIdx)}
    //                         />
    //                         <Transition
    //                             show={!!openStates[groupIdx]}
    //                             appear
    //                             enterFrom='h-0'
    //                             enterTo='h-full'
    //                             leaveFrom='h-full'
    //                             leaveTo='h-0'
    //                             enter='transition-all duration-500'
    //                             leave='transition duration-500'
    //                             unmount={false}>
    //                             <>
    //                                 {group.trackers.map((tracker, trackerIdx) => (
    //                                     <Item
    //                                         key={trackerIdx}
    //                                         label={tracker.label}
    //                                         id={tracker.id}
    //                                         selected={selectedTrackers.has(tracker.id)}
    //                                         toggle={() => toggleItem(tracker.id)}
    //                                     />
    //                                 ))}
    //                             </>
    //                         </Transition>
    //                     </Transition>
    //                 ))}
    //             </div>
    //         );
}
