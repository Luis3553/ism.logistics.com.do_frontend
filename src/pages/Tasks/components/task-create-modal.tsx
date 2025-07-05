import ListboxComponent from "@components/listbox";
import { Modal } from "@components/Modal";
import cn from "classnames";
import { useEffect, useState } from "react";
import { HiCheckCircle, HiOutlineCheckCircle, HiOutlineInformationCircle, HiXMark } from "react-icons/hi2";
import { CustomProvider, DatePicker, Whisper } from "rsuite";
import { esES } from "rsuite/esm/locales";
import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import api from "@api/index";
import { RadioGroup, Transition } from "@headlessui/react";
import { appearAnimationProps } from "@utils/animations";
import AsyncSelectComponent from "@components/async-select";
import messageToaster from "@utils/toaster";
import { Task, TaskData } from "@utils/types";
import { LoadSpinner } from "@components/LoadSpinner";
import { useUIContext } from "@contexts/ui-context";
import { useModalAction } from "@contexts/modal-context";
import { useApiQuery } from "@hooks/useQuery";
import { tooltip } from "@utils/ui";

const options = [
    { value: "every_x_weeks", label: "Semanal", calendar: "week" },
    { value: "every_x_months", label: "Mensual", calendar: "week" },
];

const weeks = [
    { value: 1, label: "1ra semana" },
    { value: 2, label: "2da semana" },
    { value: 3, label: "3ra semana" },
    { value: 4, label: "4ta semana" },
];

export default function TaskCreateModal({
    open,
    taskModalData,
    setTaskModalData,
    refetch,
    setFilteredData,
}: {
    open: boolean;
    taskModalData: Task | undefined;
    setTaskModalData: React.Dispatch<React.SetStateAction<Task | undefined>>;
    refetch: () => void;
    setFilteredData: React.Dispatch<React.SetStateAction<TaskData | undefined>>;
}) {
    const [trackers, setTrackers] = useState<Option[]>();
    const [tasks, setTasks] = useState<Option[]>();

    const { data: trackersData, isLoading: isLoadingTrackers, isRefetching: isRefetchingTrackers } = useApiQuery<Option[]>("/notifications/trackers", {});
    const { data: tasksData, isLoading: isLoadingTasks, isRefetching: isRefetchingTasks, refetch: refreshTasks } = useApiQuery<{ list: Option[] }>("/tasks/schedule/list", {});

    useEffect(() => {
        refreshTasks();
    }, [open]);

    useEffect(() => {
        if (trackersData) {
            const allTrackers = trackersData.map((tracker) => ({
                value: tracker.value,
                label: tracker.label,
            }));
            setTrackers(allTrackers);
        }
    }, [trackersData]);

    useEffect(() => {
        if (tasksData) {
            if (tasksData.list) {
                const allTasks = tasksData.list.map((task) => ({
                    value: task.value,
                    label: task.label,
                }));
                setTasks(allTasks);
            }
        }
    }, [tasksData]);

    const { toaster } = useUIContext();
    const { closeModal } = useModalAction();

    const [selectedTask, setSelectedTask] = useState<Option | null>(taskModalData ? { label: taskModalData.label, value: taskModalData.task_id } : null);
    const [selectedTracker, setSelectedTracker] = useState<Option | null>(taskModalData ? { label: taskModalData.tracker, value: taskModalData.tracker_id } : null);

    const [selectedOption, setSelectedOption] = useState<Option>(taskModalData ? options[options.findIndex((o) => o.value == taskModalData?.frequency)] : options[0]);
    const [selectedWeekDay, setSelectedWeekDay] = useState<Option>(taskModalData ? weeks[weeks.findIndex((o) => o.value == taskModalData?.weekday_ordinal)] : weeks[0]);

    const [frequencyValue, setFrequencyValue] = useState<number>(1);

    const [selectedDays, setSelectedDays] = useState<number[]>(
        [],
        // [new Date().getDay() === 0 ? 7 : new Date().getDay()]
    );
    const [startDate, setStartDate] = useState<Date | null>(null);
    // const allowedRangeDates = (date: Date) => {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);

    //     if (date < today) return true;

    //     return false;
    // };

    useEffect(() => {
        if (taskModalData) {
            setSelectedTracker({ label: taskModalData.tracker, value: taskModalData.tracker_id });
            setSelectedTask({ label: taskModalData.label, value: taskModalData.task_id });
            setStartDate(new Date(taskModalData.start_date));
            setSelectedOption(options.find((o) => o.value === taskModalData.frequency) || options[0]);
            setFrequencyValue(taskModalData.frequency_value);
            setSelectedDays(taskModalData.days_of_week);
        }
    }, [taskModalData]);

    const [payload, setPayload] = useState({
        id: taskModalData ? taskModalData.id : undefined,
        task_id: selectedTask ? selectedTask.value : null,
        tracker_id: selectedTracker ? selectedTracker.value : null,
        start_date: selectedOption.calendar != "month" ? startDate : startDate?.setDate(1),
        frequency: selectedOption.value,
        weekday_ordinal: selectedOption.value === "every_x_months" ? selectedWeekDay.value : null,
        frequency_value: frequencyValue,
        days_of_week: selectedDays,
    });

    const [errors, setErrors] = useState<{
        startDate?: string | undefined;
        selectedDays?: string | undefined;
        frequencyValue?: string | undefined;
        selectedTracker?: string | undefined;
        selectedTask?: string | undefined;
    }>({});

    function resetFields() {
        setSelectedOption(options[0]);
        setFrequencyValue(1);
        setSelectedDays([]);
        setStartDate(null);
        setSelectedTracker(null);
        setSelectedTask(null);
        setPayload({
            id: undefined,
            task_id: null,
            tracker_id: null,
            start_date: null,
            frequency: options[0].value,
            frequency_value: 1,
            weekday_ordinal: null,
            days_of_week: [],
        });
        setErrors({});
    }

    function validatePayload() {
        let valid = true;

        if (!selectedTask) {
            setErrors((prev) => ({ ...prev, selectedTask: "La tarea recurrente es obligatoria." }));
            valid = false;
        } else delete errors.selectedTask;

        if (!selectedTracker) {
            setErrors((prev) => ({ ...prev, selectedTracker: "El objeto es obligatorio." }));
            valid = false;
        } else delete errors.selectedTracker;

        if (!startDate) {
            setErrors((prev) => ({ ...prev, startDate: "La fecha de inicio es obligatoria." }));
            valid = false;
        } else delete errors.startDate;

        // if (startDate && startDate.getTime() < new Date().setHours(0, 0, 0, 0)) {
        //     setErrors((prev) => ({ ...prev, startDate: "La fecha de inicio no es válida." }));
        // } else delete errors.startDate;

        if (selectedDays.length === 0) {
            setErrors((prev) => ({ ...prev, selectedDays: "Debe seleccionar al menos un día de la semana." }));
            valid = false;
        } else delete errors.selectedDays;

        if (frequencyValue < 1) {
            setErrors((prev) => ({ ...prev, frequencyValue: "El valor de frecuencia debe ser al menos 1." }));
            valid = false;
        } else delete errors.frequencyValue;
        return valid;
    }

    useEffect(() => {
        setPayload({
            id: taskModalData ? taskModalData.id : undefined,
            task_id: selectedTask ? selectedTask.value : null,
            tracker_id: selectedTracker ? selectedTracker.value : null,
            start_date: startDate,
            frequency: selectedOption.value,
            frequency_value: frequencyValue,
            weekday_ordinal: selectedOption.value === "every_x_months" ? selectedWeekDay.value : null,
            days_of_week: selectedDays,
        });
    }, [startDate, selectedOption, frequencyValue, selectedDays, selectedTask, selectedTracker, selectedWeekDay]);

    function onSubmit() {
        if (validatePayload()) {
            if (taskModalData) {
                setIsLoading(true);
                api.put(`/tasks/schedule/${taskModalData.id}/update`, payload)
                    .then((res) => {
                        if (res.status !== 200) {
                            toaster.push(messageToaster(`Hubo un problema al actualizar la configuración`, "error"), {
                                duration: 1000 * 5,
                                placement: "topStart",
                            });
                        }
                        toaster.push(messageToaster(`Configuración actualizada correctamente`, "success"), {
                            duration: 1000 * 5,
                            placement: "topStart",
                        });
                        setFilteredData((prev) => {
                            if (!prev) {
                                return { list: [res.data.data as Task] };
                            }
                            const updatedList = prev.list.map((task) => (task.id === res.data.data.id ? (res.data.data as Task) : task));
                            return { ...prev, list: updatedList };
                        });
                    })
                    .catch(() => {
                        toaster.push(messageToaster(`Hubo un problema al actualizar la configuración`, "error"), {
                            duration: 1000 * 5,
                            placement: "topStart",
                        });
                    })
                    .finally(() => {
                        closeModal();
                        refreshTasks();
                        setTaskModalData(undefined);
                        resetFields();
                        refetch();
                        setIsLoading(false);
                    });
            } else {
                setIsLoading(true);
                api.post("/tasks/schedule/create", payload)
                    .then((res) => {
                        if (res.status !== 201) {
                            toaster.push(messageToaster(`Hubo un problema al crear la configuración`, "error"), {
                                duration: 1000 * 5,
                                placement: "topStart",
                            });
                        }

                        setFilteredData((prev) => {
                            if (!prev) {
                                return { list: [res.data.data as Task] };
                            }
                            return { ...prev, list: [...prev.list, res.data.data as Task] };
                        });
                        setTasks((prev) => prev?.filter((task) => task.value !== payload.task_id));

                        toaster.push(messageToaster(`Configuración creada correctamente`, "success"), {
                            duration: 1000 * 5,
                            placement: "topStart",
                        });
                    })
                    .catch(() => {
                        toaster.push(messageToaster(`Hubo un problema al crear la configuración`, "error"), {
                            duration: 1000 * 5,
                            placement: "topStart",
                        });
                    })
                    .finally(() => {
                        refreshTasks();
                        closeModal();
                        setTaskModalData(undefined);
                        resetFields();
                        refetch();
                        setIsLoading(false);
                    });
            }
        }
    }

    const loadOptions = (inputValue: string, callback: (options: Option[]) => void, arr: Option[] | undefined) => {
        const filtered = (arr || []).filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()));
        callback(filtered);
    };

    const [isLoading, setIsLoading] = useState(false);

    return (
        <Modal isOpen={open} onClose={closeModal} className=' md:max-w-[40rem] h-min relative overflow-hidden'>
            <Transition show={isLoading} {...appearAnimationProps}>
                <div className='absolute left-0 z-50 w-full h-[calc(100%-4rem)] top-16 backdrop-blur-sm bg-white/70'>
                    <LoadSpinner />
                </div>
            </Transition>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-lg font-semibold'>{taskModalData ? "Editar configuración" : "Nueva configuración"}</h1>
                <button
                    className='flex items-center justify-center p-1 transition rounded-full outline-none focus-visible:bg-black/10 hover:bg-black/10 active:bg-black/20'
                    onClick={closeModal}>
                    <HiXMark className='size-5' />
                </button>
            </div>
            <div className='p-2 overflow-y-auto'>
                <div className='flex flex-col gap-8 md:grid'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between mb-1'>
                                <span className='font-medium'>Tarea recurrente</span>
                                <Whisper
                                    speaker={tooltip("Sólo se muestran tareas sin empleado asignado y sin configuraciones creadas.")}
                                    onMouseOver={() => tooltip}
                                    trigger='hover'
                                    placement='topEnd'>
                                    <span>
                                        <HiOutlineInformationCircle className='text-brand-blue size-6' />
                                    </span>
                                </Whisper>
                            </div>
                            <AsyncSelectComponent
                                data={tasks || []}
                                isMulti={false}
                                defaultOptions={(tasks || []).slice(0, 10) ?? []}
                                isLoading={isLoadingTasks || isRefetchingTasks}
                                onChange={(e) => setSelectedTask(Array.isArray(e) ? e[0] ?? null : e ?? null)}
                                value={selectedTask ? [selectedTask] : []}
                                loadOptions={(inputValue: string, callback: (options: Option[]) => void) => loadOptions(inputValue, callback, tasks)}
                                placeholder='Seleccione una tarea'
                            />
                            <Transition show={errors.selectedTask ? true : false} {...appearAnimationProps}>
                                {errors.selectedTask && <small className='text-red-500'>{errors.selectedTask}</small>}
                            </Transition>
                        </div>
                        <div className='flex flex-col'>
                            <span className='mb-1 font-medium'>Objeto</span>
                            <AsyncSelectComponent
                                data={trackers || []}
                                isMulti={false}
                                defaultOptions={(trackers || []).slice(0, 10) ?? []}
                                isLoading={isLoadingTrackers || isRefetchingTrackers}
                                onChange={(e) => setSelectedTracker(Array.isArray(e) ? e[0] ?? null : e ?? null)}
                                value={selectedTracker ? [selectedTracker] : []}
                                loadOptions={(inputValue: string, callback: (options: Option[]) => void) => loadOptions(inputValue, callback, trackers)}
                                placeholder='Seleccione un objeto'
                            />
                            <Transition show={errors.selectedTracker ? true : false} {...appearAnimationProps}>
                                {errors.selectedTracker && <small className='text-red-500'>{errors.selectedTracker}</small>}
                            </Transition>
                        </div>
                    </div>
                    <hr className='border-brand-blue' />
                    <div className='flex flex-col gap-4 grow'>
                        <div className='flex flex-row items-center gap-x-2'>
                            {/* <label htmlFor='frequency_value' className='font-medium'>
                                Frecuencia:
                            </label> */}
                            <RadioGroup
                                className='flex flex-row items-center gap-x-2'
                                value={selectedOption.value}
                                onChange={(e) => setSelectedOption(options.find((o) => o.value === e) || options[0])}>
                                <RadioGroup.Label className='font-medium'>Frecuencia: </RadioGroup.Label>
                                {options.map((option, i) => (
                                    <RadioGroup.Option
                                        key={i}
                                        value={option.value}
                                        className='transition border rounded-lg outline-none cursor-pointer hover:bg-brand-light-blue/50 focus-visible:bg-brand-light-blue/50 focus:border-brand-blue'>
                                        {({ checked }) => (
                                            <>
                                                <span className='flex items-center gap-x-2 px-4 py-1.5 select-none outline-none ring-0'>
                                                    {checked ? (
                                                        <Transition show={checked} {...appearAnimationProps}>
                                                            <HiCheckCircle className='text-brand-blue' />
                                                        </Transition>
                                                    ) : (
                                                        <HiOutlineCheckCircle className='text-brand-blue' />
                                                    )}
                                                    {option.label}
                                                </span>
                                            </>
                                        )}
                                    </RadioGroup.Option>
                                ))}
                            </RadioGroup>
                            {/* <ListboxComponent shadow={false} classNames='h-full!' options={options} selectedOption={selectedOption} onChange={(e) => setSelectedOption(e)} /> */}
                        </div>
                        <div className='flex flex-row items-center gap-x-2'>
                            <label htmlFor='frequency_value' className='font-medium'>
                                Cada:
                            </label>
                            <div className='flex flex-row items-center grid-cols-2 gap-2'>
                                <input
                                    id='frequency_value'
                                    name='frequency_value'
                                    type='number'
                                    min={1}
                                    className='w-20 select-all px-4 py-1.5 transition border rounded-lg outline-none ring-0 focus:border-brand-blue'
                                    value={frequencyValue}
                                    onChange={(e) => setFrequencyValue(Number(e.target.value) >= 1 ? Number(e.target.value) : 1)}
                                />
                                <span className='w-24'>
                                    {selectedOption.value == "every_x_months" ? `Mes${frequencyValue > 1 ? "es" : ""}` : `Semana${frequencyValue > 1 ? "s" : ""}`}
                                </span>
                                <Transition show={selectedOption.value === "every_x_months"} {...appearAnimationProps}>
                                    <ListboxComponent
                                        shadow={false}
                                        classNames='h-full! w-52'
                                        options={weeks}
                                        selectedOption={selectedWeekDay}
                                        onChange={(e) => setSelectedWeekDay(e)}
                                    />
                                </Transition>
                            </div>
                            <Transition show={errors.frequencyValue ? true : false} {...appearAnimationProps}>
                                {errors.frequencyValue && <small className='text-red-500'>{errors.frequencyValue}</small>}
                            </Transition>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center w-full gap-x-2'>
                                <span className='font-medium'>Los días:</span>
                                <div className='grid grid-cols-[repeat(7,3rem)] gap-2 p-2 overflow-x-auto'>
                                    {[
                                        { label: "Lu", value: 1 },
                                        { label: "Ma", value: 2 },
                                        { label: "Mi", value: 3 },
                                        { label: "Ju", value: 4 },
                                        { label: "Vi", value: 5 },
                                        { label: "Sa", value: 6 },
                                        { label: "Do", value: 7 },
                                    ].map((day, i) => (
                                        <button
                                            onClick={() => {
                                                if (selectedDays.includes(day.value)) {
                                                    setSelectedDays((prev) => prev.filter((d) => d !== day.value));
                                                } else {
                                                    setSelectedDays((prev) => [...prev, day.value]);
                                                }
                                            }}
                                            className={cn(
                                                "flex items-center justify-center font-bold select-none rounded-full size-10 aspect-square transition-all outline-none",
                                                selectedDays.includes(day.value)
                                                    ? "text-white bg-brand-blue"
                                                    : "border border-brand-blue text-brand-blue hover:bg-brand-light-blue focus-visible:bg-brand-light-blue",
                                            )}
                                            key={i}>
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Transition show={errors.selectedDays ? true : false} {...appearAnimationProps}>
                                <small className='text-red-500'>{errors.selectedDays}</small>
                            </Transition>
                        </div>
                        <div className='flex flex-row items-center gap-x-2'>
                            <label htmlFor='start_date' className='font-medium'>
                                Fecha de inicio:
                            </label>
                            <CustomProvider locale={esES}>
                                <DatePicker
                                    name='start_date'
                                    id='start_date'
                                    onChange={(e) => setStartDate(e)}
                                    value={startDate}
                                    defaultValue={new Date()}
                                    cleanable={false}
                                    placement='autoVertical'
                                    format={selectedOption.calendar != "month" ? "dd/MM/yyyy" : "MM/yyyy"}
                                    // shouldDisableDate={allowedRangeDates}
                                />
                            </CustomProvider>
                            <Transition show={errors.startDate ? true : false} {...appearAnimationProps}>
                                {errors.startDate && <small className='text-red-500'>{errors.startDate}</small>}
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-row justify-end w-full gap-2 p-2 mt-4 bg-white'>
                <button
                    onClick={() => {
                        closeModal();
                        setTaskModalData(undefined);
                        resetFields();
                    }}
                    className='flex items-center justify-center gap-2 p-2 font-medium transition bg-white rounded-lg shadow outline-none w-28 text-brand-blue focus-visible:bg-brand-light-blue hover:bg-brand-light-blue'>
                    Cancelar
                </button>
                <button
                    onClick={onSubmit}
                    disabled={Object.keys(errors).length > 0}
                    className='flex items-center justify-center gap-2 p-2 font-medium text-white transition-all rounded-lg outline-none w-28 bg-brand-blue focus-visible:bg-brand-dark-blue hover:bg-brand-dark-blue disabled:bg-gray-300 disabled:cursor-not-allowed'>
                    Guardar
                </button>
            </div>
        </Modal>
    );
}
