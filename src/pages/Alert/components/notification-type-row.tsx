import { useMemo, useState } from "react";
import useWindowSize from "../use-window-size";
import cn from "classnames";
import { NotificationRow } from "./notification-row";
import { Button } from "@headlessui/react";
import { NotificationGroup } from "@utils/types";

export function NotificationTypeRow({ notification }: { notification: NotificationGroup }) {
    const { width } = useWindowSize();
    const [open, setOpen] = useState(true);
    const groupRows = useMemo(() => {
        return notification.groups.map((group, groupIdx) => <NotificationRow key={`notification-${groupIdx}`} notification={group} width={width!} type={"group"} />);
    }, [notification.groups, width]);
    
    return (
        <>
            <tr className='bg-[#049cdb] text-white font-medium px-4 capitalize'>
                <td colSpan={5}>
                    <div className='relative flex flex-row w-full'>
                        <div className='flex items-center justify-center w-full gap-2 uppercase'>
                            {notification.name}
                            <Button title='Imprimir grupo' role='button' className='m-0.5 transition cursor-pointer rounded-xl size-8 hover:bg-white/10'>
                                <i className={`text-xl mgc_print_line m-0.5`}></i>
                            </Button>
                        </div>
                        <Button
                            title={open ? 'Cerrar grupo' : "Abrir grupo"}
                            role='button'
                            className='absolute flex items-center justify-center p-1 transition end-0 cursor pointer size-9 hover:bg-white/10 active:bg-white/20'
                            onClick={() => setOpen(!open)}>
                            <i className={cn("text-2xl mgc_up_line transition-transform", open ? " rotate-0" : " rotate-180")}></i>
                        </Button>
                    </div>
                </td>
            </tr>
            {open && groupRows}
        </>
    );
}
