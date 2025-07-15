import { Fragment, useEffect, useState } from "react";
import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { Whisper } from "rsuite";
import { useApiQuery } from "@hooks/useQuery";
import ListboxComponent from "@components/listbox";
import { TasksList } from "./components/tasks-list";
import { Task, TaskData } from "@utils/types";
import { HiCheckCircle, HiChevronUpDown, HiOutlineCheckCircle, HiOutlineInformationCircle, HiPlus } from "react-icons/hi2";
import { tooltip } from "@utils/ui";
import { useModalAction } from "@contexts/modal-context";
import cn from "classnames";
import { IoFilter } from "react-icons/io5";
import { Listbox, Transition } from "@headlessui/react";
import { appearAnimationProps } from "@utils/animations";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "@i18n/client";

const options = [
    { value: "all", label: "Todas", calendar: "week" },
    { value: "every_x_weeks", label: "Cada N semanas", calendar: "week" },
    { value: "every_x_months", label: "Cada N meses", calendar: "week" },
];

const statusOptions = [
    { label: "Todas", value: "all" },
    { label: "Activa", value: true },
    { label: "Inactiva", value: false },
];

const weekDays: Option[] = [
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miércoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Sábado", value: 6 },
    { label: "Domingo", value: 7 },
];

export const Tasks = () => {
    const { t: tc } = useTranslation('common');
    const { t: tp } = useTranslation('tasks_page');

    const [tasks, setTasks] = useState<Option[]>();

    const [openWeekDaysFilter, setOpenWeekDaysFilter] = useState<boolean>(false);

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [showFilters, setShowFilters] = useState<boolean>(true);

    const [taskModalData, setTaskModalData] = useState<Task | undefined>();

    const { data: tasksData } = useApiQuery<{ list: Option[] }>("/tasks/schedule/list", {});

    const [selectedOption, setSelectedOption] = useState<Option>(options[0]);
    const [selectedStatusOption, setSelectedStatusOption] = useState<Option>(statusOptions[0]);
    const [selectedWeekDays, setSelectedWeekDays] = useState<Option[]>([]);

    const taskData = useApiQuery<TaskData>("/tasks/config/list", {
        retry: 3,
        interval: 1000 * 60 * 5,
    });

    const [filteredData, setFilteredData] = useState<TaskData>();

    useEffect(() => {
        if (taskData.data) {
            if (selectedOption.value === "all" && selectedStatusOption.value === "all" && selectedWeekDays.length == 0) {
                const filtered = taskData.data?.list.filter(
                    (task) =>
                        task.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        task.tracker.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        task.employee.toLowerCase().includes(searchFilter.toLowerCase()),
                );
                setFilteredData({ list: filtered ?? [] });
            } else if (selectedOption.value !== "all" && selectedStatusOption.value !== "all") {
                const filtered = taskData.data?.list.filter(
                    (task) =>
                        task.frequency === selectedOption.value &&
                        task.is_active === selectedStatusOption.value &&
                        (selectedWeekDays.length === 0 || selectedWeekDays.some((day) => task.days_of_week.includes(Number(day.value)))) &&
                        (task.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            task.tracker.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            task.employee.toLowerCase().includes(searchFilter.toLowerCase())),
                );
                setFilteredData({ list: filtered ?? [] });
            } else if (selectedOption.value !== "all") {
                const filtered = taskData.data?.list.filter(
                    (task) =>
                        task.frequency === selectedOption.value &&
                        (selectedWeekDays.length === 0 || selectedWeekDays.some((day) => task.days_of_week.includes(Number(day.value)))) &&
                        (task.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            task.tracker.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            task.employee.toLowerCase().includes(searchFilter.toLowerCase())),
                );
                setFilteredData({ list: filtered ?? [] });
            } else {
                const filtered = taskData.data?.list.filter(
                    (task) =>
                        (selectedStatusOption.value === "all" || task.is_active === selectedStatusOption.value) &&
                        (selectedWeekDays.length === 0 || selectedWeekDays.some((day) => task.days_of_week.includes(Number(day.value)))) &&
                        (task.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            task.tracker.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            task.employee.toLowerCase().includes(searchFilter.toLowerCase())),
                );
                setFilteredData({ list: filtered ?? [] });
            }
        }
    }, [selectedOption, selectedStatusOption, searchFilter, selectedWeekDays, taskData.data]);

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

    const { openModal } = useModalAction();

    return (
        <>
            <div className='flex justify-between'>
                <Whisper
                    speaker={tooltip(`En este menú podrá gestionar las tareas recurrentes creadas desde "Servicio de campo → Tareas recurrentes", siempre que no tengan un empleado asignado ni
                configuraciones previas. Además, el valor del campo "Repetir" será omitido en esta vista.`)}
                    onMouseOver={() => tooltip}
                    trigger='hover'
                    placement='auto'>
                    <h1 className='flex items-center gap-2 text-lg font-medium text-brand-dark-gray'>
                        Gestión de tareas recurrentes
                        <span>
                            <HiOutlineInformationCircle className='text-brand-blue size-6' />
                        </span>
                    </h1>
                </Whisper>
            </div>
            {/* <small className='text-gray-400'>
                En este menú podrá gestionar las tareas recurrentes creadas desde "Servicio de campo → Tareas recurrentes", siempre que no tengan un empleado asignado ni
                configuraciones previas. Además, el valor del campo "Repetir" será omitido en esta vista.
            </small> */}
            <main className='mt-2 p-4 bg-white rounded-lg shadow text-[#393939]'>
                <div className='flex flex-col items-start justify-between gap-4 md:flex-row'>
                    <Transition as={Fragment} show={showFilters} {...appearAnimationProps}>
                        <div className='flex flex-col flex-wrap w-full gap-4 md:flex-row'>
                            <div className='flex flex-col lg:max-w-[210px] md:w-52 max-sm:w-full gap-1'>
                                <label htmlFor='searchFilter' className='text-sm font-medium opacity-80'>
                                    {tc("search")}
                                </label>
                                <input
                                    type='text'
                                    id='searchFilter'
                                    name='searchFilter'
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    placeholder={tc("search") + "..."}
                                    className='px-4 py-2 transition-all bg-white border rounded-lg shadow outline-none caret-brand-blue focus-visible:border-brand-blue'
                                />
                            </div>
                            {/* <div className='flex flex-col justify-between lg:max-w-[210px] md:w-52 max-sm:w-full gap-1'>
                                <small className='text-sm font-medium opacity-80'>Objetos</small>
                                <ListOfTrackers data={[...(trackers ?? [])]} isLoading={isLoadingTrackers} setTrackersQuery={setTrackersQuery} />
                            </div> */}
                            {/* <div className='flex flex-col lg:max-w-[210px] md:w-52 max-sm:w-full gap-1'>
                                <label htmlFor='searchFilter' className='text-sm font-medium opacity-80'>
                                    Tarea
                                </label>
                                <input
                                    type='text'
                                    id='searchFilter'
                                    name='searchFilter'
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    placeholder='Buscar...'
                                    className='px-4 py-2 transition-all bg-white border rounded-lg shadow outline-none caret-brand-blue focus-visible:border-brand-blue'
                                />
                            </div> */}
                            <div className='flex flex-col lg:max-w-[170px] md:w-52 max-sm:w-full gap-1'>
                                <small className='text-sm font-medium opacity-80'>{tp("frequency")}</small>
                                <ListboxComponent
                                    classNames='!py-[0.65rem]'
                                    shadow={true}
                                    options={options}
                                    selectedOption={selectedOption}
                                    onChange={(e) => setSelectedOption(e)}
                                />
                            </div>
                            <div className='flex flex-col lg:max-w-[170px] md:w-32 max-sm:w-full gap-1'>
                                <small className='text-sm font-medium opacity-80'>Estado</small>
                                <ListboxComponent
                                    classNames='!py-[0.65rem]'
                                    shadow={true}
                                    options={statusOptions}
                                    selectedOption={selectedStatusOption}
                                    onChange={(e) => setSelectedStatusOption(e)}
                                />
                            </div>
                            <div className='flex flex-col lg:max-w-[170px] md:w-40 max-sm:w-full gap-1'>
                                <small className='text-sm font-medium opacity-80'>Días</small>
                                <Listbox as='div' value={selectedWeekDays}>
                                    <div className='relative h-full'>
                                        <Whisper
                                            speaker={tooltip("Seleccionados: " + (selectedWeekDays.length > 0 ? selectedWeekDays.map((day) => day.label).join(", ") : "Ninguno"))}
                                            onMouseOver={() => tooltip}
                                            trigger='hover'
                                            placement='auto'>
                                            <Listbox.Button
                                                onClick={() => setOpenWeekDaysFilter((prev) => !prev)}
                                                className={cn(
                                                    "relative w-full aria-expanded:border-brand-blue py-[0.65rem] pl-3 pr-10 text-left bg-white border rounded-lg cursor-pointer md:min-w-28 focus:outline-none focus-visible:border-brand-blue sm:text-sm",
                                                    "shadow",
                                                )}>
                                                <span className='block truncate'>
                                                    {selectedWeekDays.length === 0 ? "Seleccionar días" : selectedWeekDays.map((d) => d.label).join(", ")}
                                                </span>
                                                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                    <HiChevronUpDown className='w-5 h-5 text-gray-400' aria-hidden='true' />
                                                </span>
                                            </Listbox.Button>
                                        </Whisper>
                                        <Transition show={openWeekDaysFilter} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                                            <div className='fixed inset-0 z-40' onClick={() => setOpenWeekDaysFilter(false)} aria-hidden='true' />
                                            <Listbox.Options
                                                static
                                                className='absolute z-50 flex flex-col w-full gap-1 p-1 mt-2 bg-white border rounded-lg shadow-lg'
                                                onClick={(e) => e.stopPropagation()} // Prevent closing on option click
                                            >
                                                <div className='flex items-center justify-between'>
                                                    <button
                                                        className='w-1/2 p-1 transition-all rounded-md hover:bg-blue-200 hover:text-blue-500'
                                                        onClick={() => setSelectedWeekDays(weekDays)}>
                                                        Todos
                                                    </button>
                                                    |
                                                    <button
                                                        className='w-1/2 p-1 transition-all rounded-md hover:bg-red-200 hover:text-red-500'
                                                        onClick={() => setSelectedWeekDays([])}>
                                                        Ninguno
                                                    </button>
                                                </div>
                                                {weekDays.map((day) => (
                                                    <button
                                                        type='button'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedWeekDays((prev) => {
                                                                const isSelected = prev.some((d) => d.value === day.value);
                                                                if (isSelected) {
                                                                    return prev.filter((d) => d.value !== day.value).sort((a, b) => Number(a.value) - Number(b.value));
                                                                } else {
                                                                    return [...prev, day].sort((a, b) => Number(a.value) - Number(b.value));
                                                                }
                                                            });
                                                        }}
                                                        className={cn(
                                                            "flex outline-none focus-visible:bg-brand-light-blue focus-visible:text-brand-blue items-center gap-2 hover:text-brand-blue hover:bg-brand-light-blue w-full px-4 py-1.5 rounded-md transition",
                                                            selectedWeekDays.some((d) => d.value === day.value) && "text-brand-blue bg-brand-light-blue",
                                                        )}
                                                        key={Number(day.value)}>
                                                        {selectedWeekDays.some((d) => d.value === day.value) ? (
                                                            <HiCheckCircle className='size-4' />
                                                        ) : (
                                                            <HiOutlineCheckCircle className='size-4' />
                                                        )}
                                                        <span>{day.label}</span>
                                                    </button>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div>
                    </Transition>
                    <div className={cn("max-md:w-full transition-all flex gap-2 ms-auto", showFilters && "md:mt-7")}>
                        <Whisper speaker={tooltip(!showFilters ? "Mostrar filtros" : "Ocultar filtros")} onMouseOver={() => tooltip} trigger='hover' placement='auto'>
                            <button
                                onClick={() => setShowFilters((prev) => !prev)}
                                className='flex justify-center visible w-full gap-2 p-2 font-medium transition rounded-lg outline-none ms-auto lg:hidden lg:invisible focus-visible:bg-slate-200 md:w-fit bg-slate-100 text-slate-400 hover:bg-slate-200'>
                                <IoFilter className='size-7' />
                            </button>
                        </Whisper>
                        <Whisper speaker={tooltip("Gestionar nueva tarea")} onMouseOver={() => tooltip} trigger='hover' placement='auto'>
                            <button
                                onClick={() => {
                                    openModal("TASK_CONFIG", { tasks, taskModalData: undefined, setTaskModalData, refetch: taskData.refetch, setFilteredData });
                                }}
                                className='flex justify-center w-full gap-2 p-2 font-medium transition rounded-lg outline-none focus-visible:bg-brand-blue focus-visible:text-white md:w-fit bg-brand-light-blue text-brand-blue hover:bg-brand-blue hover:text-white'>
                                <HiPlus className='size-7' />
                            </button>
                        </Whisper>
                    </div>
                </div>
                <hr className='mt-2' />
                <ErrorBoundary
                    fallback={<div className='p-4 my-4 font-medium text-center text-red-500 bg-red-200 border border-red-500 rounded-lg'>Error al cargar las tareas.</div>}>
                    <TasksList
                        taskModalData={taskModalData}
                        taskData={taskData}
                        tooltip={tooltip}
                        setTaskModalData={setTaskModalData}
                        setFilteredData={setFilteredData}
                        filteredData={filteredData}
                    />
                </ErrorBoundary>
            </main>
        </>
    );
};
