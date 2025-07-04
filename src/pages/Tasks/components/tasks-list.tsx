import { Fragment, useEffect, useState } from "react";
import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { HiEllipsisVertical, HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { Menu, Switch, Transition } from "@headlessui/react";
import { useToaster, Whisper } from "rsuite";
import { Task, TaskData } from "@utils/types";
import { LoadSpinner } from "@components/LoadSpinner";
import cn from "classnames";
import api from "@api/index";
import messageToaster from "@utils/toaster";
import { UseQueryResult } from "@tanstack/react-query";
import { VscLoading } from "react-icons/vsc";
import { useModalAction } from "@contexts/modal-context";

const days_of_week = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const avatar_colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-blue-500",
    "bg-green-500",
];

export const TaskItem = ({
    // data,
    taskModalData,
    setData,
    task,
    tooltip,
    setTaskModalData,
    refetch,
}: {
    taskModalData: Task | undefined;
    setData: React.Dispatch<React.SetStateAction<TaskData | undefined>>;
    task: Task;
    tooltip: (message: string) => JSX.Element;
    setTaskModalData: React.Dispatch<React.SetStateAction<Task | undefined>>;
    refetch: () => void;
}) => {
    console.log(taskModalData);
    const [active, setActive] = useState<boolean>(task.is_active);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { openModal } = useModalAction();

    async function updateActiveState(checked: boolean) {
        setIsLoading(true);
        await api
            .put(`/tasks/schedule/${task.id}/update`, {
                days_of_week: task.days_of_week,
                frequency: task.frequency,
                frequency_value: task.frequency_value,
                start_date: task.start_date,
                task_id: task.task_id,
                tracker_id: task.tracker_id,
                is_active: checked,
            })
            .then(async (res) => {
                if (res.status === 200) {
                    setActive(await res.data.data.is_active);
                    refetch();
                    toaster.push(messageToaster(`Configuración actualizada correctamente`, "success"), {
                        duration: 1000 * 5,
                        placement: "topStart",
                    });
                } else {
                    setActive(task.is_active); // Revert the change if the API call fails
                }
            })
            .catch(() => {
                setActive(task.is_active); // Revert the change if the API call fails
                toaster.push(messageToaster(`Hubo un problema al actualizar la configuración`, "error"), {
                    duration: 1000 * 5,
                    placement: "topStart",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const toaster = useToaster();
    return (
        <>
            <div
                key={task.id}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    openModal();
                }}
                className='grid relative items-center max-sm:rounded-xl max-sm:p-4 active:bg-brand-blue/10 sm:grid-cols-[1.5fr_1fr_1.5fr_0.7fr_4rem_4rem] p-1.5 transition-all rounded-full hover:bg-brand-light-blue'>
                <div className='flex items-center gap-3'>
                    <div
                        className={cn(
                            "flex items-center justify-center size-10 min-w-10 min-h-10 overflow-hidden rounded-full",
                            avatar_colors[task.tracker.charCodeAt(0) % avatar_colors.length],
                        )}>
                        <h1 className='text-2xl font-medium leading-none text-white select-none '>{task.tracker[0]}</h1>
                    </div>
                    <div className='flex flex-col text-sm uppercase truncate pe-2'>
                        <Whisper speaker={tooltip(task.employee)} onMouseOver={() => tooltip} trigger='hover' placement='topStart'>
                            <span className='font-bold truncate'>{task.employee}</span>
                        </Whisper>
                        <Whisper speaker={tooltip(task.tracker)} onMouseOver={() => tooltip} trigger='hover' placement='topStart'>
                            <span className='truncate opacity-70'>{task.tracker}</span>
                        </Whisper>
                    </div>
                </div>
                <div className='truncate max-sm:grid grid-cols-[100px_auto]'>
                    <span className='font-medium sm:hidden'>Etiqueta: </span>
                    <Whisper speaker={tooltip(task.label ?? "-")} onMouseOver={() => tooltip} trigger='hover' placement='topStart'>
                        {task.label ?? "-"}
                    </Whisper>
                </div>
                <div className='truncate max-sm:mt-4 max-sm:grid grid-cols-[100px_auto]'>
                    <span className='font-medium sm:hidden'>Frecuencia: </span>
                    <Whisper
                        speaker={tooltip(
                            task.frequency === "every_x_weeks"
                                ? `Cada ${task.frequency_value} semana${task.frequency_value > 1 ? "s" : ""}`
                                : `Cada ${task.frequency_value} mes${task.frequency_value > 1 ? "es" : ""}`,
                        )}
                        onMouseOver={() => tooltip}
                        trigger='hover'
                        placement='topStart'>
                        {task.frequency === "every_x_weeks"
                            ? `Cada ${task.frequency_value} semana${task.frequency_value > 1 ? "s" : ""}`
                            : `Cada ${task.frequency_value} mes${task.frequency_value > 1 ? "es" : ""}`}
                    </Whisper>
                </div>
                <div className='truncate max-sm:grid grid-cols-[100px_auto]'>
                    <span className='font-medium sm:hidden'>Días: </span>
                    {task.days_of_week.map((day) => days_of_week[day - 1]).join(", ")}
                    {/* {task.checkpoints} {task.checkpoints == 1 ? "punto" : "puntos"} */}
                </div>
                <div className='flex items-center gap-2 max-sm:mt-4'>
                    <Switch
                        disabled={isLoading}
                        checked={task.is_active}
                        onChange={(checked: boolean) => {
                            setActive(checked);
                            updateActiveState(checked);
                        }}
                        className={cn(
                            "disabled:bg-gray-200 ring-offset-2 focus-visible:ring-2 ring-offset-transparent outline-none border-none transition relative inline-flex h-6 w-11 min-w-11 items-center rounded-full",
                            active
                                ? "bg-green-400 hover:bg-green-500 focus-visible:bg-green-500 ring-green-300"
                                : "bg-red-500 hover:bg-red-600 focus-visible:bg-red-600 focus-visible:ring ring-red-300",
                        )}>
                        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition", active ? "translate-x-6" : "translate-x-1")} />
                    </Switch>
                    <span className={cn("font-medium", active ? "text-green-400" : "text-red-400")}>
                        {!isLoading ? <>{active ? "Sí" : "No"}</> : <VscLoading className='animate-spin text-brand-blue' />}
                    </span>
                </div>
                <Menu as='div' className='relative w-12 h-12 outline-none max-sm:absolute group max-sm:end-2 max-sm:top-2 ms-auto'>
                    <Menu.Button className='z-0 w-12 h-12 text-sm font-medium transition-all rounded-full outline-none max-sm:rounded-xl group-hover:bg-black/5 active:bg-black/10 focus-visible:bg-black/5 '>
                        <HiEllipsisVertical className='m-auto' />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'>
                        <Menu.Items className='absolute z-50 flex flex-col w-40 gap-1 p-1 bg-white rounded-lg shadow-lg outline-none end-0'>
                            <Menu.Item>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTaskModalData(task);
                                        openModal("TASK_CONFIG", {
                                            taskModalData: task,
                                            setTaskModalData,
                                            refetch,
                                        });
                                    }}
                                    className='flex flex-row items-center gap-4 px-4 py-1 text-sm transition-all rounded-md cursor-pointer select-none focus-visible:text-brand-blue hover:text-brand-blue focus-visible:bg-brand-light-blue hover:bg-brand-light-blue'>
                                    <HiOutlinePencil />
                                    Editar
                                </span>
                            </Menu.Item>
                            <Menu.Item>
                                <a
                                    target='_blank'
                                    href={`https://app.progps.com.do/#/entity/view/schedule/-/custom/edit/${task.task_id}`}
                                    className='flex flex-row items-center gap-4 px-4 py-1 text-sm transition-all rounded-md cursor-pointer select-none focus-visible:text-brand-blue hover:text-brand-blue focus-visible:bg-brand-light-blue hover:bg-brand-light-blue'>
                                    <HiOutlineEye />
                                    Ver detalles
                                </a>
                            </Menu.Item>
                            <hr />
                            <Menu.Item>
                                <button
                                    onClick={() => {
                                        api.delete(`/tasks/config/${task.id}/delete`)
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    setData((prev) => {
                                                        if (!prev) return prev;
                                                        return {
                                                            ...prev,
                                                            list: prev.list.filter((t) => t.id !== task.id),
                                                        };
                                                    });
                                                    toaster.push(messageToaster(`Configuración eliminada correctamente`, "success"), {
                                                        duration: 1000 * 5,
                                                        placement: "topStart",
                                                    });
                                                    refetch();
                                                } else {
                                                    toaster.push(messageToaster(`Hubo un problema al eliminar la configuración`, "error"), {
                                                        duration: 1000 * 5,
                                                        placement: "topStart",
                                                    });
                                                }
                                            })
                                            .catch(() => {
                                                toaster.push(messageToaster(`Hubo un problema al eliminar la configuración`, "error"), {
                                                    duration: 1000 * 5,
                                                    placement: "topStart",
                                                });
                                            });
                                    }}
                                    className='flex flex-row items-center gap-4 px-4 py-1 text-sm transition-all rounded-md cursor-pointer select-none focus-visible:text-red-500 hover:text-red-500 focus-visible:bg-red-200 hover:bg-red-200'>
                                    <HiOutlineTrash />
                                    Eliminar
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </>
    );
};

export const TasksList = ({
    taskModalData,
    tooltip,
    selectedOption,
    setTaskModalData,
    taskData: { data, isLoading, error, refetch },
}: {
    taskModalData: Task | undefined;
    selectedOption: Option;
    tooltip: (message: string) => JSX.Element;
    setTaskModalData: React.Dispatch<React.SetStateAction<Task | undefined>>;
    taskData: UseQueryResult<TaskData, Error>;
}) => {
    const [filteredData, setFilteredData] = useState<TaskData>();

    useEffect(() => {
        if (data) {
            if (selectedOption.value === "all") {
                setFilteredData(data);
            } else if (selectedOption.value === "every_x_weeks" || selectedOption.value === "every_x_months") {
                const filtered = data?.list.filter((task) => task.frequency === selectedOption.value);
                setFilteredData({ list: filtered ?? [] });
            } else {
                setFilteredData(data);
            }
        }
    }, [selectedOption, data]);

    return (
        <>
            <div>
                <div className='max-sm:hidden grid grid-cols-[1.5fr_1fr_1.5fr_0.7fr_4rem_4rem] px-2 py-2 font-medium'>
                    <div>Empleado</div>
                    <div>Etiqueta</div>
                    <div>Frecuencia</div>
                    <div>Días</div>
                    <div>Activa</div>
                    <div></div>
                </div>
                <div className='max-h-[calc(100vh-300px)]'>
                    {isLoading && !data ? (
                        <div className='relative h-52'>
                            <LoadSpinner />
                        </div>
                    ) : error ? (
                        <div className='p-4 my-4 font-medium text-center text-red-500 bg-red-200 border border-red-500 rounded-lg'>
                            <i className='mgc_warning_fill me-2'></i>
                            Ha ocurrido un error al cargar los datos.
                        </div>
                    ) : data && data.list.length > 0 ? (
                        <>
                            {filteredData?.list.map((task) => (
                                <TaskItem
                                    taskModalData={taskModalData}
                                    setData={setFilteredData}
                                    key={task.id}
                                    task={task}
                                    tooltip={tooltip}
                                    setTaskModalData={setTaskModalData}
                                    refetch={refetch}
                                />
                            ))}
                        </>
                    ) : (
                        <div className='my-4 text-center'>No se han encontrado datos</div>
                    )}
                </div>
            </div>
        </>
    );
};
