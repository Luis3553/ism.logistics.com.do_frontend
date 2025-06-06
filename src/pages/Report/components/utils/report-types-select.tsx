import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";
import { reportTypes } from "../lists/reports-list";

export default function ReportTypesSelect({
    selected,
    setSelected,
}: {
    selected: {
        id: number;
        name: string;
    };
    setSelected: React.Dispatch<
        React.SetStateAction<{
            id: number;
            name: string;
        }>
    >;
}) {
    const [query, setQuery] = useState("");

    const filteredTypes =
        query === "" ? reportTypes : reportTypes.filter((report) => report.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")));

    return (
        <div>
            <Combobox value={selected} onChange={setSelected}>
                <div className='relative h-full'>
                    <div className='relative w-full h-full overflow-hidden text-left bg-white outline-none cursor-default border-y focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
                        <Combobox.Input
                            className='w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none outline-none focus:ring-0'
                            displayValue={(type: any) => type.name}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
                            <HiChevronUpDown className='w-5 h-5' aria-hidden='true' />
                        </Combobox.Button>
                    </div>
                    <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0' afterLeave={() => setQuery("")}>
                        <Combobox.Options className='absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm'>
                            {filteredTypes.length === 0 && query !== "" ? (
                                <div className='relative px-4 py-2 text-gray-700 cursor-default select-none'>Nothing found.</div>
                            ) : (
                                <>
                                    {filteredTypes.map((type, idx) => (
                                        <Combobox.Option
                                            key={idx}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-brand-blue text-white" : "text-gray-900"}`
                                            }
                                            value={type}>
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{type.name}</span>
                                                    {selected ? (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-brand-blue"}`}>
                                                            <FaCheck className='w-5 h-5' aria-hidden='true' />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))}
                                </>
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
}
