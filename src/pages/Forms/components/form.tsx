import { CheckboxGroupInput, DateInput, DropdownInput, FileInput, PhotoInput, RadioGroupInput, RatingInput, SignatureInput, TextInput } from "./fields";
import { HiArrowDownTray, HiArrowUpTray, HiChevronUpDown, HiOutlineCog6Tooth, HiXMark } from "react-icons/hi2";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { FaRegSquare } from "react-icons/fa";
import { FaSquareCheck } from "react-icons/fa6";
import { appearAnimationProps, scaleAnimationProps } from "@utils/animations";
import { Fragment } from "react/jsx-runtime";
import classNames from "classnames";
import { useForm, FormProvider, FieldValues, Controller, useFormContext } from "react-hook-form";
import { useReportStore } from "@contexts/report.context";
import { tooltip } from "@utils/ui";
import { useToaster, Whisper } from "rsuite";
import { useEffect, useRef, useState } from "react";
import messageToaster from "@utils/toaster";
import { ErrorBoundary } from "react-error-boundary";
import { Option } from "@pages/Configuration/components/ListOfConfigurations";
import { useTrackersQuery } from "@framework/getTrackers";
import { VscLoading } from "react-icons/vsc";
import api from "@framework/index";
import { format } from "date-fns";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { FileData } from "@utils/types";
import { LoadSpinner } from "@components/LoadSpinner";

function TrackerSelector() {
    const { control } = useFormContext();

    const [trackers, setTrackers] = useState<Option[]>([]);
    const { data, isLoading, error } = useTrackersQuery();
    // const { data, isLoading, error } = useApiQuery<Option[]>("/notifications/trackers", {});

    useEffect(() => {
        if (data) {
            setTrackers(data.list.map((tracker) => ({ label: tracker.label, value: tracker.id })));
        }
    }, [data]);

    if (isLoading)
        return (
            <div className='text-gray-500'>
                <VscLoading className='animate-spin text-brand-blue' /> Cargando objetos...
            </div>
        );
    if (error) return <div className='text-red-500 '>Error al cargar los objetos</div>;

    if (data)
        return (
            <Controller
                name='tracker'
                control={control}
                defaultValue={{ label: "Seleccione un objeto", value: "" }}
                rules={{ required: "El campo es obligatorio" }}
                render={({ field }) => {
                    return (
                        <Listbox as={"div"} className={"relative w-full"}>
                            <Listbox.Label className='block mb-1 text-sm font-medium text-gray-700'>Objeto</Listbox.Label>
                            <Listbox.Button className='flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm outline-none pe-2 hover:bg-gray-50 focus:border-brand-blue'>
                                <span className='truncate'>{field.value.label}</span>
                                <HiChevronUpDown className='text-gray-400 size-6' />
                            </Listbox.Button>
                            <Listbox.Options className='absolute z-50 w-full mt-1 overflow-hidden overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg outline-none max-h-60'>
                                {trackers.map((tracker, idx) => (
                                    <Listbox.Option
                                        onClick={() => field.onChange(tracker)}
                                        key={`${idx}-${tracker.id}`}
                                        value={tracker.label}
                                        className={({ active }) =>
                                            classNames("cursor-pointer select-none relative px-4 py-2", active ? "bg-gray-100 text-gray-900" : "text-gray-700")
                                        }>
                                        {tracker.label}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    );
                }}
            />
        );
}

export default function Form() {
    const formStateLoaderRef = useRef<HTMLInputElement>(null);
    const { activeReport, setShowDescriptions, showDescriptions, setExpandFilesAutomatically, expandFilesAutomatically, storeInLocalStorage, setStoreInLocalStorage } =
        useReportStore();
    const methods = useForm();
    const { handleSubmit, reset, getValues } = methods;
    const [formName, setFormName] = useState("");

    const [storedForms, setStoredForms] = useState<{ name: String; report_type: number; data: any }[]>([]);
    const toaster = useToaster();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const formsKeys = Object.keys(localStorage).filter((key) => key.startsWith("form-"));
        const forms = formsKeys
            .map((form) => {
                const _form: { report_type: number; data: any } = JSON.parse(localStorage.getItem(form) || "{}");
                if (_form.report_type === activeReport?.id) {
                    return _form;
                }
                return undefined;
            })
            .filter((form): form is { name: string; report_type: number; data: any } => form !== undefined);
        setStoredForms(forms);
        setFormName("");
        setIsLoading(false);
        reset();
    }, [activeReport]);

    function validateKeySize(key: string): boolean {
        return new TextEncoder().encode(key).length <= 5 * 1024 * 1024; // 5 MB
    }

    function downloadForm() {
        try {
            toaster.push(messageToaster("Descargando..."), { duration: 2000, placement: "topEnd" });
            const formState = getValues();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formState, null, 2));
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `${formName}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (error) {
            toaster.push(messageToaster("Error al descargar el formulario", "error"), {
                duration: 2000,
                placement: "topEnd",
            });
        }
    }

    function cleanFormEmptyKeys(data: FieldValues) {
        const keys = Object.keys(data);
        keys.forEach((key) => {
            if (data[key] === "" || data[key] === null || data[key] === undefined || (Array.isArray(data[key]) && data[key].length === 0)) {
                delete data[key];
            }
        });
        return data;
    }

    async function createForm(): Promise<number | undefined> {
        try {
            const res = await api.post("/checkin/form/create", {
                tracker_id: getValues("tracker").value,
                template_id: activeReport?.id,
            });
            return res.data.id;
        } catch (error) {
            toaster.push(messageToaster("Error al crear el check-in", "error"), {
                duration: 2000,
                placement: "topEnd",
            });
            return undefined;
        }
    }

    type PresignedResponse = {
        expires: string;
        fields: { [key: string]: string };
        file_field_name: string;
        file_id: number;
        url: string;
    };

    async function createFormFile(form_id: number, field_id: string, file: FileData): Promise<PresignedResponse | undefined> {
        const res = await api.post("/checkin/form/file/create", {
            form_id,
            field_id,
            size: file.size,
        });
        return res.data.value;
    }

    function base64ToBlob(base64: string, mime: string): Blob {
        const byteString = atob(base64.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mime });
    }

    async function uploadToS3(presigned: PresignedResponse, file: FileData) {
        const formData = new FormData();
        const fields = { ...presigned.fields };
        fields.key = fields.key.replace("${filename}", file.name);

        for (const [key, value] of Object.entries(fields)) {
            formData.append(key, value);
        }

        formData.append(presigned.file_field_name || "file", base64ToBlob(file.url, file.url.split(";")[0].replace("data:", "")));

        const res = await fetch(presigned.url, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error("Upload failed: " + text);
        }

        return presigned.file_id;
    }

    async function handlePhotoUploads(formId: number, files: FileData[], fieldId: string) {
        try {
            const fileIds = [];

            for (const file of files) {
                const presigned = await createFormFile(formId, fieldId, file);
                const fileId = await uploadToS3(presigned!, file);
                fileIds.push(fileId);
            }

            return fileIds;
        } catch (error) {
            setIsLoading(false);
            toaster.push(messageToaster("Error al subir archivos", "error"), {
                duration: 2000,
                placement: "topEnd",
            });
            return [];
        }
    }

    async function getTrackerLocation(): Promise<{ lat: number; lng: number }> {
        const res = await api.post("/tracker/get_last_gps_point", {
            tracker_id: getValues("tracker").value,
        });
        return {
            lat: res.data.value.lat ?? 0,
            lng: res.data.value.lng ?? 0,
        };
    }

    async function downloadFile(id: number, name: string) {
        const res = await api.post(
            `https://app.progps.com.do/api-v2/form/download`,
            {
                id: id,
                format: "pdf",
            },
            {
                responseType: "blob", // Ensure the response is treated as a Blob
            },
        );

        if (!(res.status === 200)) {
            toaster.push(messageToaster("Error al descargar el archivo", "error"), {
                duration: 2000,
                placement: "topEnd",
            });
            throw new Error("File download failed");
        }

        const blob = await res.data;
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = name; // Name of the downloaded file
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url); // Clean up
    }

    function submit(clean: boolean, download: boolean = false) {
        setIsLoading(true);
        toaster.push(messageToaster("Enviando formulario...", "info"), { duration: 2000, placement: "topEnd" });
        handleSubmit(async (data) => {
            data = cleanFormEmptyKeys(data);
            const form_id = await createForm();

            const formSignatureField = activeReport?.fields.filter((field) => field.type === "signature")[0];
            const formSignatureFieldValue: {
                [key: string]: any;
            } = {};
            if (formSignatureField) {
                const id = await handlePhotoUploads(form_id!, [getValues(formSignatureField.id)], formSignatureField.id);
                formSignatureFieldValue[formSignatureField.id] = id[0];
            }

            const formPhotoFields = activeReport?.fields.filter((field) => field.type === "photo");
            const formPhotoFieldsValues: {
                [key: string]: any;
            } = {};
            if (formPhotoFields && formPhotoFields.length > 0) {
                for (const field of formPhotoFields) {
                    const ids = await handlePhotoUploads(form_id!, getValues(field.id), field.id);
                    formPhotoFieldsValues[field.id] = ids;
                }
            }

            const formFileFields = activeReport?.fields.filter((field) => field.type === "file");
            const formFileFieldsValues: {
                [key: string]: any;
            } = {};
            if (formFileFields && formFileFields.length > 0) {
                for (const field of formFileFields) {
                    const ids = await handlePhotoUploads(form_id!, getValues(field.id), field.id);
                    formFileFieldsValues[field.id] = ids;
                }
            }
            formFileFields?.forEach(async (field) => {
                formFileFieldsValues[field.id] = await handlePhotoUploads(form_id!, getValues(field.id), field.id);
            });

            let values: { [key: string]: any } = {};

            Object.keys(getValues()).forEach((key) => {
                if (key === "tracker") return; // Skip tracker field
                const type = activeReport?.fields.find((field) => field.id === key)?.type;
                values[key] = {
                    type,
                    [type === "text" || type === "date" || type === "rating"
                        ? "value"
                        : type === "checkbox_group"
                        ? "values"
                        : type === "dropdown"
                        ? "value_index"
                        : type === "radio_group"
                        ? "value_index"
                        : type === "photo" || type === "file"
                        ? "file_ids"
                        : "file_id"]:
                        type === "photo"
                            ? formPhotoFieldsValues[key] ?? []
                            : type === "file"
                            ? formFileFieldsValues[key] ?? []
                            : type === "signature"
                            ? formSignatureFieldValue[key]
                            : type === "dropdown"
                            ? getValues(key).value
                            : type === "date"
                            ? format(new Date(getValues(key)), "yyyy-MM-dd")
                            : getValues(key),
                };
            });

            api.post("/checkin/create", {
                tracker_id: getValues("tracker").value,
                location: await getTrackerLocation(),
                comment: `Formulario web: ${formName}`,
                form_submission: {
                    form_id,
                    values,
                },
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        toaster.push(messageToaster("Formulario enviado correctamente", "success"), {
                            duration: 2000,
                            placement: "topEnd",
                        });
                        if (download) {
                            await downloadFile(form_id!, `${formName || form_id}.pdf`);
                        }
                        if (storeInLocalStorage) {
                            localStorage.removeItem(`form-${formName}`);
                            setStoredForms((prev) => prev.filter((f) => f.name !== formName));
                        }
                    }
                })
                .catch(() => setIsLoading(false))
                .finally(() => setIsLoading(false));
        })().then(() => {
            if (clean) reset();
        });
        setFormName("");
    }

    if (!activeReport) {
        return (
            <div className='w-full min-h-[calc(100%-64px)] p-4 text-center items-center flex justify-center text-gray-500 bg-white shadow rounded-xl'>Seleccione un formulario</div>
        );
    }

    const col1 = activeReport.fields.slice(0, Math.ceil(activeReport.fields.length / 2));
    const col2 = activeReport.fields.slice(Math.ceil(activeReport.fields.length / 2));

    return (
        <div className='relative w-full h-full p-4 bg-white shadow grow rounded-xl'>
            <ErrorBoundary fallback={<div className='text-red-500'>Error al renderizar el formulario</div>}>
                <FormProvider {...methods}>
                    <div className='relative flex items-center mb-4 max-lg:ms-16 max-lg:gap-x-4 lg:justify-center'>
                        <h1 className='text-lg font-medium text-center'>{activeReport.label}</h1>
                        <div className='absolute flex gap-x-2 end-0'>
                            <Menu>
                                <Whisper speaker={tooltip("Cargar progreso de formulario guardado")} placement='leftStart'>
                                    <input type='file' ref={formStateLoaderRef} className='hidden' />
                                    <Menu.Button
                                        onClick={() => {
                                            if (!storeInLocalStorage) {
                                                formStateLoaderRef.current?.click();
                                                formStateLoaderRef.current!.onchange = (e) => {
                                                    const file = (e.target as HTMLInputElement).files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (event) => {
                                                            const data = JSON.parse(event.target!.result as string);
                                                            methods.reset(data);
                                                        };
                                                        reader.readAsText(file);
                                                    }
                                                };
                                            }
                                        }}
                                        className='w-6 h-6 transition-all rounded-full outline-none hover:bg-gray-100 focus-visible:bg-gray-100 text-slate-600'>
                                        <HiArrowUpTray className='m-1 size-4' />
                                    </Menu.Button>
                                    <ErrorBoundary fallback={<div className='text-red-500'>Error al cargar formularios</div>}>
                                        {storeInLocalStorage ? (
                                            <Transition {...scaleAnimationProps} as={Fragment}>
                                                <Menu.Items className='absolute right-0 z-50 p-1 text-sm bg-white border border-gray-200 shadow-lg outline-none rounded-xl w-60 top-8'>
                                                    {storedForms.length == 0 ? (
                                                        <Menu.Item>
                                                            <div className='m-1 text-center text-slate-400'>No se ha guardado ningún formulario</div>
                                                        </Menu.Item>
                                                    ) : (
                                                        storedForms.map((form, index) => (
                                                            <Menu.Item key={index}>
                                                                {({ active }) => (
                                                                    <div className='flex overflow-hidden rounded-lg group hover:bg-gray-100'>
                                                                        <button
                                                                            onClick={() => {
                                                                                const data: { report_type: number; data: any } = form;
                                                                                methods.reset(data.data);
                                                                            }}
                                                                            className={classNames(
                                                                                "w-full px-4 py-2 text-left rounded-lg rounded-e-none",
                                                                                active ? "text-gray-900" : "text-gray-700",
                                                                            )}>
                                                                            {form.name}
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                localStorage.removeItem("form-" + form.name);
                                                                                if (formStateLoaderRef.current) {
                                                                                    formStateLoaderRef.current.value = "";
                                                                                }
                                                                                setStoredForms((prev) => prev.filter((f) => f.name !== form.name));
                                                                            }}
                                                                            className='flex items-center justify-center rounded-lg rounded-s-none w-9 hover:bg-red-500/20'>
                                                                            <HiXMark />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                        ))
                                                    )}
                                                </Menu.Items>
                                            </Transition>
                                        ) : (
                                            <></>
                                        )}
                                    </ErrorBoundary>
                                </Whisper>
                            </Menu>
                            <Menu>
                                <Whisper speaker={tooltip("Guardar progreso del formulario actual")} placement='autoHorizontal'>
                                    <Menu.Button className='w-6 h-6 transition-all rounded-full outline-none hover:bg-gray-100 focus-visible:bg-gray-100 text-slate-600'>
                                        <HiArrowDownTray className='m-1 size-4' />
                                    </Menu.Button>
                                </Whisper>
                                <Transition {...scaleAnimationProps} as={Fragment}>
                                    <Menu.Items className='absolute right-0 z-50 p-1 text-sm bg-white border border-gray-200 shadow-lg outline-none rounded-xl w-72 top-8'>
                                        <div className='flex'>
                                            <input
                                                type='text'
                                                value={formName}
                                                onChange={(e) => setFormName(e.target.value)}
                                                placeholder='Nombre del formulario'
                                                className='p-2 px-4 border rounded-lg outline-none rounded-e-none'
                                            />
                                            <button
                                                disabled={formName.length === 0}
                                                className='px-4 transition border rounded-lg disabled:bg-slate-200 disabled:text-slate-400 rounded-s-none bg-brand-light-blue text-brand-blue hover:bg-brand-blue hover:text-white active:bg-brand-blue/90 focus-visible:bg-brand-blue'
                                                onClick={() => {
                                                    if (storeInLocalStorage) {
                                                        try {
                                                            setStoredForms((prev) => [{ name: formName, report_type: activeReport.id, data: getValues() }, ...prev]);
                                                            const data = JSON.stringify({ name: formName, report_type: activeReport.id, data: getValues() });
                                                            if (validateKeySize(data)) {
                                                                localStorage.setItem(`form-${formName}`, data);
                                                                toaster.push(messageToaster(`Formulario preliminar guardado como ${formName}`, "success"), {
                                                                    duration: 2000,
                                                                    placement: "topEnd",
                                                                });
                                                            } else {
                                                                toaster.push(messageToaster("El tamaño del formulario excede los 5 Mb. Descargando...", "error"), {
                                                                    duration: 2000,
                                                                    placement: "topEnd",
                                                                });
                                                                downloadForm();
                                                            }
                                                        } catch (error) {
                                                            toaster.push(messageToaster("Error al guardar el formulario", "error"), {
                                                                duration: 2000,
                                                                placement: "topEnd",
                                                            });
                                                        }
                                                    } else {
                                                        downloadForm();
                                                    }
                                                    setFormName("");
                                                }}>
                                                Guardar
                                            </button>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            <Menu>
                                <Whisper speaker={tooltip("Opciones")} placement='autoVertical'>
                                    <Menu.Button className='w-6 h-6 transition-all rounded-full outline-none hover:bg-gray-100 focus-visible:bg-gray-100 text-slate-600'>
                                        <HiOutlineCog6Tooth className='m-1 size-4' />
                                    </Menu.Button>
                                </Whisper>
                                <Transition {...scaleAnimationProps} as={Fragment}>
                                    <Menu.Items className='absolute right-0 z-50 p-1 text-sm bg-white border border-gray-200 shadow-lg outline-none rounded-xl w-72 top-8'>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        localStorage.setItem("showDescriptions", String(!showDescriptions));
                                                        setShowDescriptions(!showDescriptions);
                                                    }}
                                                    className={classNames(
                                                        "w-full px-4 items-center py-2 text-left rounded-lg flex flex-row flex-nowrap gap-2",
                                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    )}>
                                                    <div className='relative block w-2 h-4 mr-2'>
                                                        <Transition show={showDescriptions} {...appearAnimationProps}>
                                                            <FaSquareCheck className='absolute inline top-[1px] mr-2 text-brand-blue' />
                                                        </Transition>
                                                        <Transition show={!showDescriptions} {...appearAnimationProps}>
                                                            <FaRegSquare className='absolute inline top-[1px] mr-2' />
                                                        </Transition>
                                                    </div>
                                                    <div>Mostrar descripciones</div>
                                                </button>
                                            )}
                                        </Menu.Item>

                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        localStorage.setItem("expandFilesAutomatically", String(!expandFilesAutomatically));
                                                        setExpandFilesAutomatically(!expandFilesAutomatically);
                                                    }}
                                                    className={classNames(
                                                        "w-full px-4 items-center py-2 text-left rounded-lg flex flex-row flex-nowrap gap-2",
                                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    )}>
                                                    <div className='relative block w-2 h-4 mr-2'>
                                                        <Transition show={expandFilesAutomatically} {...appearAnimationProps}>
                                                            <FaSquareCheck className='absolute inline top-[1px] mr-2 text-brand-blue' />
                                                        </Transition>
                                                        <Transition show={!expandFilesAutomatically} {...appearAnimationProps}>
                                                            <FaRegSquare className='absolute inline top-[1px] mr-2' />
                                                        </Transition>
                                                    </div>
                                                    <div>Mostrar archivos automáticamente</div>
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setStoreInLocalStorage(!storeInLocalStorage);
                                                    }}
                                                    className={classNames(
                                                        "w-full px-4 items-center py-2 text-left rounded-lg flex flex-row flex-nowrap gap-2",
                                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    )}>
                                                    <div className='relative block w-2 h-4 mr-2'>
                                                        <Transition show={storeInLocalStorage} {...appearAnimationProps}>
                                                            <FaSquareCheck className='absolute inline top-[1px] mr-2 text-brand-blue' />
                                                        </Transition>
                                                        <Transition show={!storeInLocalStorage} {...appearAnimationProps}>
                                                            <FaRegSquare className='absolute inline top-[1px] mr-2' />
                                                        </Transition>
                                                    </div>
                                                    <div>Guardar formularios localmente</div>
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                    <form
                        className='grid mb-[14rem] md:mb-[12rem] gap-x-4 md:grid-cols-2 h-min'
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                        <section className='flex flex-col *:px-4 *:py-2'>
                            <div className='flex items-center gap-x-2'>
                                <TrackerSelector />
                            </div>
                            {col1.map((field) => (
                                <div key={field.id}>
                                    <ErrorBoundary fallback={<div className='text-red-500'>Error al renderizar el campo</div>}>
                                        {field.type === "text" && <TextInput field={field} />}
                                        {field.type === "rating" && <RatingInput field={field} />}
                                        {field.type === "photo" && <PhotoInput field={field} />}
                                        {field.type === "file" && <FileInput field={field} />}
                                        {field.type === "dropdown" && <DropdownInput field={field} />}
                                        {field.type === "date" && <DateInput field={field} />}
                                        {field.type === "checkbox_group" && <CheckboxGroupInput field={field} />}
                                        {field.type === "radio_group" && <RadioGroupInput field={field} />}
                                        {field.type === "signature" && <SignatureInput field={field} />}
                                    </ErrorBoundary>
                                </div>
                            ))}
                        </section>
                        <section className='flex flex-col *:px-4 *:py-2'>
                            {col2.map((field) => (
                                <div key={field.id}>
                                    <ErrorBoundary fallback={<div className='text-red-500'>Error al renderizar el campo</div>}>
                                        {field.type === "text" && <TextInput field={field} />}
                                        {field.type === "rating" && <RatingInput field={field} />}
                                        {field.type === "photo" && <PhotoInput field={field} />}
                                        {field.type === "file" && <FileInput field={field} />}
                                        {field.type === "dropdown" && <DropdownInput field={field} />}
                                        {field.type === "date" && <DateInput field={field} />}
                                        {field.type === "checkbox_group" && <CheckboxGroupInput field={field} />}
                                        {field.type === "radio_group" && <RadioGroupInput field={field} />}
                                        {field.type === "signature" && <SignatureInput field={field} />}
                                    </ErrorBoundary>
                                </div>
                            ))}
                        </section>
                        <div className='grid grid-rows-[3rem_5.75rem] sm:grid-rows-[3rem_2.75rem] grid-cols-1 justify-between absolute bottom-0 end-0 p-4 gap-y-2 w-full text-sm *:text-nowrap flex-wrap'>
                            <div className='w-full h-12'>
                                <Input
                                    onChange={(e) => {
                                        setFormName(e.target.value ?? "");
                                    }}
                                    value={formName}
                                    id='formName'
                                    placeholder='Nombre del formulario'
                                />
                            </div>
                            <div className='max-sm:grid grid-cols-2 sm:flex justify-end *:h-11 gap-2 w-full text-sm *:text-nowrap flex-wrap'>
                                <Button
                                    disabled={isLoading}
                                    onClick={() => {
                                        reset();
                                        setFormName("");
                                    }}
                                    strength='muted'
                                    variant='subtle'
                                    type='reset'
                                    className='sm:me-auto'>
                                    Descartar
                                </Button>
                                <Button
                                    disabled={isLoading}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        submit(true);
                                    }}
                                    variant='subtle'
                                    type='submit'>
                                    Guardar
                                </Button>
                                <Button
                                    disabled={isLoading}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        submit(false);
                                    }}
                                    variant='subtle'
                                    type='submit'>
                                    Guardar y continuar
                                </Button>
                                <Button
                                    disabled={isLoading}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        submit(false, true);
                                    }}
                                    variant='solid'
                                    type='submit'>
                                    Guardar y descargar
                                </Button>
                            </div>
                        </div>
                    </form>
                    <Transition show={isLoading} {...appearAnimationProps}>
                        <div className='absolute top-0 z-40 w-full h-full transition bg-white/50 start-0 rounded-xl backdrop-blur-sm'>
                            <LoadSpinner />
                        </div>
                    </Transition>
                </FormProvider>
            </ErrorBoundary>
        </div>
    );
}
