import { Transition } from "@headlessui/react";
import { appearAnimationProps } from "@utils/animations";
import { ReportType } from "@utils/types";
import { HiDocument } from "react-icons/hi2";
import cn from "classnames";

export default function ReportCreateForm({
    generatingReport,
    activeReportType,
    fieldValues,
    setFieldValues,
    isPayloadValid,
    sendReportRequest,
    errorMessage,
}: {
    generatingReport: boolean;
    fieldValues: Record<string, any>;
    setFieldValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    activeReportType: ReportType | null;
    setActiveReportType: React.Dispatch<React.SetStateAction<ReportType | null>>;
    isPayloadValid: boolean;
    sendReportRequest(): Promise<void>;
    errorMessage: string | undefined;
}) {
    return (
        <div className='relative flex flex-col h-full overflow-hidden'>
            <div className='flex flex-row items-center px-4 font-bold text-gray-700 bg-gray-200 min-h-10 max-h-10 gap-x-4'>
                <HiDocument />
                <span>Parámetros</span>
            </div>
            <div className='flex flex-col items-start justify-between h-full p-4 lg:gap-4'>
                <fieldset className='grid w-full gap-4 lg:grid-cols-2 max-h-[calc(100%-6rem)] overflow-y-auto'>
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
                <div className='absolute bottom-0 flex flex-row items-center w-full gap-3 p-2 mt-0 bg-white ps-4 end-0 ms-auto'>
                    <Transition show={!isPayloadValid} {...appearAnimationProps}>
                        <small className='font-medium leading-none text-right text-red-500'>Hay uno o más campos vacíos</small>
                    </Transition>
                    <Transition show={errorMessage != undefined} {...appearAnimationProps}>
                        <small className='font-medium leading-none text-right text-red-500'>{errorMessage}</small>
                    </Transition>
                    <button
                        disabled={!isPayloadValid || generatingReport}
                        onClick={sendReportRequest}
                        className={cn(
                            "px-4 py-2 font-medium text-white transition rounded-md shadow outline-none ms-auto w-fit bg-brand-blue focus-visible:bg-brand-light-blue focus-visible:text-brand-blue hover:bg-brand-light-blue hover:text-brand-blue disabled:pointer-events-none disabled:bg-gray-300 disabled:cursor-not-allowed",
                        )}>
                        Generar
                    </button>
                </div>
            </div>
        </div>
    );
}
