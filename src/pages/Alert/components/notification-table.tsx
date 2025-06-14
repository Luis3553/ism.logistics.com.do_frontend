import { useState } from "react";
import { Table } from "rsuite";
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";
import VehicleModal from "./vehicle-modal";
import { Link } from "react-router-dom";
import cn from "classnames";
import { Tracker } from "@utils/types";
import { Modal } from "@components/Modal";

const keys = {
    name: { label: "Objeto", grow: 1.5, width: undefined, minWidth: 300 },
    start_date: { label: "Inicio", grow: 0, width: 195, minWidth: 100 },
    end_date: { label: "Fin", grow: 0, width: 195, minWidth: 100 },
    time: { label: "Duración", grow: 0, width: 98, minWidth: 100 },
    address: { label: "Ubicación", grow: 2, width: undefined, minWidth: 200 },
};

export function VehicleModalButton({ alertName, column, rowData }: { alertName: string; column: string; rowData: Tracker }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                title={!rowData.vehicle_id ? "Este objeto no está relacionado con ningún vehículo" : undefined}
                className={cn(rowData.vehicle_id ? "cursor-pointer" : "cursor-default")}
                onClick={() => setIsOpen(true)}>
                <span className='font-medium'>{`${rowData.name}`}</span>
                {column == "name" && rowData.emergency && <i className='absolute text-brand-yellow bottom-3 mgc_notification_line'></i>}
            </button>
            {isOpen && !rowData.vehicle_id && (
                <Modal className='h-min max-w-[500px]' onClose={() => setIsOpen(false)} isOpen={isOpen}>
                    <div className='flex justify-between pb-4'>
                        <h1 className='text-lg font-semibold'>{rowData.name}</h1>
                        <button onClick={() => setIsOpen(false)}>
                            <i className='mgc_close_line'></i>
                        </button>
                    </div>
                    <div className='text-center'>Este objeto no está relacionado con ningún vehículo</div>
                </Modal>
            )}
            {isOpen && rowData.vehicle_id && <VehicleModal alertName={alertName} rowData={rowData} isOpen={isOpen} setIsOpen={setIsOpen} />}
        </>
    );
}

export function NotificationTable({ name, data }: { name: string; data: Tracker[] }) {
    return (
        <Table data={data} cellBordered autoHeight affixHeader headerHeight={30} maxHeight={300} virtualized>
            {data.length > 0 &&
                (Object.keys(keys) as Array<keyof typeof keys>).map((column, colIdx) => (
                    <Column fullText key={colIdx} align='start' width={keys[column].width} minWidth={keys[column].minWidth} flexGrow={keys[column].grow} fixed={column == "name"}>
                        <HeaderCell
                            style={{
                                background: "#DDEDFF",
                                paddingTop: 3,
                                paddingBottom: 3,
                                justifyContent: "center",
                            }}
                            className='text-[14px] text-[#4A4A4A] font-medium'>
                            {keys[column].label}
                        </HeaderCell>

                        {column == "address" ? (
                            <Cell dataKey={column}>
                                {(rowData) => (
                                    <Link
                                        className={cn("underline truncate transition decoration-black hover:decoration-brand-blue hover:text-brand-blue")}
                                        style={{ textUnderlineOffset: 4 }}
                                        target='_blank'
                                        title={rowData[column]}
                                        to={`https://app.progps.com.do/#/notifications/${rowData.notification_id}`}>
                                        <span>{`${rowData[column]}`}</span>
                                    </Link>
                                )}
                            </Cell>
                        ) : column == "name" ? (
                            <Cell>
                                {(rowData) => (
                                    <>
                                        <VehicleModalButton alertName={name} column={column} rowData={rowData as Tracker} />
                                    </>
                                )}
                            </Cell>
                        ) : (
                            <Cell wordWrap='break-word' dataKey={column} />
                        )}
                    </Column>
                ))}
        </Table>
    );
}
