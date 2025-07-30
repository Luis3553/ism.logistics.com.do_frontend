import { CheckboxGroupInput, DateInput, DropdownInput, FileInput, PhotoInput, RadioGroupInput, RatingInput, SignatureInput, TextInput } from "./fields";
import { HiArrowDownTray, HiArrowUpTray, HiOutlineCog6Tooth, HiXMark } from "react-icons/hi2";
import { Menu, Transition } from "@headlessui/react";
import { FaRegSquare } from "react-icons/fa";
import { FaSquareCheck } from "react-icons/fa6";
import { appearAnimationProps, scaleAnimationProps } from "@utils/animations";
import { Fragment } from "react/jsx-runtime";
import classNames from "classnames";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { useReportStore } from "@contexts/report.context";
import { tooltip } from "@utils/ui";
import { useToaster, Whisper } from "rsuite";
import { useEffect, useRef, useState } from "react";
import messageToaster from "@utils/toaster";
import { ErrorBoundary } from "react-error-boundary";

export default function Form() {
    const formStateLoaderRef = useRef<HTMLInputElement>(null);
    const { activeReport, setShowDescriptions, showDescriptions, setExpandFilesAutomatically, expandFilesAutomatically, storeInLocalStorage, setStoreInLocalStorage } =
        useReportStore();
    const methods = useForm();
    const { handleSubmit, reset, getValues } = methods;
    const [formName, setFormName] = useState("");

    const [storedForms, setStoredForms] = useState<{ name: String; report_type: number; data: any }[]>([]);
    const toaster = useToaster();

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

    function submit(clean: boolean) {
        handleSubmit((data) => {
            data = cleanFormEmptyKeys(data);
            console.log(data);
        })().then(() => {
            if (clean) reset();
        });
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
                    <div className='relative flex justify-center mb-4'>
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
                        className='grid mb-[10rem] md:mb-[8rem] gap-x-4 md:grid-cols-2 h-min'
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                        <section className='flex flex-col *:px-4 *:py-2'>
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
                        <div className='flex justify-end *:h-11 col-span-2 gap-2 absolute bottom-0 end-0 p-4 w-full max-md:text-sm *:text-nowrap flex-wrap'>
                            <button
                                onClick={() => reset()}
                                className='px-4 py-2 font-medium transition-all rounded-lg outline-none max-md:w-[calc(50%-0.25rem)] bg-slate-200 hover:bg-slate-300 text-slate-700 active:text-white active:bg-slate-700 md:me-auto'
                                type='reset'>
                                Descartar
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    submit(true);
                                }}
                                className='px-4 py-2 font-medium transition-all rounded-lg outline-none max-md:w-[calc(50%-0.25rem)] text-sky-500 hover:bg-sky-200 active:text-white active:bg-brand-blue bg-brand-light-blue'
                                type='submit'>
                                Guardar
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    submit(false);
                                }}
                                className='px-4 py-2 font-medium transition-all rounded-lg outline-none max-md:w-[calc(50%-0.25rem)] text-sky-500 hover:bg-sky-200 active:text-white active:bg-brand-blue bg-brand-light-blue'
                                type='submit'>
                                Guardar y continuar
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    submit(false);
                                }}
                                className='px-4 py-2 font-medium text-white transition-all rounded-lg outline-none max-md:w-[calc(50%-0.25rem)] bg-brand-blue'
                                type='submit'>
                                Guardar y descargar
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </ErrorBoundary>
        </div>
    );
}
