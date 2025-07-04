import { createContext, ReactNode, useContext, useState } from "react";
import { useToaster } from "rsuite";
import { ToastContainerProps } from "rsuite/esm/toaster/ToastContainer";

type UIContextType = {
    toaster: {
        push: (message: ReactNode, options?: ToastContainerProps) => string | Promise<string | undefined> | undefined;
        remove: (key: string) => void;
        clear: () => void;
    };
    openModal: () => void;
    closeModal: () => void;
    modalOpen: boolean;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const toaster = useToaster();

    const [modalOpen, setOpenModal] = useState<boolean>(false);

    function openModal() {
        setOpenModal(true);
    }

    function closeModal() {
        setOpenModal(false);
    }

    return <UIContext.Provider value={{ toaster, openModal, closeModal, modalOpen }}>{children}</UIContext.Provider>;
};

export const useUIContext = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUIContext must be used within a UIProvider");
    }
    return context;
};
