import { useRef, useState } from "react";
import { Table } from "rsuite";
import cn from "classnames";
import { Button, Transition } from "@headlessui/react";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { formatNumber } from "@utils/format-number";
import { Notification, Tracker } from "@utils/types";
import { Link } from "react-router-dom";

const keys = {
    name: { label: "Objeto", grow: 2, width: undefined, minWidth: 300 },
    start_date: { label: "Inicio", grow: 0, width: 195, minWidth: 100 },
    end_date: { label: "Fin", grow: 0, width: 195, minWidth: 100 },
    time: { label: "Duración", grow: 0, width: 98, minWidth: 100 },
    address: { label: "Ubicación", grow: 2, width: undefined, minWidth: 200 },
};

export function NotificationTable({ data }: { data: Tracker[] }) {
    return (
        <Table data={data} cellBordered autoHeight affixHeader className="*:overflow-x-visible *:*:overflow-x-visible" headerHeight={30} maxHeight={300} virtualized>
            {data.length > 0 &&
                (Object.keys(keys) as Array<keyof typeof keys>).map((column, colIdx) => (
                    <Column fullText key={colIdx} align="start" width={keys[column].width} minWidth={keys[column].minWidth} flexGrow={keys[column].grow}>
                        <HeaderCell
                            style={{
                                background: "#DDEDFF",
                                paddingTop: 3,
                                paddingBottom: 3,
                            }}
                            className="text-[14px] text-[#4A4A4A] font-medium">
                            {keys[column].label}
                        </HeaderCell>

                        {column == "name" || column == "address" ? (
                            <Cell dataKey={column}>
                                {(rowData) => (
                                    <Link
                                        className="underline truncate transition decoration-black hover:decoration-brand-blue hover:text-brand-blue"
                                        style={{ textUnderlineOffset: 4 }}
                                        target="_blank"
                                        title={rowData[column]}
                                        to={`https://app.progps.com.do/#/notifications/${rowData.notification_id}`}>
                                        {column == "name" && rowData.emergency && <i className="absolute text-brand-yellow bottom-3 mgc_notification_line"></i>}
                                        <span className={cn(column == "name" && "ms-5")}>{`${rowData[column]}`}</span>
                                    </Link>
                                )}
                            </Cell>
                        ) : (
                            <Cell wordWrap="break-word" dataKey={column} />
                        )}
                    </Column>
                ))}
        </Table>
    );
}

export function NotificationRow({ notification, width, type }: { notification: Notification; width: number; type: "alert" | "group" }) {
    const [open, setOpen] = useState(true);
    const contentRef = useRef<HTMLTableRowElement>(null);

    return (
        <>
            <tr>
                <td colSpan={5} className="text-[#4E4E4E] bg-[#EFEFEF] hover:bg-[#DFDFDF] transition ps-4 uppercase font-medium w-full border-y border-[#CECECE]">
                    <div className="relative flex flex-row items-center justify-between w-full h-9 end-0">
                        <div className="text-xs text-center md:text-md md:text-start">
                            {width! >= 768 && <span>{type == "alert" ? "Alerta" : "Grupo"}: </span>}
                            <span>{notification.name}</span>
                            {width! < 768 && <span> - ({formatNumber(notification.trackers.length)})</span>}
                        </div>
                        <Button
                            title={open ? "Cerrar grupo" : "Abrir grupo"}
                            role="button"
                            className="absolute flex items-center justify-center p-1 transition end-0 focus-visible:outline-0 focus-visible:bg-black/10 cursor pointer size-9 hover:bg-black/10 active:bg-black/20"
                            onClick={() => setOpen(!open)}>
                            <i className={cn("text-2xl mgc_up_line transition-transform", open ? " rotate-0" : " rotate-180")}></i>
                        </Button>
                    </div>
                </td>
            </tr>
            <Transition
                show={open}
                enter="transition-all ease-in-out"
                enterFrom="h-0 opacity-0"
                enterTo="h-(--content-height) opacity-100"
                leave="transition-all ease-in-out"
                leaveTo="h-0 opacity-0"
                leaveFrom="h-(--content-height) opacity-100"
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
                }}>
                <tr ref={contentRef} className="overflow-hidden transition-[height]">
                    <td colSpan={5}>
                        <NotificationTable data={notification.trackers} />
                    </td>
                </tr>
            </Transition>
        </>
    );
}
