import { useMemo, useState } from "react";
import useWindowSize from "../use-window-size";
import cn from "classnames";
import { NotificationRow } from "./notification-row";
import { Button } from "@headlessui/react";
import { Group } from "@utils/types";

export function GroupRow({ group }: { group: Group }) {
    const { width } = useWindowSize();
    const [open, setOpen] = useState(true);
    const notificationRows = useMemo(() => {
        return group.notifications.map((notification, notificationIdx) => <NotificationRow key={`notification-${notificationIdx}`} notification={notification} width={width!} type="alert" />);
    }, [group.notifications, width]);
    
    return (
        <>
            <tr className='bg-[#049cdb] text-white font-medium px-4 capitalize'>
                <td colSpan={5}>
                    <div className='relative flex flex-row w-full'>
                        <div className='flex items-center justify-center w-full gap-2 uppercase'>
                            {group.name}
                            <Button title='Imprimir grupo' role='button' className='m-0.5 focus-within:outline-0 focus-within:bg-white/10 transition cursor-pointer rounded-xl size-8 hover:bg-white/10'>
                                <i className={`text-xl mgc_print_line m-0.5`}></i>
                            </Button>
                        </div>
                        <Button
                            title={open ? 'Cerrar grupo' : "Abrir grupo"}
                            role='button'
                            className='absolute flex items-center justify-center p-1 transition focus-within:outline-0 focus-within:bg-white/10 end-0 cursor pointer size-9 hover:bg-white/10 active:bg-white/20'
                            onClick={() => setOpen(!open)}>
                            <i className={cn("text-2xl mgc_up_line transition-transform", open ? " rotate-0" : " rotate-180")}></i>
                        </Button>
                    </div>
                </td>
            </tr>
            {open && notificationRows}
        </>
    );
}
