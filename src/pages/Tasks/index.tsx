import ListOfTrackers from "../Alert/components/select-trackers";
import { useEffect, useState } from "react";
import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { Whisper } from "rsuite";
import { useApiQuery } from "@hooks/useQuery";
import ListboxComponent from "@components/listbox";
import { TasksList } from "./components/tasks-list";
import { Task, TaskData } from "@utils/types";
import { LoadSpinner } from "@components/LoadSpinner";
import { HiOutlineInformationCircle, HiPlus } from "react-icons/hi2";
import { tooltip } from "@utils/ui";
import { useModalAction } from "@contexts/modal-context";

const options = [
    { value: "all", label: "Todas", calendar: "week" },
    { value: "every_x_weeks", label: "Cada N semanas", calendar: "week" },
    { value: "every_x_months", label: "Cada N meses", calendar: "week" },
];

export const Tasks = () => {
    const [trackers, setTrackers] = useState<Option[]>();
    const [tasks, setTasks] = useState<Option[]>();
    const [trackersQuery, setTrackersQuery] = useState<Array<number | string>>(["all"]);
    const [taskFilter, setTaskFilter] = useState<string>("");

    const [taskModalData, setTaskModalData] = useState<Task | undefined>();

    const { data: trackersData, isLoading: isLoadingTrackers, error: trackersError } = useApiQuery<Option[]>("/notifications/trackers", {});
    const { data: tasksData } = useApiQuery<{ list: Option[] }>("/tasks/schedule/list", {});

    const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

    const taskData = useApiQuery<TaskData>("/tasks/config/list", {
        params: {
            trackers: trackersQuery.includes("all")
                ? `[${trackers ? trackers.map((tracker) => tracker.value).join(",") : ""}]`
                : `[${trackersQuery ? trackersQuery.join(",") : ""}]`,
        },
        disable: trackersQuery.length === 0 || !trackersData,
        retry: 3,
        interval: 1000 * 60 * 5,
    });

    const [filteredData, setFilteredData] = useState<TaskData>();

    useEffect(() => {
        if (taskData.data) {
            if (selectedOption.value === "all") {
                const filtered = taskData.data?.list.filter((task) => task.label.toLowerCase().includes(taskFilter.toLowerCase()));
                setFilteredData({ list: filtered ?? [] });
            } else {
                const filtered = taskData.data?.list.filter((task) => task.frequency === selectedOption.value && task.label.toLowerCase().includes(taskFilter.toLowerCase()));
                setFilteredData({ list: filtered ?? [] });
            }
        }
    }, [selectedOption, taskFilter, taskData.data]);

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
                <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
                    <div className='flex flex-col w-full gap-4 md:flex-row'>
                        <div className='flex flex-col lg:max-w-[400px] w-full gap-2'>
                            <small className='text-sm font-medium opacity-80'>Objetos</small>
                            <ListOfTrackers data={[...(trackers ?? [])]} isLoading={isLoadingTrackers} setTrackersQuery={setTrackersQuery} />
                        </div>
                        <div className='flex flex-col lg:max-w-[400px] w-full gap-2'>
                            <small className='text-sm font-medium opacity-80'>Frecuencia</small>
                            <ListboxComponent shadow={true} options={options} selectedOption={selectedOption} onChange={(e) => setSelectedOption(e)} />
                        </div>
                        <div className='flex flex-col lg:max-w-[400px] w-full gap-2'>
                            <label htmlFor='taskFilter' className='text-sm font-medium opacity-80'>
                                Tarea
                            </label>
                            <input
                                type='text'
                                id='taskFilter'
                                name='taskFilter'
                                value={taskFilter}
                                onChange={(e) => setTaskFilter(e.target.value)}
                                placeholder='Buscar...'
                                className='py-1.5 px-4 transition-all bg-white border rounded-lg shadow outline-none caret-brand-blue focus-visible:border-brand-blue'
                            />
                        </div>
                    </div>
                    <Whisper speaker={tooltip("Gestionar nueva tarea")} onMouseOver={() => tooltip} trigger='hover' placement='auto'>
                        <button
                            onClick={() => {
                                openModal("TASK_CONFIG", { trackers, tasks, taskModalData, setTaskModalData, refetch: taskData.refetch, setFilteredData });
                            }}
                            className='flex justify-center w-full gap-2 p-2 font-medium transition rounded-lg outline-none focus-visible:bg-brand-blue focus-visible:text-white md:w-fit bg-brand-light-blue text-brand-blue hover:bg-brand-blue hover:text-white'>
                            <HiPlus className='size-6' />
                        </button>
                    </Whisper>
                </div>
                <hr className='my-4' />
                {isLoadingTrackers && (
                    <div className='relative h-52'>
                        <LoadSpinner />
                    </div>
                )}
                {trackersError && (
                    <div className='p-4 my-4 font-medium text-center text-red-500 bg-red-200 border border-red-500 rounded-lg'>
                        <i className='mgc_warning_fill me-2'></i>
                        Ha ocurrido un error al cargar los datos.
                    </div>
                )}
                {trackers && (
                    <TasksList
                        taskModalData={taskModalData}
                        taskData={taskData}
                        tooltip={tooltip}
                        setTaskModalData={setTaskModalData}
                        setFilteredData={setFilteredData}
                        filteredData={filteredData}
                    />
                )}
            </main>
        </>
    );
};
