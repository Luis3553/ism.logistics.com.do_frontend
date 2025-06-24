import { Transition } from "@headlessui/react";
import { Group, Item } from "../utils/check-boxes";
import { LoadSpinner } from "@components/LoadSpinner";
import { useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { expandAnimationProps } from "@utils/animations";

export interface BaseItem {
    id: number;
    label: string;
}

export interface BaseGroup<T extends BaseItem = BaseItem> {
    name: string;
    trackers: T[];
    color?: string;
}

type ItemsListProps = {
    type: "trackers" | "drivers" | "vehicles";
    groups: any[] | undefined;
    isLoading: boolean;
    error: boolean;
    selectedItems: Set<number>;
    fetcher: () => void;
    toggleGroup: (group: any) => void;
    toggleItem: (id: number) => void;
};

export default function ItemsList({
    groups,
    error,
    isLoading,
    selectedItems,
    // type,
    fetcher,
    toggleGroup,
    toggleItem,
}: ItemsListProps) {
    const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>(
        // () => {
        //     const initialStates: { [key: number]: boolean } = {};
        //     groups?.forEach((_, idx) => {
        //         initialStates[idx] = true;
        //     });
        //     return initialStates;
        // }
        {},
    );

    const toggleOpen = (idx: number) => {
        setOpenStates((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    if (isLoading)
        return (
            <div className='relative p-8'>
                <LoadSpinner />
            </div>
        );

    if (error)
        return (
            <div className='flex items-center justify-center h-full'>
                <div className='flex flex-col gap-4 text-center'>
                    <span className='text-lg font-medium'>Error cargando los objetos</span>
                    <button
                        onClick={fetcher}
                        className='flex flex-row items-center justify-center w-full gap-4 py-2 transition-all rounded-lg shadow group bg-brand-light-blue text-brand-blue hover:bg-white'>
                        <HiArrowPath className='transition group-hover:animate-spin' />
                        Recargar
                    </button>
                </div>
            </div>
        );

    if (!groups || groups.length === 0) return null;

    if (groups)
        if (groups.length > 0)
            return (
                <div className='flex flex-col'>
                    {groups.map((group, groupIdx) => (
                        <Transition key={groupIdx} {...expandAnimationProps} unmount={false}>
                            <Group
                                key={groupIdx}
                                label={group.name}
                                group={group}
                                open={openStates[groupIdx]}
                                selectedItems={selectedItems}
                                toggleGroup={toggleGroup}
                                setOpen={() => toggleOpen(groupIdx)}
                            />
                            <Transition show={!!openStates[groupIdx]} {...expandAnimationProps} unmount={false}>
                                <>
                                    {group.trackers ? (
                                        <>
                                            {group.trackers.map((item: any, itemIdx: number) => (
                                                <Item key={itemIdx} label={item.label} id={item.id} selected={selectedItems.has(item.id)} toggle={() => toggleItem(item.id)} />
                                            ))}
                                        </>
                                    ) : group.employees ? (
                                        <>
                                            {group.employees.map((item: any, itemIdx: number) => (
                                                <Item key={itemIdx} label={
                                                    item.label ? item.label : item.full_name
                                                } id={item.id} selected={selectedItems.has(item.id)} toggle={() => toggleItem(item.id)} />
                                            ))}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            </Transition>
                        </Transition>
                    ))}
                </div>
            );

    return;
}
