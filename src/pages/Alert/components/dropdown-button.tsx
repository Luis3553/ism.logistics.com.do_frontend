import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HiChevronUpDown } from "react-icons/hi2";
import cn from "classnames";

type DropdownMenuOption = {
    label: string;
    disabled?: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

export default function DropdownMenuButton({ name, icon, options, className }: { name: string; icon?: React.ReactNode; options: DropdownMenuOption[]; className?: string }) {
    return (
        <div className={cn('w-fit text-right top-16', className)}>
            <Menu as='div' className='relative inline-block text-left'>
                <div>
                    <Menu.Button className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition rounded-md gap-x-2 text-brand-blue bg-brand-light-blue hover:bg-brand-blue hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                        {icon}
                        {name}
                        <HiChevronUpDown className='w-5 h-5 ml-2 -mr-1' aria-hidden='true' />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'>
                    <Menu.Items className='absolute right-0 z-50 w-full mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none'>
                        <div className='px-1 py-1 '>
                            {options.map((option, optionIdx) => (
                                <Menu.Item key={optionIdx}>
                                    {({ active }) => (
                                        <button disabled={option.disabled} onClick={option.onClick} className={`${active ? "bg-brand-blue text-white" : "text-gray-900"} group gap-x-4 flex w-full items-center rounded-md px-2 py-2 text-sm ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}>
                                            {option.icon}
                                            {option.label}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
