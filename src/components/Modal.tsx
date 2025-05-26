import { Dialog, Transition } from "@headlessui/react";
import cn from 'classnames';
import { Fragment, ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, className, children }: ModalProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog open={isOpen} as='div' className='relative z-50 focus:outline-none' onClose={onClose}>
                <Transition.Child
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className='fixed inset-0 bg-black/30' />
                </Transition.Child>
                <Transition.Child
                    enter='ease-out duration-300'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'>
                    <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                        <div className='flex items-center justify-center h-full p-4'>
                            <Dialog.Panel className={cn('w-full h-full rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0', className ?? ' max-h-[600px] max-w-[800px]' )}>
                                {children}
                            </Dialog.Panel>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};
