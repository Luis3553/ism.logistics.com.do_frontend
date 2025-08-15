import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
import { useModalAction } from "@contexts/modal-context";
import { Listbox, Transition } from "@headlessui/react";
import { FileInput } from "@pages/Forms/components/fields";
import { appearAnimationProps } from "@utils/animations";
import { FileData, FileField } from "@utils/types";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HiCheck, HiChevronUpDown, HiXMark } from "react-icons/hi2";
import { LuDownload } from "react-icons/lu";
import { parseCsv } from "@utils/read-csv";
import { parseXls } from "@utils/read-xls";
import { toaster, Whisper } from "rsuite";
import messageToaster from "@utils/toaster";
import { AgGridReact } from "ag-grid-react";
import { themeBalham } from "ag-grid-community";
import classNames from "classnames";
import { LoadSpinner } from "@components/LoadSpinner";
import { AG_GRID_LOCALE_ES } from "@utils/ag-grid-es-ES";
import { tooltip } from "@utils/ui";

const expectedFields = ["Fecha", "Título", "Provincia", "Zona", "Sector", "Dirección", "Coordenadas", "Descripción"];

export default function CheckpointsImportModal({ open }: { open: boolean }) {
    const { closeModal } = useModalAction();
    const [page, setPage] = useState(1);

    const methods = useForm();

    const field: FileField = {
        id: "importFile",
        label: "Archivo Excel para importar:",
        description: null,
        required: true,
        type: "file",
        file_ids: [],
        max_files: 1,
        max_file_size: 10 * 1024 * 1024, // 10 MB
        min_file_size: 0,
        allowed_extensions: ["xls", "xlsx", "csv"],
    };

    const [fileData, setFileData] = useState<any>(null);
    const [cols, setCols] = useState<string[]>([]);
    const [columnMapping, setColumnMapping] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const mappedColumnDefs = expectedFields.map((field) => ({
        headerName: field,
        field: field,
        sortable: true,
        filter: true,
        editable: true,
    }));

    function MappingStep() {
        return (
            <div className='flex flex-col w-48 gap-y-2'>
                {expectedFields.map((field, fieldIdx) => (
                    <div className='w-48 grow shrink-0' key={field}>
                        <Listbox
                            as={"div"}
                            className='relative w-full'
                            value={columnMapping[fieldIdx] || ""}
                            onChange={(selected) => {
                                const updatedMapping = [...columnMapping];
                                updatedMapping[fieldIdx] = selected;
                                setColumnMapping(updatedMapping);
                            }}>
                            <Listbox.Label className='block mb-1 text-sm font-medium text-gray-700'>{field}</Listbox.Label>
                            <Listbox.Button className='flex items-center justify-between w-full px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm outline-none pe-2 hover:bg-gray-50 focus:border-brand-blue'>
                                <span className='truncate'>{columnMapping[fieldIdx] || "Seleccionar columna"}</span>
                                <HiChevronUpDown className='text-gray-400 size-6' />
                            </Listbox.Button>
                            <Listbox.Options className='absolute z-50 w-full mt-1 overflow-hidden overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg outline-none max-h-48'>
                                {cols.map((col, idx) => (
                                    <Listbox.Option
                                        key={`${idx}-${col}`}
                                        value={col}
                                        className={({ active }) =>
                                            classNames("cursor-pointer select-none relative px-4 py-2 pl-10", active ? "bg-brand-light-blue text-brand-blue" : "text-gray-700")
                                        }>
                                        {({ selected }) => (
                                            <Whisper speaker={tooltip(col)} trigger='hover' placement='right'>
                                                <>
                                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{col}</span>
                                                    {selected ? (
                                                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 transition text-brand-blue'>
                                                            <HiCheck className='w-5 h-5' aria-hidden='true' />
                                                        </span>
                                                    ) : null}
                                                </>
                                            </Whisper>
                                        )}
                                        {/* {col} */}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    </div>
                ))}
            </div>
        );
    }

    function applyMapping(data: any[], mapping: string[]) {
        return data.map((row) => {
            const newRow: any = {};
            mapping.forEach((sourceCol, idx) => {
                if (sourceCol) {
                    newRow[expectedFields[idx]] = row[sourceCol];
                }
            });
            return newRow;
        });
    }

    async function onSubmit() {
        setIsLoading(true);
        const file = (await methods.getValues().importFile[0]) as FileData;

        if (!file) {
            setIsLoading(false);
            return false;
        }

        let data: any[] = [];
        let colsFromFile: string[] = [];

        if (file.url.startsWith("data:text/csv")) {
            data = parseCsv(file.url);
        } else if (file.url.startsWith("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            data = parseXls(file.url);
        } else {
            toaster.push(messageToaster("El archivo seleccionado no es de un formato válido", "error"), {
                duration: 2000,
                placement: "topEnd",
            });
            setIsLoading(false);
            return false;
        }

        if (!data.length) {
            toaster.push(messageToaster("El archivo seleccionado no contiene datos", "error"), {
                duration: 2000,
                placement: "topEnd",
            });
            setIsLoading(false);
            return false;
        }

        if (Object.keys(data[0] ?? {}).length < 7) {
            toaster.push(messageToaster("El archivo seleccionado no contiene suficientes columnas", "error"), {
                duration: 2000,
                placement: "topEnd",
            });
            setIsLoading(false);
            return false;
        }

        colsFromFile = Object.keys(data[0]);
        setCols(colsFromFile);
        setFileData(data);
        setColumnMapping(expectedFields.map((field) => (colsFromFile.includes(field) ? field : "")));
        setIsLoading(false);
        return true;
    }

    return (
        <Modal isOpen={open} onClose={closeModal} className='h-min'>
            <FormProvider {...methods}>
                <div>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-lg font-semibold'>Importar órdenes de un archivo</h1>
                        <button
                            className='flex items-center justify-center p-1 transition rounded-full outline-none focus-visible:bg-black/10 hover:bg-black/10 active:bg-black/20'
                            onClick={() => closeModal()}>
                            <HiXMark className='size-5' />
                        </button>
                    </div>
                    <Transition show={page === 1} {...appearAnimationProps} unmount={false}>
                        <div className='flex flex-col text-sm text-gray-600 gap-y-4'>
                            <p>
                                Puede importar puntos de interés subiendo un archivo de Excel con los datos. Si su archivo contiene encabezados, éstos serán detectados
                                automáticamente. De lo contrario, Usted puede especificarlos manualmente.
                            </p>
                            <Button
                                variant='subtle'
                                className='flex items-center justify-center text-nowrap w-min gap-x-2'
                                onClick={() => window.open("/assets/example-checkpoints-import.xlsx", "_blank")}>
                                <LuDownload className='size-4' />
                                Archivo de ejemplo
                            </Button>
                            <p>Las siguiente columnas están disponibles para importar:</p>
                            <ul className='*:ml-10 list-disc'>
                                <li>
                                    <strong>Fecha</strong> - necesario
                                </li>
                                <li>
                                    <strong>Título</strong> - necesario
                                </li>
                                <li>
                                    <strong>Provincia</strong> - necesario
                                </li>
                                <li>
                                    <strong>Zona</strong> - necesario
                                </li>
                                <li>
                                    <strong>Sector</strong> - necesario
                                </li>
                                <li>
                                    <strong>Dirección</strong> - necesario
                                </li>
                                <li>
                                    <strong>Coordenadas</strong> - necesario
                                </li>
                                <li>
                                    <strong>Descripción</strong> - opcional
                                </li>
                            </ul>
                            <div className='w-1/2'>
                                <FileInput field={field} showFiles={true} />
                            </div>
                        </div>
                    </Transition>
                    <Transition show={page === 2} {...appearAnimationProps} unmount={false}>
                        <div className='grid grid-cols-[12rem_1fr] gap-x-4 w-full'>
                            <MappingStep />

                            <div className={classNames("h-full min-h-[400px] w-full transition-all")}>
                                <AgGridReact
                                    columnDefs={mappedColumnDefs}
                                    rowData={fileData}
                                    containerStyle={{
                                        borderRadius: "0.5rem",
                                    }}
                                    loading={isLoading}
                                    loadingOverlayComponent={() => <LoadSpinner />}
                                    gridOptions={{
                                        localeText: AG_GRID_LOCALE_ES,
                                    }}
                                    theme={themeBalham.withParams({ accentColor: "#3b82f6" })}
                                />
                            </div>
                        </div>
                    </Transition>
                    <div className='flex justify-between mt-8'>
                        <Button
                            variant='subtle'
                            strength='muted'
                            onClick={() => {
                                page === 2 ? setPage(1) : page === 3 ? setPage(2) : closeModal();
                            }}>
                            {page > 1 ? "Volver" : "Cancelar"}
                        </Button>
                        <Button
                            onClick={async () => {
                                if (page === 1) {
                                    await onSubmit().then((res) => {
                                        if (res == false) return;
                                        setPage(2);
                                    });
                                } else if (page === 2) {
                                    const remappedData = applyMapping(fileData, columnMapping);
                                    setFileData(remappedData);
                                } else {
                                    closeModal();
                                }
                            }}>
                            Siguiente
                        </Button>
                    </div>
                </div>
            </FormProvider>
        </Modal>
    );
}
