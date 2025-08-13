import { Transition } from "@headlessui/react";
import { appearAnimationProps } from "@utils/animations";
import { ReportType } from "@utils/types";
import { HiDocument } from "react-icons/hi2";
import cn from "classnames";
import { useEffect, useState } from "react";

export default function ReportCreateForm({
    generatingReport,
    activeReportType,
    fieldValues,
    setFieldValues,
    isPayloadValid,
    sendReportRequest,
    errorMessage,
    setCreateScreen,
    setActiveReportType,
    setIsMenuOpen,
}: {
    generatingReport: boolean;
    fieldValues: Record<string, any>;
    setFieldValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    activeReportType: ReportType | null;
    setActiveReportType: React.Dispatch<React.SetStateAction<ReportType | null>>;
    isPayloadValid: boolean;
    sendReportRequest(): Promise<void>;
    errorMessage: string | undefined;
    setCreateScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        setButtonDisabled(!isPayloadValid || generatingReport);
    }, [isPayloadValid, generatingReport]);

    return (
        <div className='relative flex flex-col h-full overflow-hidden'>
            <div className='flex flex-row items-center px-4 font-bold text-gray-700 bg-gray-200 md:min-h-10 md:max-h-10 min-h-8 max-h-8 gap-x-4'>
                <HiDocument />
                <span>Parámetros</span>
            </div>
            <div className='flex flex-col items-start justify-between h-full p-4 lg:gap-4'>
                <fieldset className='grid w-full gap-4 lg:grid-cols-2 max-h-[calc(100%-70px)] overflow-y-auto'>
                    {activeReportType!.fields.map((field, index) => {
                        const FieldComponent = field.component;
                        return (
                            <FieldComponent
                                key={index}
                                value={fieldValues[`${field.key}`]}
                                onChange={(e: any) => {
                                    let value;
                                    if (field.onChangeType === "event") {
                                        value = e.target.value;
                                    } else if (field.onChangeType === "option") {
                                        value = e; // GroupByField returns the selected option object
                                    } else if (field.onChangeType === "boolean") {
                                        value = e.target.checked;
                                    } else {
                                        value = e;
                                    }
                                    setFieldValues((prev) => ({
                                        ...prev,
                                        [`${field.key}`]: value,
                                    }));
                                }}
                                {...field.props}
                            />
                        );
                    })}
                </fieldset>
                <div className='absolute bottom-0 flex flex-col w-full gap-2 p-2 pt-1 mt-0 transition-all duration-500 bg-white border-t md:pt-2 md:gap-3 max-md:items-center lg:flex-row ps-4 end-0 ms-auto'>
                    <Transition show={!isPayloadValid} {...appearAnimationProps}>
                        <small className='font-medium leading-none text-right text-red-500'>Hay uno o más campos vacíos</small>
                    </Transition>
                    <Transition show={errorMessage != undefined} {...appearAnimationProps}>
                        <small className='font-medium leading-none text-right text-red-500'>{errorMessage}</small>
                    </Transition>
                    <div className='flex justify-end w-full ms-auto lg:w-80 gap-2 md:flex-col *:w-full lg:flex-row'>
                        <button
                            onClick={() => {
                                setActiveReportType(null);
                                setFieldValues({});
                                setButtonDisabled(true);
                                setCreateScreen(false);
                                setIsMenuOpen(true);
                            }}
                            className={cn(
                                "px-4 py-2 w-40 font-medium text-white transition rounded-md shadow outline-none ms-auto bg-gray-400 focus-visible:bg-gray-500 hover:bg-gray-500",
                            )}>
                            Cancelar
                        </button>
                        <button
                            disabled={buttonDisabled}
                            onClick={async (e) => {
                                e.preventDefault();
                                if (buttonDisabled) return;
                                e.currentTarget.disabled = true; // Disable button immediately to prevent multiple clicks
                                setButtonDisabled(true);
                                try {
                                    await sendReportRequest();
                                    setIsMenuOpen(true);
                                } finally {
                                    // Only re-enable if not generatingReport (in case it's still true)
                                    e.currentTarget.disabled = false;
                                    setButtonDisabled(!isPayloadValid || generatingReport);
                                    setIsMenuOpen(true);
                                }
                                setIsMenuOpen(true);
                            }}
                            className={cn(
                                "px-4 py-2 w-40 font-medium text-white transition rounded-md shadow outline-none bg-brand-blue focus-visible:bg-brand-light-blue focus-visible:text-brand-blue hover:bg-brand-light-blue hover:text-brand-blue disabled:pointer-events-none disabled:bg-blue-300 disabled:cursor-not-allowed",
                            )}>
                            Construir reporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
