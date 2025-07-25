import { Header } from "@components/layout/Header";
import { Footer } from "@components/layout/Footer";
import { MobileHeader } from "@components/layout/MobileHeader";
import { Outlet, useLocation } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { CustomProvider } from "rsuite";

export const Layout = () => {
    const location = useLocation();
    return (
        <div className="flex flex-col bg-[var(--background-color)]">
            {(location.pathname !== "/notifications" && location.pathname !== "/reports" && location.pathname != "/tasks" && location.pathname != "/forms") && <>
                <Header />
                <MobileHeader /> 
            </>}
            <Transition
                key={location.key}
                className={"flex flex-col w-full mx-auto mt-4 max-w-[95%] grow min-h-[551px] "}
                appear
                show={true}
                enter="transition-opacity duration-300"
                leave="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                as={"main"}>
                    <CustomProvider>
                        <Outlet />
                    </CustomProvider>
            </Transition>
            <Footer />
        </div>
    );
};
