import { useEffect, useRef } from "react";
import { HiChevronDown } from "react-icons/hi2";
import cn from "classnames";
import { Tooltip, Whisper } from "rsuite";

export function CheckBox({
    label,
    checked,
    indeterminate,
    onChange,
    id,
    truncate = true,
}: {
    label: string;
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: () => void;
    id?: string;
    truncate?: boolean;
}) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.indeterminate = indeterminate ?? false;
    }, [indeterminate]);

    const tooltip = <Tooltip>{label}</Tooltip>;

    return (
        <div className='flex items-center w-full gap-3 p-2'>
            <div className='flex items-center h-6 shrink-0'>
                <div className='grid grid-cols-1 group size-4'>
                    <input
                        ref={ref}
                        type='checkbox'
                        id={`group-${id}-${label.replace(/ /g, "-")}`}
                        name={`group-${id}-${label.replace(/ /g, "-")}`}
                        value={`group-${id}-${label.replace(/ /g, "-")}`}
                        checked={checked}
                        onChange={onChange}
                        className='col-start-1 row-start-1 bg-white border border-gray-300 rounded appearance-none checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto'
                    />
                    <svg
                        fill='none'
                        viewBox='0 0 14 14'
                        className='pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25'>
                        <path d='M3 8L6 11L11 3.5' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='opacity-0 group-has-[:checked]:opacity-100' />
                        <path d='M3 7H11' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='opacity-0 group-has-[:indeterminate]:opacity-100' />
                    </svg>
                </div>
            </div>
            <div className='text-sm/6'>
                <label htmlFor={`group-${id}-${label.replace(/ /g, "-")}`} className='font-medium text-gray-900'>
                    <Whisper speaker={tooltip} onMouseOver={() => tooltip} trigger='hover' placement='top'>
                        {truncate ? (
                            <>{label.split(" ").length > 4 ? label.split(" ").slice(0, 4).join(" ") + "..." : label.length > 20 ? label.slice(0, 20) + "..." : label}</>
                        ) : (
                            <>{label}</>
                        )}
                    </Whisper>
                </label>
            </div>
        </div>
    );
}

export function Group({
    label,
    group,
    open,
    selectedItems,
    toggleGroup,
    setOpen,
}: {
    label: string;
    group: any;
    open: boolean;
    selectedItems: Set<number>;
    toggleGroup: (group: any) => void;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const allIds = group.trackers.map((t: any) => t.id);
    const allChecked = allIds.every((id: any) => selectedItems.has(id));
    const someChecked = allIds.some((id: any) => selectedItems.has(id));
    return (
        <div className='flex w-full transition bg-gray-100 hover:bg-gray-200'>
            <div className='w-1 m-2 rounded me-0' style={{ backgroundColor: group.color ? `#${group.color}` : "#CACACA" }}></div>
            <CheckBox label={label} checked={allChecked} indeterminate={!allChecked && someChecked} onChange={() => toggleGroup(group)} />
            <button onClick={() => setOpen((prev) => !prev)} className='flex items-center justify-center w-12 transition outline-none focus-visible:bg-gray-300 hover:bg-gray-300'>
                <HiChevronDown className={cn(open && "rotate-180", "transition-all")} />
            </button>
        </div>
    );
}

export function Item({ label, selected, toggle }: { label: string; id: number; selected: boolean; toggle: () => void }) {
    return (
        <div className='flex w-full px-8 transition hover:bg-gray-50'>
            <CheckBox label={label} checked={selected} onChange={toggle} />
        </div>
    );
}
