import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    return (
        <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-[800px] h-full max-h-[600px] rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                        {children}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};
