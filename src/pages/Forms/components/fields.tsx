import ListboxComponent from "@components/listbox";
import { CheckboxGroupField, DateField, DropdownField, FileData, FileField, PhotoField, RadioGroupField, RatingField, SignatureField, TextField } from "@utils/types";
import { useEffect, useRef, useState } from "react";
import {
    HiArrowDownTray,
    HiArrowUturnLeft,
    HiArrowUturnRight,
    HiCheckCircle,
    HiChevronUp,
    HiDocument,
    HiOutlineCheckCircle,
    HiOutlineClipboardDocument,
    HiOutlinePencil,
    HiOutlinePencilSquare,
    HiOutlinePhoto,
    HiOutlineStar,
    HiOutlineTrash,
    HiPhoto,
    HiStar,
    HiXMark,
} from "react-icons/hi2";
import { DatePicker, Whisper } from "rsuite";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { PiEraser } from "react-icons/pi";
import { RadioGroup, Transition } from "@headlessui/react";
import classNames from "classnames";
import { FaSquareCheck } from "react-icons/fa6";
import { FaRegSquare } from "react-icons/fa";
import { appearAnimationProps, expandAnimationProps } from "@utils/animations";
import { Controller, useFormContext } from "react-hook-form";
import { useReportStore } from "@contexts/report.context";
import { tooltip } from "@utils/ui";

export function TextInput({ field }: { field: TextField }) {
    const { showDescriptions } = useReportStore();
    const { control, trigger } = useFormContext();
    return (
        <Controller
            name={field.id}
            control={control}
            defaultValue=''
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                minLength: {
                    value: field.min_length,
                    message: `Debe tener al menos ${field.min_length} caracteres`,
                },
                maxLength: {
                    value: field.max_length,
                    message: `No puede exceder los ${field.max_length} caracteres`,
                },
            }}
            render={({ field: fieldController, fieldState }) => (
                <div className='mb-4'>
                    <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                        {field.label} {field.required && <span className='text-red-500'>*</span>}
                    </label>
                    {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                    <div className='relative'>
                        <input
                            {...fieldController}
                            required={field.required}
                            onBlur={(e) => {
                                fieldController.onChange(e);
                                trigger(field.id);
                            }}
                            onChange={(e) => {
                                fieldController.onChange(e);
                                trigger(field.id);
                            }}
                            type='text'
                            id={field.id}
                            minLength={field.min_length}
                            maxLength={field.max_length}
                            className={classNames(
                                "w-full p-3 pe-12 transition-all border rounded-md outline-none",
                                fieldState.invalid ? "border-red-500" : "border-gray-300",
                                "focus-visible:border-brand-blue hover:border-brand-light-blue",
                            )}
                        />
                        <button
                            type='button'
                            onClick={() => {
                                fieldController.onChange("");
                                trigger(field.id);
                            }}
                            className='absolute inset-0 p-1 my-auto transition-all bg-white rounded-full shadow-lg outline-none w-min ms-auto me-4 h-min hover:bg-slate-100 focus-visible:bg-slate-100 active:bg-slate-200 shadow-white'>
                            <HiXMark />
                        </button>
                    </div>
                    {fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                    <small className='opacity-50'>
                        <span className='font-bold text-brand-blue'>{fieldController.value?.length ?? 0}</span>/{field.max_length}
                    </small>
                </div>
            )}
        />
    );
}

export function CheckboxGroupInput({ field }: { field: CheckboxGroupField }) {
    const { showDescriptions } = useReportStore();
    const options = field.group.map((option, idx) => ({ label: option.label, value: idx }));
    const { control, trigger } = useFormContext();
    return (
        <Controller
            control={control}
            name={field.id}
            defaultValue={[]}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: (value: number[]) => {
                    if (field.min_checked && value.length < field.min_checked) {
                        return `Debe seleccionar al menos ${field.min_checked} opciones`;
                    }
                    if (field.max_checked && value.length > field.max_checked) {
                        return `No puede seleccionar más de ${field.max_checked} opciones`;
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => (
                <div className='mb-4'>
                    <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                        {field.label} {field.required && <span className='text-red-500'>*</span>}
                    </label>
                    {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                    <div className='flex flex-wrap gap-4'>
                        {options.map((option, idx) => {
                            const isSelected = fieldController.value.includes(idx);
                            return (
                                <label
                                    onClick={() => {
                                        let newValue;
                                        if (isSelected) {
                                            newValue = fieldController.value.filter((v: number) => v !== idx);
                                        } else {
                                            newValue = [...fieldController.value, idx];
                                        }
                                        fieldController.onChange(newValue);
                                        setTimeout(() => trigger(field.id), 0);
                                    }}
                                    key={idx}
                                    className='flex items-center cursor-pointer'>
                                    <div className='relative block w-5 h-5 overflow-visible'>
                                        <Transition show={isSelected} {...appearAnimationProps}>
                                            <FaSquareCheck className='absolute inline top-[1px] text-brand-blue' />
                                        </Transition>
                                        <Transition show={!isSelected} {...appearAnimationProps}>
                                            <FaRegSquare className='absolute inline top-[1px] text-gray-300' />
                                        </Transition>
                                    </div>
                                    <span className='text-sm text-slate-700'>{option.label}</span>
                                </label>
                            );
                        })}
                    </div>
                    {fieldState && fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                </div>
            )}
        />
    );
}

export function RadioGroupInput({ field }: { field: RadioGroupField }) {
    const { showDescriptions } = useReportStore();
    const options = field.options.map((option, idx) => ({ label: option.label, value: idx }));
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={field.id}
            defaultValue={null}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: (value: number | null) => {
                    if (field.required && (value === null || value === undefined)) {
                        return "Este campo es obligatorio";
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => (
                <div className='mb-4'>
                    <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                        {field.label} {field.required && <span className='text-red-500'>*</span>}
                    </label>
                    {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                    <RadioGroup value={fieldController.value} onChange={fieldController.onChange} className='space-y-2'>
                        <div className='flex flex-wrap gap-8'>
                            {options.map((option) => (
                                <RadioGroup.Option key={option.value} value={option.value} className='flex items-center outline-none'>
                                    {({ checked }) => (
                                        <>
                                            <span className='relative w-5 h-5 overflow-visible'>
                                                <Transition show={checked} {...appearAnimationProps}>
                                                    <HiCheckCircle className='absolute inline inset-0 my-auto top-[1px] text-brand-blue' />
                                                </Transition>
                                                <Transition show={!checked} {...appearAnimationProps}>
                                                    <HiOutlineCheckCircle className='absolute inline inset-0 my-auto top-[1px] text-gray-300' />
                                                </Transition>
                                            </span>
                                            <span className='text-sm text-slate-700'>{option.label}</span>
                                        </>
                                    )}
                                </RadioGroup.Option>
                            ))}
                        </div>
                    </RadioGroup>
                    {fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                </div>
            )}
        />
    );
}

export function DropdownInput({ field }: { field: DropdownField }) {
    const { showDescriptions } = useReportStore();
    const options = field.options.map((option, idx) => ({ label: option.label, value: idx }));
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={field.id}
            defaultValue={null}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: (value: number | null) => {
                    if (field.required && (value === null || value === undefined)) {
                        return "Este campo es obligatorio";
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => (
                <div className='mb-4'>
                    <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                        {field.label} {field.required && <span className='text-red-500'>*</span>}
                    </label>
                    {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                    {/* @ts-ignore */}
                    <ListboxComponent options={[{ label: "Seleccione...", value: null }, ...options]} selectedOption={fieldController.value} onChange={fieldController.onChange} />
                    {fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                </div>
            )}
        />
    );
}

export function DateInput({ field }: { field: DateField }) {
    const { showDescriptions } = useReportStore();
    const { control } = useFormContext();
    return (
        <Controller
            control={control}
            name={field.id}
            defaultValue={null}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: (value: Date | null) => {
                    if (field.required && (value === null || value === undefined)) {
                        return "Este campo es obligatorio";
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => (
                <div className='mb-4'>
                    <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                        {field.label} {field.required && <span className='text-red-500'>*</span>}
                    </label>
                    {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                    <DatePicker
                        placeholder='dd/mm/yyyy'
                        id={field.id}
                        value={typeof fieldController.value === "string" ? new Date(fieldController.value) : fieldController.value}
                        onChange={fieldController.onChange}
                        style={{
                            width: "100%",
                        }}
                    />
                    {fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                </div>
            )}
        />
    );
}

export function RatingInput({ field }: { field: RatingField }) {
    const { showDescriptions } = useReportStore();
    const [v, setV] = useState<number>();
    const { control } = useFormContext();
    return (
        <Controller
            control={control}
            name={field.id}
            defaultValue={0}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: (value: number) => {
                    if (field.required && value < 1) {
                        return "Debe seleccionar al menos una estrella";
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => {
                useEffect(() => {
                    if (fieldController.value !== v) {
                        setV(fieldController.value);
                    } else if (!fieldController.value) {
                        setV(0);
                    }
                }, [fieldController.value]);

                return (
                    <div className='mb-4'>
                        <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                            {field.label} {field.required && <span className='text-red-500'>*</span>}
                        </label>
                        {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                        <div className='grid grid-cols-10'>
                            {[...Array(field.max_stars)].map((_, idx) => (
                                <button
                                    key={idx}
                                    type='button'
                                    onClick={() => {
                                        setV(idx + 1);
                                        fieldController.onChange(idx + 1);
                                    }}
                                    className={classNames(
                                        "transition-all text-xl hover:bg-gray-100 active:bg-gray-200 rounded-full flex items-center justify-center size-6",
                                        v! > idx ? "text-brand-blue" : "text-slate-500 hover:text-brand-blue",
                                    )}>
                                    {v! > idx ? <HiStar /> : <HiOutlineStar />}
                                </button>
                            ))}
                        </div>
                        {fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                    </div>
                );
            }}
        />
    );
}

function Tray({ children, onClick, onDrop }: { children: React.ReactNode; onClick?: () => void; onDrop?: (e: React.DragEvent<HTMLDivElement>) => void }) {
    return (
        <div
            onClick={onClick}
            onDrop={onDrop}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                e.currentTarget.dataset.dragover = "true";
                e.preventDefault();
                e.stopPropagation();
            }}
            onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
                e.currentTarget.dataset.dragover = "false";
                e.preventDefault();
                e.stopPropagation();
            }}
            onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
                e.currentTarget.dataset.dragover = "false";
                e.preventDefault();
                e.stopPropagation();
            }}
            className='flex items-center justify-center w-full transition-all border-2 border-dashed hover:border-brand-blue data-[dragover=true]:border-brand-blue focus:border-brand-blue active:border-brand-blue rounded-xl bg-gray-50'
            data-dragover={false}>
            {children}
        </div>
    );
}

function readImages(
    e: React.ChangeEvent<HTMLInputElement>,
    max_file_size: number,
    trayRef: React.RefObject<HTMLDivElement>,
    filesState: [FileData[], React.Dispatch<React.SetStateAction<FileData[]>>],
) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > max_file_size) {
            // Optionally handle file size error here
            console.warn(`File ${file.name} exceeds the maximum size of ${ByteToKB(max_file_size)}`);
            continue;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result && trayRef.current) {
                filesState[1]((prev) => [
                    ...prev,
                    {
                        id: filesState[0].length + 1,
                        url: reader.result as string,
                        name: file.name,
                        size: file.size,
                        type: file.type.startsWith("image/") ? "photo" : "other",
                    },
                ]);
            }
        };
        reader.onerror = () => {
            // Optionally handle error here
        };
        reader.readAsDataURL(file);
    }
}

function FileTile({ file, fileState }: { file: FileData; fileState: [FileData[], React.Dispatch<React.SetStateAction<FileData[]>>] }) {
    // console.log(file);
    return (
        <div className='flex items-center gap-2 transition-all border-b hover:bg-slate-200'>
            {file.type === "photo" ? (
                <img className='object-cover h-20 transition-all rounded-md aspect-square hover:rounded' src={file.url} />
            ) : (
                <div className='flex items-center justify-center size-20 aspect-square'>
                    <HiDocument className='text-gray-500' />
                </div>
            )}
            <div className='flex flex-col p-2'>
                <span className='text-sm text-gray-500 truncate max-w-52'>{file.name}</span>
                <span className='text-xs text-gray-400'>Tamaño: {ByteToKB(file.size)}</span>
            </div>
            <button
                onClick={() => fileState[1](fileState[0].filter((_file) => _file.id != file.id))}
                className='p-1 text-red-500 transition-all rounded-full me-4 ms-auto hover:bg-red-500/20 focus-visible:bg-red-500/20 active:bg-red-700/20'>
                <HiXMark />
            </button>
        </div>
    );
}

function FilesTray({
    imageTrayRef,
    filesState,
    expandAutomatically,
}: {
    imageTrayRef: React.RefObject<HTMLDivElement>;
    filesState: [FileData[], React.Dispatch<React.SetStateAction<FileData[]>>];
    expandAutomatically: boolean;
}) {
    const [open, setOpen] = useState<boolean>(expandAutomatically);
    return (
        <div className='overflow-hidden border border-dashed shadow rounded-xl bg-slate-100'>
            <button
                onClick={() => setOpen(!open)}
                className='flex items-center justify-between w-full p-2 text-sm text-gray-500 transition-all outline-none hover:bg-gray-200 focus-visible:bg-gray-200 active:bg-gray-300'>
                <span className='font-medium'>{open ? "Contraer" : "Expandir"}</span>
                <HiChevronUp />
            </button>
            <Transition show={open} {...expandAnimationProps} unmount={false}>
                <div ref={imageTrayRef} className='max-h-[calc(5rem*3)] overflow-y-auto'>
                    {filesState[0].map((file, idx) => (
                        <FileTile file={file} fileState={filesState} key={idx} />
                    ))}
                </div>
            </Transition>
        </div>
    );
}

function readFiles(
    e: React.ChangeEvent<HTMLInputElement>,
    max_file_size: number,
    trayRef: React.RefObject<HTMLDivElement>,
    filesState: [FileData[], React.Dispatch<React.SetStateAction<FileData[]>>],
    allowed_extensions?: string[] | null,
) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (file.size > max_file_size) {
            // Optionally handle file size error here
            console.warn(`File ${file.name} exceeds the maximum size of ${ByteToKB(max_file_size)}`);
            continue;
        }
        if (Array.isArray(allowed_extensions) && allowed_extensions != null && !allowed_extensions.includes(ext || "")) {
            // Optionally handle extension error here
            console.warn(`File ${file.name} is not an allowed extension.`);
            continue;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result && trayRef.current) {
                filesState[1]((prev) => [
                    ...prev,
                    {
                        id: filesState[0].length + 1,
                        url: reader.result as string,
                        name: file.name,
                        size: file.size,
                        type: file.type.startsWith("image/") ? "photo" : "other",
                    },
                ]);
            }
        };
        reader.onerror = () => {
            // Optionally handle error here
        };
        reader.readAsDataURL(file);
    }
}

export function PhotoInput({ field }: { field: PhotoField }) {
    const { showDescriptions, expandFilesAutomatically } = useReportStore();
    const { control } = useFormContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const imageTrayRef = useRef<HTMLDivElement>(null);

    const filesState = useState<FileData[]>([]);

    return (
        <Controller
            control={control}
            name={field.id}
            defaultValue={[]}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: () => {
                    if (field.required && filesState[0].length === 0) {
                        return "Debe adjuntar al menos una imagen";
                    }
                    if (filesState[0].length > field.max_files) {
                        return `No puede adjuntar más de ${field.max_files} imágenes`;
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => {
                // Deep compare helper
                function deepEqual(a: any, b: any) {
                    return JSON.stringify(a) === JSON.stringify(b);
                }

                // Sync local files state with form value (only if different)
                useEffect(() => {
                    if (!deepEqual(fieldController.value, filesState[0])) {
                        filesState[1](Array.isArray(fieldController.value) ? fieldController.value : []);
                    }
                }, [fieldController.value]);

                // Sync form value with local files state (only if different)
                useEffect(() => {
                    if (!deepEqual(fieldController.value, filesState[0])) {
                        fieldController.onChange(filesState[0]);
                    }
                }, [filesState[0]]);

                // Drag and drop handlers
                const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
                    if (files.length > 0 && (fieldController.value.length < field.max_files || fieldController == undefined)) {
                        // Create a fake event to reuse readImages
                        const fakeEvent = {
                            target: { files: files.slice(0, field.max_files - fieldController.value.length) },
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        readImages(fakeEvent, 60 * 1024 * 1024, imageTrayRef, filesState);
                    }
                };

                return (
                    <>
                        <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                            {field.label} {field.required && <span className='text-red-500'>*</span>}
                        </label>
                        {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                        <Tray
                            onClick={() => inputRef.current?.click()}
                            // Add drag and drop handlers
                            onDrop={handleDrop}>
                            <input
                                type='file'
                                ref={inputRef}
                                multiple
                                onChange={(e) => {
                                    if (fieldController.value.length <= field.max_files || fieldController == undefined) {
                                        // @ts-ignore
                                        let filesArray: File[] = [];
                                        if (e.target.files && e.target.files.length > field.max_files) {
                                            filesArray = Array.from(e.target.files).slice(0, field.max_files);
                                        }
                                        readImages(e, 60 * 1024 * 1024, imageTrayRef, filesState);
                                        fieldController.onChange(filesState[0].map((f) => f.url));
                                    }
                                }}
                                accept='image/*'
                                className='hidden'
                            />
                            <div className='flex items-center justify-center w-full gap-2 p-4 text-gray-500 cursor-pointer'>
                                <HiPhoto />
                                <span className='max-lg:text-sm'>Arrastre imágenes o haga clic aquí</span>
                            </div>
                            <Whisper speaker={tooltip("Pegar imágenes desde el portapapeles")} placement='topEnd'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (filesState[0].length < field.max_files || fieldController == undefined) {
                                            navigator.clipboard.read().then((clipboardItems) => {
                                                clipboardItems.forEach((clipboardItem) => {
                                                    const items = clipboardItem.types.filter((type) => type.startsWith("image/"));
                                                    if (items.length > 0) {
                                                        items.forEach((itemType) => {
                                                            clipboardItem.getType(itemType).then(async (blob) => {
                                                                const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                                                const file = new File([blob], `clipboard-image-${uniqueId}.${itemType.split("/")[1]}`, { type: itemType });
                                                                readImages(
                                                                    { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>,
                                                                    60 * 1024 * 1024,
                                                                    imageTrayRef,
                                                                    filesState,
                                                                );
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                    }}
                                    className='p-1 text-gray-500 transition-all rounded outline-none me-2 ms-auto active:bg-slate-300 hover:bg-slate-300 focus-visible:bg-slate-300'>
                                    <HiOutlineClipboardDocument />
                                </button>
                            </Whisper>
                        </Tray>
                        {fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                        <div className='block mt-2 mb-1 text-sm font-medium text-gray-700'>Archivos:</div>
                        <FilesTray imageTrayRef={imageTrayRef} filesState={filesState} expandAutomatically={expandFilesAutomatically} />
                        <div className='flex flex-row justify-between opacity-50'>
                            <small>
                                Límite de archivos: {`${field.required ? "1-" : ""}`}
                                {field.max_files}
                            </small>
                            <small>
                                Anexos: <span className='font-bold text-brand-blue'>{filesState[0].length ?? 0}</span>/{field.max_files}
                            </small>
                        </div>
                    </>
                );
            }}
        />
    );
}

export function FileInput({ field }: { field: FileField }) {
    const { showDescriptions, expandFilesAutomatically } = useReportStore();
    const { control } = useFormContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const fileTrayRef = useRef<HTMLDivElement>(null);
    const filesState = useState<FileData[]>([]);
    return (
        <Controller
            control={control}
            name={field.id}
            defaultValue={[]}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: () => {
                    if (field.required && filesState[0].length === 0) {
                        return "Debe adjuntar al menos un archivo";
                    }
                    if (filesState[0].length > field.max_files) {
                        return `No puede adjuntar más de ${field.max_files} archivos`;
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => {
                // Always validate using current filesState
                const validateFiles = () => {
                    if (field.required && filesState[0].length === 0) {
                        return "Debe adjuntar al menos un archivo";
                    }
                    if (filesState[0].length > field.max_files) {
                        return `No puede adjuntar más de ${field.max_files} archivos`;
                    }
                    return true;
                };

                // Deep compare helper
                function deepEqual(a: any, b: any) {
                    return JSON.stringify(a) === JSON.stringify(b);
                }

                // Sync local files state with form value (only if different)
                useEffect(() => {
                    if (!deepEqual(fieldController.value, filesState[0])) {
                        filesState[1](Array.isArray(fieldController.value) ? fieldController.value : []);
                    }
                }, [fieldController.value]);

                // Sync form value with local files state (only if different)
                useEffect(() => {
                    if (!deepEqual(fieldController.value, filesState[0])) {
                        fieldController.onChange(filesState[0]);
                    }
                }, [filesState[0]]);

                // Drag and drop handlers
                const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files);
                    if (files.length > 0 && (fieldController.value.length < field.max_files || fieldController == undefined)) {
                        const fakeEvent = {
                            target: { files: files.slice(0, field.max_files - fieldController.value.length) },
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        readFiles(fakeEvent, field.max_file_size, fileTrayRef, filesState, field.allowed_extensions);
                    }
                };

                // Manually trigger validation on submit or change
                useEffect(() => {
                    if (fieldState.isDirty || fieldState.isTouched) {
                        const result = validateFiles();
                        if (result !== true && fieldState.error?.message !== result) {
                            fieldController.onChange(filesState[0].map((f) => f));
                        }
                    }
                }, [filesState[0]]);

                return (
                    <>
                        <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                            {field.label} {field.required && <span className='text-red-500'>*</span>}
                        </label>
                        {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                        <Tray onClick={() => inputRef.current?.click()} onDrop={handleDrop}>
                            <input
                                type='file'
                                ref={inputRef}
                                multiple
                                onChange={(e) => {
                                    if (fieldController.value.length <= field.max_files || fieldController == undefined) {
                                        // @ts-ignore
                                        let filesArray: File[] = [];
                                        if (e.target.files && e.target.files.length > field.max_files) {
                                            filesArray = Array.from(e.target.files).slice(0, field.max_files);
                                        }
                                        readFiles(e, field.max_file_size, fileTrayRef, filesState, field.allowed_extensions);
                                    }
                                }}
                                accept={field.allowed_extensions ? field.allowed_extensions.map((ext) => `.${ext}`).join(",") : undefined}
                                className='hidden'
                            />
                            <div className='flex items-center justify-center w-full gap-2 p-4 text-gray-500 cursor-pointer'>
                                <HiDocument />
                                <span className='max-lg:text-sm'>Arrastre archivos o haga clic aquí</span>
                            </div>
                        </Tray>
                        {(() => {
                            const errorMsg = validateFiles();
                            return errorMsg !== true ? <small className='block text-red-500'>{errorMsg}</small> : null;
                        })()}
                        <div className='block mt-2 mb-1 text-sm font-medium text-gray-700'>Archivos:</div>
                        <FilesTray imageTrayRef={fileTrayRef} filesState={filesState} expandAutomatically={expandFilesAutomatically} />
                        <div className='flex items-start justify-between'>
                            <div className='flex flex-col'>
                                <small className='opacity-50'>
                                    Tamaño por archivo: {ByteToKB(field.min_file_size)}-{ByteToKB(field.max_file_size)}
                                </small>
                                <small className='opacity-50'>Formatos aceptados: {field.allowed_extensions ? field.allowed_extensions.join(", ") : "Todos los formatos"}</small>
                                <small className='opacity-50'>
                                    Límite de archivos: {`${field.required ? "1-" : ""}`}
                                    {field.max_files}
                                </small>
                            </div>
                            <small className='opacity-50'>
                                Anexos: <span className='font-bold text-brand-blue'>{filesState[0].length ?? 0}</span>/{field.max_files}
                            </small>
                        </div>
                    </>
                );
            }}
        />
    );
}

function ByteToKB(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function SignatureInput({ field }: { field: SignatureField }) {
    const { showDescriptions, expandFilesAutomatically } = useReportStore();
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [isEraser, setIsEraser] = useState<boolean>(false);
    const { control } = useFormContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const fileTrayRef = useRef<HTMLDivElement>(null);
    const [draw, setDraw] = useState<"yes" | "no" | "none">("none");
    // Store image file as base64 or url
    const [imageValue, setImageValue] = useState<FileData[]>([]);
    return (
        <Controller
            control={control}
            name={field.id}
            rules={{
                required: field.required ? "Este campo es obligatorio" : false,
                validate: (value: string | null) => {
                    if (field.required && !value) {
                        return "Debe proporcionar una firma";
                    }
                    return true;
                },
            }}
            render={({ field: fieldController, fieldState }) => {
                // When switching modes, clear the other value
                useEffect(() => {
                    if (draw === "yes") {
                        setImageValue([]);
                        if (!fieldController.value && canvasRef.current) {
                            canvasRef.current.clearCanvas();
                            setIsEraser(false);
                            canvasRef.current.eraseMode(false);
                        }
                    } else if (draw === "no") {
                        if (canvasRef.current) {
                            canvasRef.current.clearCanvas();
                            setIsEraser(false);
                            canvasRef.current.eraseMode(false);
                        }
                        fieldController.onChange(imageValue[0]);
                    }
                }, [draw]);

                // When imageValue changes, update form value if in image mode
                useEffect(() => {
                    if (draw === "no") {
                        fieldController.onChange(imageValue[0]);
                    }
                }, [imageValue]);

                // Drag and drop handlers (for image mode)
                const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files);
                    if (draw === "no" && files.length > 0) {
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (typeof reader.result === "string") {
                                setImageValue([{ id: 1, name: "Firma.png", size: new TextEncoder().encode(reader.result).length, type: "photo", url: reader.result }]);
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };

                return (
                    <div className='mb-4'>
                        <label htmlFor={field.id} className='block mb-1 text-sm font-medium text-gray-700'>
                            {field.label} {field.required && <span className='text-red-500'>*</span>}
                        </label>

                        <RadioGroup
                            className='grid overflow-hidden mb-2 items-center cursor-pointer select-none grid-cols-2 *:px-4 *:py-2 bg-slate-100 *:text-sm *:font-medium border divide-x rounded-xl *:flex *:items-center *:justify-center *:gap-x-4'
                            value={draw}
                            onChange={setDraw}>
                            <RadioGroup.Option
                                value={"yes"}
                                className={({ checked }) => classNames("transition-all outline-none", checked ? "bg-brand-blue hover:bg-brand-blue/80 focus-visible:bg-brand-blue/80 text-white" : "hover:bg-slate-200 focus-visible:bg-slate-200")}>
                                <HiOutlinePencilSquare />
                                Dibujar firma
                            </RadioGroup.Option>
                            <RadioGroup.Option
                                value={"no"}
                                className={({ checked }) => classNames("transition-all outline-none", checked ? "bg-brand-blue hover:bg-brand-blue/80 focus-visible:bg-brand-blue/80 text-white" : "hover:bg-slate-200 focus-visible:bg-slate-200")}>
                                <HiOutlinePhoto className='size-4' />
                                Foto de firma
                            </RadioGroup.Option>
                        </RadioGroup>
                        {field.description && showDescriptions && <p className='opacity-50'>{field.description}</p>}
                        <div className='relative'>
                            {draw == "yes" ? (
                                    <div className='flex items-start justify-between gap-x-2'>
                                        <ReactSketchCanvas
                                            ref={canvasRef}
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                borderRadius: "0.75rem",
                                                border: "1px dashed #d1d5db",
                                                cursor: "crosshair",
                                            }}
                                            exportWithBackgroundImage={false}
                                            className='mb-4 *:rounded-xl'
                                            strokeWidth={2}
                                            strokeColor='#0369a1'
                                            onStroke={() => {
                                                canvasRef.current?.exportImage("png").then((dataUrl) => {
                                                    fieldController.onChange({
                                                        id: 1,
                                                        name: `Firma.png`,
                                                        url: dataUrl,
                                                        size: typeof dataUrl === "string" ? new TextEncoder().encode(dataUrl).length : 0,
                                                        type: "photo",
                                                    });
                                                });
                                            }}
                                        />
                                        <div className='flex flex-col gap-2'>
                                            <button
                                                className='flex items-center justify-center transition-all border rounded-full outline-none text-brand-blue border-brand-blue/50 hover:bg-brand-light-blue/50 focus-visible:bg-brand-light-blue/50 active:bg-brand-light-blue aspect-square'
                                                onClick={() => {
                                                    canvasRef.current?.exportImage("png").then((dataUrl) => {
                                                        const link = document.createElement("a");
                                                        link.setAttribute("href", dataUrl);
                                                        link.setAttribute("download", `${field.label}.png`);
                                                        link.click();
                                                        canvasRef.current?.clearCanvas();
                                                        fieldController.onChange(null);
                                                    });
                                                }}>
                                                <HiArrowDownTray className='m-1.5 size-5' />
                                            </button>
                                            <button
                                                type='button'
                                                className='flex items-center justify-center text-red-500 transition-all border border-red-300 rounded-full outline-none aspect-square hover:bg-red-50 focus-visible:bg-red-50 active:bg-red-100'
                                                onClick={() => {
                                                    fieldController.onChange(null);
                                                    setIsEraser(false);
                                                    canvasRef.current?.eraseMode(false);
                                                    canvasRef.current?.clearCanvas();
                                                }}>
                                                <HiOutlineTrash className='m-1.5 size-5' />
                                            </button>
                                            <button
                                                type='button'
                                                className='flex items-center justify-center transition-all border rounded-full outline-none text-slate-500 border-slate-300 aspect-square hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-200'
                                                onClick={() => {
                                                    canvasRef.current?.eraseMode(!isEraser);
                                                    setIsEraser(!isEraser);
                                                }}>
                                                {!isEraser ? <PiEraser className='m-1.5 size-5' /> : <HiOutlinePencil className='m-1.5 size-5' />}
                                            </button>
                                            <button
                                                type='button'
                                                className='flex items-center justify-center transition-all border rounded-full outline-none text-slate-500 border-slate-300 aspect-square hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-200'
                                                onClick={() => {
                                                    canvasRef.current?.undo();
                                                }}>
                                                <HiArrowUturnLeft className='m-1.5 size-5' />
                                            </button>
                                            <button
                                                type='button'
                                                className='flex items-center justify-center transition-all border rounded-full outline-none text-slate-500 border-slate-300 aspect-square hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-200'
                                                onClick={() => canvasRef.current?.redo()}>
                                                <HiArrowUturnRight className='m-1.5 size-5' />
                                            </button>
                                        </div>
                                    </div>
                            ) : (
                                <>
                                    <Tray onClick={() => inputRef.current?.click()} onDrop={handleDrop}>
                                        <input
                                            type='file'
                                            ref={inputRef}
                                            multiple={false}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const file = e.target.files[0];
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setImageValue([
                                                            {
                                                                id: 1,
                                                                name: "Firma.png",
                                                                size: typeof reader.result === "string" ? new TextEncoder().encode(reader.result).length : 0,
                                                                type: "photo",
                                                                url: reader.result as string,
                                                            },
                                                        ]);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            accept='image/*'
                                            className='hidden'
                                        />
                                        <div className='flex items-center justify-center w-full gap-2 p-4 text-gray-500 cursor-pointer'>
                                            <HiDocument />
                                            <span className='max-lg:text-sm'>Agregar imagen de firma</span>
                                        </div>
                                    </Tray>
                                    <div className="py-2"></div>
                                    <FilesTray imageTrayRef={fileTrayRef} filesState={[imageValue, setImageValue]} expandAutomatically={expandFilesAutomatically} />
                                </>
                            )}
                        </div>
                        {fieldState.error && <small className='block text-red-500'>{fieldState.error.message}</small>}
                    </div>
                );
            }}
        />
    );
}
