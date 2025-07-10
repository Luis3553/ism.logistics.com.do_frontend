import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import cn from "classnames";
import { Option } from "src/pages/Configuration/components/ListOfConfigurations";

export default function ListboxComponent({
    options,
    selectedOption,
    onChange,
    shadow,
    classNames = "",
}: {
    options: Option[];
    selectedOption: Option;
    onChange?: (value: any) => void;
    shadow?: boolean;
    classNames?: string;
}) {
    const [selected, setSelected] = useState(selectedOption ?? options[0]);

    useEffect(() => {
        setSelected(selectedOption ?? options[0]);
    }, [selectedOption, options]);

    return (
        <Listbox
            value={selected}
            onChange={(val) => {
                setSelected(val);
                onChange?.(val);
            }}>
            <div className='relative w-full'>
                <Listbox.Button
                    className={cn(
                        "relative w-full aria-expanded:border-brand-blue py-2 pl-3 pr-10 text-left bg-white border rounded-lg cursor-pointer md:min-w-20 focus:outline-none focus-visible:border-brand-blue sm:text-sm",
                        shadow && "shadow",
                        classNames,
                    )}>
                    <span className='block truncate'>{selected.label}</span>
                    <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                        <HiChevronUpDown className='w-5 h-5 text-gray-400' aria-hidden='true' />
                    </span>
                </Listbox.Button>
                <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                    <Listbox.Options className='absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white border rounded-md shadow-lg max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm'>
                        {options.map((option, optionIdx) => (
                            <Listbox.Option
                                onChange={onChange}
                                key={optionIdx}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-brand-light-blue text-brand-blue" : "text-gray-900"}`
                                }
                                value={option}>
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{option.label}</span>
                                        {selected ? (
                                            <span className='absolute inset-y-0 left-0 flex items-center pl-3 transition text-brand-blue'>
                                                <HiCheck className='w-5 h-5' aria-hidden='true' />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
