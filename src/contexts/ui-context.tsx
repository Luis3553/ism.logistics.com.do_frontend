import { createContext, ReactNode, useContext } from "react";
import { useToaster } from "rsuite";
import { ToastContainerProps } from "rsuite/esm/toaster/ToastContainer";

type UIContextType = {
    toaster: {
        push: (message: ReactNode, options?: ToastContainerProps) => string | Promise<string | undefined> | undefined;
        remove: (key: string) => void;
        clear: () => void;
    };
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const toaster = useToaster();
    // const [brandColor, setBrandColor] = useState<string>("#1E40AF");

    // useEffect(() => {
    //     const root = document.documentElement;
    //     root.style.setProperty("--brand-color", brandColor);
    //     root.style.setProperty("--brand-color-light", `${brandColor}33`);
    //     root.style.setProperty("--brand-color-dark", `${brandColor}99`);
    // }, [brandColor]);

    return <UIContext.Provider value={{ toaster }}>{children}</UIContext.Provider>;
};

export const useUIContext = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUIContext must be used within a UIProvider");
    }
    return context;
};
