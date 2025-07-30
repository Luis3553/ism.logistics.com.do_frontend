import axios from "axios";
import { createContext, useRef, useState, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HiMagnifyingGlass, HiMiniMagnifyingGlass, HiOutlineEye, HiXMark } from "react-icons/hi2";
import { DateInput, DatePicker, Input, InputNumber } from "rsuite";
import { Table, Column, Cell, HeaderCell } from "rsuite-table";
import { format } from "date-fns";
import { FaMagnifyingGlass, FaRegSquareCheck, FaSquareCheck } from "react-icons/fa6";
import { Modal } from "@components/Modal";
import { Transition } from "@headlessui/react";

export type POI = {
    place: {
        description: string;
        fields: {
            [key: string]: {
                value: [];
                type: "image";
            };
        };
        files: [];
        id: number | null;
        label: string;
        location: {
            address: string;
            lat: number;
            lng: number;
            radius: number;
        };
        tags: number[];
    };
};

const example = [
    {
        id: 1,
        date: "2023-10-01",
        address: "123 Main St",
        lat: 12.345678,
        lng: 98.765432,
        employee: "John Doe",
        geofences: ["Geofence 1", "Geofence 2"],
        place: "Example Place",
        photo: "https://example.com/photo.jpg",
        form: "some link",
    },
];

type EditableContextType = {
    editingId: number | null;
    editingKey: string | null;
    onEdit?: (id: number, dataKey: string) => void;
    onEditFinished?: () => void;
};

type CheckinsList = {
    id: number;
    marker_time: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    files?: {
        download_url: string;
        id: number;
        mime_type: string;
        nane: string;
        size: number;
        storage_data: {
            download_url_key: string;
            relativepath: string;
        };
        storage_id: number;
        type: "image";
        view_url: string;
    }[];
    form_label: string;
    form_id: number;
    employee_id: number;
    comment?: string;
};

const EditableContext = createContext<EditableContextType>({ editingId: null, editingKey: null });

const ImageModal = ({ isOpen, onClose, imageUrl }: { isOpen: boolean; onClose: () => void; imageUrl: string }) => {
    return (
        <Modal className='h-min w-min max-w-[500px]' onClose={onClose} isOpen={isOpen}>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-lg font-semibold'></h1>
                <button
                    className='flex items-center justify-center p-1 transition rounded-full outline-none focus-visible:bg-black/10 hover:bg-black/10 active:bg-black/20'
                    onClick={onClose}>
                    <HiXMark className='size-5' />
                </button>
            </div>
            <div className='flex items-center justify-center w-full h-full min-h-[300px] min-w-[300px]'>
                <img
                    src={imageUrl}
                    className='w-auto h-auto max-w-[90vw] max-h-[80vh] rounded-xl'
                    style={{ objectFit: "contain", display: "block", margin: "auto" }}
                    alt='Preview'
                />
            </div>
        </Modal>
    );
};

export default function Checkins() {
    // const excludeEmpty = true;
    // const excludeNameless = true;
    // const excludeSimilar = true;
    // const [selectedCheckins, setSelectedCheckins] = useState<any[]>([]);
    /* 
        1. make checking report 
        2. retrieve checkins
        3. Filter and count empty and whole checkins by  
        4. Apply extra filters like excludeEmpty, excludeNameless
        5. Display checkins in a list or map view (rsuite's editable content table)
        6. check the checkins to be converted to POI taking into account the edited data
        7. Convert checkins to POI
        8. Download the excel file with POIs
    */

    /* would be nice to
     * Compress the images
     * Automatically upload them
     */

    /* may use a "clean names" button to make this:
     * Remove double spaces
     * Remove leading and trailing spaces
     * Remove "- " and " -"
     * Remove "( " and " )"
     * Remove trailing commas, dots or spaces
     * Remove doubled special characted
     */
    const [response, setResponse] = useState<{ count: number; list: CheckinsList[] }>();
    const [data, setData] = useState<any[]>(example);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedCheckins, setSelectedCheckins] = useState<CheckinsList[]>([]);
    const [imageUrl, setImageUrl] = useState<string>("");
    useEffect(() => {
        if (response) {
            const formattedData = response.list.map((checkin) => ({
                id: checkin.id,
                date: new Date(checkin.marker_time).toLocaleString(),
                address: checkin.location.address,
                employee: checkin.employee_id, // Assuming employee_id is a string or number
                geofences: ["-"], // Placeholder for geofences, if needed
                place: checkin.comment ?? "-", // Assuming form_label is the place name
                photo: checkin.files?.[0]?.view_url, // Placeholder for photo URL
                form: checkin.form_id, // Assuming form_id is a string or number
            }));
            setData(formattedData);
        }
    }, [response]);

    const handleChange = (id: number, key: string, value: any) => {
        const nextData = [...data];
        const item = nextData.find((item) => item.id === id);
        if (item) {
            item[key] = value;
        }
        setData(nextData);
    };

    const onEdit = (id: number, dataKey: string) => {
        setEditingId(id);
        setEditingKey(dataKey);
    };

    const onEditFinished = () => {
        setEditingId(null);
        setEditingKey(null);
    };

    const methods = useForm();
    const { handleSubmit, getValues } = methods;
    return (
        <div className='overflow-hidden bg-white shadow rounded-xl'>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(() => {
                        setIsFetching(true);
                        const { from, to } = getValues();
                        console.log("From:", from, typeof from, "To:", to, typeof to);
                        const payload = {
                            from: format(from, "yyyy-MM-dd HH:mm:ss"),
                            to: format(to, "yyyy-MM-dd HH:mm:ss"),
                            trackers: [10231045],
                            hash: "3d152bad53ff3e5ae928af1475fa2d4c",
                        };
                        axios
                            .post("https://app.progps.com.do/api-v2/checkin/list", payload)
                            .then((res) => {
                                // console.log(res.data as { checkins: CheckinsList[]; count: number });
                                setResponse(res.data);
                            })
                            .finally(() => {
                                setIsFetching(false);
                            });
                        console.log("Submitted payload:", payload);
                    })}
                    className='flex flex-row items-center gap-4 px-4 py-2 border-b bg-slate-50'>
                    <div className='flex flex-col'>
                        <label htmlFor='from' className='text-sm font-medium text-slate-600'>
                            Desde
                        </label>
                        <DatePicker
                            id='from'
                            defaultValue={new Date()}
                            placeholder='dd/mm/aaaa'
                            format='dd/MM/yyyy hh:mm:ss aa'
                            value={methods.watch("from")}
                            onChange={(val) => methods.setValue("from", val)}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='to' className='text-sm font-medium text-slate-600'>
                            Hasta
                        </label>
                        <DatePicker
                            defaultValue={new Date()}
                            id='to'
                            placeholder='dd/mm/aaaa'
                            format='dd/MM/yyyy hh:mm:ss aa'
                            value={methods.watch("to")}
                            onChange={(val) => methods.setValue("to", val)}
                        />
                    </div>
                    <button
                        type='submit'
                        className='flex items-center p-3 transition-all rounded-full outline-none text-brand-blue hover:text-white active:text-white focus-visible:bg-brand-blue focus-visible:text-white active:bg-brand-dark-blue gap-x-4 bg-brand-light-blue hover:bg-brand-blue'>
                        <FaMagnifyingGlass />
                    </button>
                </form>
            </FormProvider>
            {response ? (
                <EditableContext.Provider value={{ editingId, editingKey, onEdit, onEditFinished }}>
                    <Table
                        height={420}
                        data={data}
                        rowKey='id'
                        affixHeader
                        cellBordered
                        onRowClick={(rowData: any, e: React.MouseEvent) => {
                            if (e.target instanceof HTMLInputElement) return; // Ignore clicks on checkboxes
                            const isSelected = selectedCheckins.some((checkin) => checkin.id === rowData.id);
                            if (isSelected) {
                                setSelectedCheckins(selectedCheckins.filter((checkin) => checkin.id !== rowData.id));
                            } else {
                                setSelectedCheckins([...selectedCheckins, rowData]);
                            }
                        }}
                        virtualized>
                        <Column flexGrow={60} align='center' fixed>
                            <HeaderCell className='font-bold'>{(rowData: any) => (
                                <input
                                    type='checkbox'
                                    checked={selectedCheckins.some((checkin) => checkin.id === rowData.id)}
                                    onChange={() => {
                                        const isSelected = selectedCheckins.some((checkin) => checkin.id === rowData.id);
                                        if (isSelected) {
                                            setSelectedCheckins(selectedCheckins.filter((checkin) => checkin.id !== rowData.id));
                                        } else {
                                            setSelectedCheckins([...selectedCheckins, rowData]);
                                        }
                                    }}
                                    className='cursor-pointer accent-brand-blue'
                                />
                            )}
                            </HeaderCell>
                            <Cell fullText>
                                {(rowData: any, _rowIndex?: number) => (
                                    <div>
                                        <Transition show={selectedCheckins.some((checkin) => checkin.id === rowData.id)}>
                                            <FaSquareCheck className="text-brand-blue" />
                                        </Transition>
                                        <Transition show={!selectedCheckins.some((checkin) => checkin.id === rowData.id)}>
                                            <FaRegSquareCheck />
                                        </Transition>
                                    </div>
                                )}
                            </Cell>
                        </Column>
                        <Column flexGrow={140}>
                            <HeaderCell className='font-bold'>Fecha</HeaderCell>
                            <Cell fullText>{(rowData: any, _rowIndex?: number) => <div>{rowData.date}</div>}</Cell>
                        </Column>
                        <Column flexGrow={200}>
                            <HeaderCell className='font-bold'>Dirección</HeaderCell>
                            <Cell fullText>{(rowData: any, _rowIndex?: number) => <div>{rowData.address}</div>}</Cell>
                        </Column>
                        <Column flexGrow={160}>
                            <HeaderCell className='font-bold'>Empleado</HeaderCell>
                            <Cell fullText>{(rowData: any, _rowIndex?: number) => <div>{rowData.employee}</div>}</Cell>
                        </Column>
                        <Column flexGrow={180}>
                            <HeaderCell className='font-bold'>Lugar</HeaderCell>
                            <Cell fullText>{(rowData: any, _rowIndex?: number) => <div>{rowData.geofences}</div>}</Cell>
                        </Column>
                        <Column flexGrow={160}>
                            <HeaderCell className='font-bold'>Comentario</HeaderCell>
                            <Cell fullText>
                                {(rowData: any, _rowIndex?: number) => <EditableCell rowData={rowData} dataKey='place' dataType='string' onChange={handleChange} />}
                            </Cell>
                        </Column>
                        <Column flexGrow={200}>
                            <HeaderCell className='font-bold'>Foto</HeaderCell>
                            <Cell fullText>
                                {(rowData: any, _rowIndex?: number) =>
                                    rowData.photo ? (
                                        <button
                                            className='underline transition-all text-brand-blue decoration-transparent hover:decoration-brand-blue'
                                            onClick={() => {
                                                setImageUrl(rowData.photo);
                                                setOpenPreview(true);
                                            }}>
                                            Ver foto
                                        </button>
                                    ) : (
                                        " - "
                                    )
                                }
                            </Cell>
                        </Column>
                        <Column flexGrow={200}>
                            <HeaderCell className='font-bold'>Formulario</HeaderCell>
                            <Cell fullText>{(rowData: any, _rowIndex?: number) => <div>{rowData.form}</div>}</Cell>
                        </Column>
                    </Table>
                    <ImageModal isOpen={openPreview} onClose={() => setOpenPreview(false)} imageUrl={imageUrl} />
                </EditableContext.Provider>
            ) : (
                <div>
                    <p className='p-4 text-center text-gray-500'>No hay check-ins disponibles. Realice una búsqueda para ver los resultados.</p>
                </div>
            )}
        </div>
    );
}

const fieldMap = {
    string: Input,
    number: InputNumber,
};

function toValueString(value: any, dataType: string) {
    if (Array.isArray(value)) return value.join(", ");
    return value;
}

function focusRef(ref: React.RefObject<any>) {
    setTimeout(() => {
        if (ref.current && typeof ref.current.focus === "function") {
            ref.current.focus();
        }
    }, 0);
}

type EditableCellProps = {
    rowData: any;
    dataType: string;
    dataKey: string;
    onChange: (id: number, key: string, value: any) => void;
    [key: string]: any;
};

const EditableCell = ({ rowData, dataType, dataKey, onChange, ...props }: EditableCellProps) => {
    const { editingId, editingKey, onEdit, onEditFinished } = useContext(EditableContext);
    const editing = rowData.id === editingId && dataKey === editingKey;
    const Field = fieldMap[dataType] || Input;
    const value = rowData[dataKey];
    const text = toValueString(value, dataType);
    const inputRef = useRef<any>(null);
    // const cellRef = useRef(null); // Not needed with rsuite-table

    const handleEdit = () => {
        onEdit?.(rowData.id, dataKey);
        focusRef(inputRef);
    };

    const handleFinished = () => {
        onEditFinished?.();
        // focusRef(cellRef); // Not needed
    };

    return (
        <div
            tabIndex={0}
            className={editing ? "table-cell-editing" : "table-cell"}
            onDoubleClick={handleEdit}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleEdit();
                }
            }}
            style={{ height: "100%", display: "flex", alignItems: "center" }}>
            {editing ? (
                <Field
                    ref={inputRef}
                    defaultValue={value}
                    onBlur={handleFinished}
                    onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                            handleFinished();
                        }
                    }}
                    onChange={(val: any) => {
                        onChange?.(rowData.id, dataKey, val);
                    }}
                    style={{ width: "100%" }}
                />
            ) : (
                text
            )}
        </div>
    );
};
