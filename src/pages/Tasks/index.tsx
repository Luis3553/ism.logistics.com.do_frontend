import ListOfTrackers from "../Alert/components/select-trackers";
import { useEffect, useState } from "react";
import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { Whisper } from "rsuite";
import { useApiQuery } from "@hooks/useQuery";
import ListboxComponent from "@components/listbox";
import { TasksList } from "./components/tasks-list";
import { Task, TaskData } from "@utils/types";
import { LoadSpinner } from "@components/LoadSpinner";
import { HiPlus } from "react-icons/hi2";
import { tooltip } from "@utils/ui";
import { useModalAction } from "@contexts/modal-context";
// import { useUIContext } from "@contexts/ui-context";

const options = [
    { value: "all", label: "Todos", calendar: "week" },
    { value: "every_x_weeks", label: "Cada n semanas", calendar: "week" },
    { value: "every_x_months", label: "Cada n meses", calendar: "week" },
];

export const Tasks = () => {
    const [trackers, setTrackers] = useState<Option[]>();
    const [tasks, setTasks] = useState<Option[]>();
    const [trackersQuery, setTrackersQuery] = useState<Array<number | string>>(["all"]);

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
                setFilteredData(taskData.data);
            } else if (selectedOption.value === "every_x_weeks" || selectedOption.value === "every_x_months") {
                const filtered = taskData.data?.list.filter((task) => task.frequency === selectedOption.value);
                setFilteredData({ list: filtered ?? [] });
            } else {
                setFilteredData(taskData.data);
            }
        }
    }, [selectedOption, taskData.data]);

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
            <div className='flex justify-between mb-2'>
                <h1 className='text-lg font-medium text-brand-dark-gray'>Configuraciones de tareas recurrentes</h1>
            </div>
            <main className='p-4 bg-white rounded-lg shadow text-[#393939]'>
                {/* <TaskCreateModal
                    open={modalOpen}
                    trackers={trackers}
                    tasks={tasks}
                    taskModalData={taskModalData}
                    setTaskModalData={setTaskModalData}
                    refetch={taskData.refetch}
                /> */}

                <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
                    <div className='flex flex-col w-full gap-4 md:flex-row'>
                        <div className='flex flex-row lg:max-w-[400px] items-center w-full gap-3'>
                            <small className='text-sm font-medium opacity-80'>Objetos</small>
                            <ListOfTrackers data={[{ value: "all", label: "Todos" }, ...(trackers ?? [])]} isLoading={isLoadingTrackers} setTrackersQuery={setTrackersQuery} />
                        </div>
                        <div className='flex flex-row lg:max-w-[400px] items-center w-full gap-3'>
                            <small className='text-sm font-medium opacity-80'>Frecuencia</small>
                            <ListboxComponent shadow={true} options={options} selectedOption={selectedOption} onChange={(e) => setSelectedOption(e)} />
                        </div>
                    </div>
                    <Whisper speaker={tooltip("Nueva configuración de tarea")} onMouseOver={() => tooltip} trigger='hover' placement='autoHorizontalStart'>
                        <button
                            onClick={() => {
                                // openModal()
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
                        selectedOption={selectedOption}
                        setTaskModalData={setTaskModalData}
                        setFilteredData={setFilteredData}
                        filteredData={filteredData}
                    />
                )}
            </main>
        </>
    );
};
