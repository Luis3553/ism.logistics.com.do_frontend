import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import { HiXMark } from "react-icons/hi2";
import { MdDragHandle } from "react-icons/md";
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { Order, usePlanificationStore } from "@contexts/planification.context";

export default function SortableList({ items: listItems = [] }: { items: Order[] }) {
    const [items, setItems] = useState<Order[]>(listItems);
    const { setSelectedOrders } = usePlanificationStore();

    useEffect(() => {
        setItems(listItems);
    }, [listItems]);

    useEffect(() => {
        setSelectedOrders(items);
        console.log("items updated", items);
    }, [items]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );
    console.log("items", items);

    return (
        <DndContext
            modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
                const { active, over } = event;
                if (active.id !== over?.id) {
                    const oldIndex = items.findIndex((item) => item.id === active.id);
                    const newIndex = items.findIndex((item) => item.id === over?.id);
                    setItems(arrayMove(items, oldIndex, newIndex));
                }
            }}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {items.map((item, idx) => (
                        <SortableItem key={item.id} index={idx} item={item} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableItem({ item, index }: { item: Order; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const { selectedOrders, setSelectedOrders, orders, setOrders } = usePlanificationStore();

    return (
        <div
            ref={setNodeRef}
            className={classNames(" border overflow-hidden rounded-xl", { "bg-blue-100": isDragging }, { "bg-white": !isDragging }, { "shadow-lg": isDragging })}
            style={style}
            {...attributes}>
            <div {...listeners} className='flex flex-col items-center justify-center transition-all cursor-grab active:cursor-grabbing hover:text-brand-blue text-slate-400'>
                <MdDragHandle />
            </div>
            <div className='flex flex-row items-start p-4 gap-x-4'>
                <span className='font-medium text-center border rounded-full border-brand-blue text-brand-blue aspect-square size-7'>{index + 1}</span>
                <div className='flex flex-col grow'>
                    <h2 className='font-medium text leading'>{item.title}</h2>
                    <span className='text-slate-400'>{item.address}</span>
                </div>
                <button
                    onClick={() => {
                        setSelectedOrders(
                            // Filter out the current item from the selected orders
                            selectedOrders.filter((order: Order) => order.id !== item.id),
                        );
                        setOrders(
                            // Add the current item back to the main orders list
                            [...orders, item],
                        );
                    }}
                    className='p-1 transition rounded-full outline-none hover:bg-red-100 focus-visible:bg-red-100 active:bg-red-200'>
                    <HiXMark className='text-red-400' />
                </button>
            </div>
        </div>
    );
}
