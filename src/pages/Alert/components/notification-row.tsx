import { useRef, useState } from "react";
import cn from "classnames";
import { Transition } from "@headlessui/react";
import { formatNumber } from "@utils/format-number";
import { Alert, Notification } from "@utils/types";
import { NotificationTable } from "./notification-table";

export function NotificationRow({ notification, width, type }: { notification: Notification | Alert; width: number; type: "alert" | "group" | "tracker" }) {
    const [open, setOpen] = useState(true);
    const contentRef = useRef<HTMLTableRowElement>(null);

    return (
        <>
            <tr>
                <td colSpan={5} className='text-[#4E4E4E] bg-[#EFEFEF] hover:bg-[#DFDFDF] transition uppercase font-medium w-full border-y border-[#CECECE]'>
                    <div className='relative flex flex-row items-center justify-center w-full h-9 end-0'>
                        <div className='text-center text-md'>
                            {width! >= 768 && <span>{type == "alert" ? "Alerta" : type == "group" ? "Grupo" : "Objeto"}: </span>}
                            <span>{notification.name}</span>
                            {width! < 768 && <span> - ({formatNumber((notification as Notification).trackers.length ?? (notification as Alert).events.length)})</span>}
                        </div>
                        <button
                            title={open ? "Cerrar grupo" : "Abrir grupo"}
                            role='button'
                            className='absolute flex items-center justify-center p-1 transition end-0 focus-visible:outline-0 focus-visible:bg-black/10 cursor pointer size-9 hover:bg-black/10 active:bg-black/20'
                            onClick={() => setOpen(!open)}>
                            <i className={cn("text-2xl mgc_up_line transition-transform", open ? " rotate-0" : " rotate-180")}></i>
                        </button>
                    </div>
                </td>
            </tr>
            <Transition
                show={open}
                enter='transition-all ease-in-out'
                enterFrom='h-0 opacity-0'
                enterTo='h-(--content-height) opacity-100'
                leave='transition-all ease-in-out'
                leaveTo='h-0 opacity-0'
                leaveFrom='h-(--content-height) opacity-100'
                beforeEnter={() => {
                    const el = contentRef.current;
                    if (el) {
                        el.style.setProperty("--content-height", el.scrollHeight + "px");
                    }
                }}
                beforeLeave={() => {
                    const el = contentRef.current;
                    if (el) {
                        el.style.setProperty("--content-height", el.scrollHeight + "px");
                    }
                }}
                as='tr'
                ref={contentRef}
                className='overflow-hidden transition-[height]'>
                <td colSpan={5}>
                    <NotificationTable name={notification.name} data={(notification as Notification).trackers ?? (notification as Alert).events} />
                </td>
            </Transition>
        </>
    );
}
