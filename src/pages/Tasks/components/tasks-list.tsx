import { Fragment, useEffect, useRef, useState } from "react";
import { HiChevronDown, HiEllipsisVertical, HiOutlineMapPin, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { Popover, Portal, Switch, Transition } from "@headlessui/react";
import { useToaster, Whisper } from "rsuite";
import { Task, TaskData } from "@utils/types";
import { LoadSpinner } from "@components/LoadSpinner";
import cn from "classnames";
import api from "@api/index";
import messageToaster from "@utils/toaster";
import { UseQueryResult } from "@tanstack/react-query";
import { VscLoading } from "react-icons/vsc";
import { useModalAction } from "@contexts/modal-context";
import { format } from "date-fns";
import usePopoverPosition from "@utils/use-popover-position";
import { appearAnimationProps } from "@utils/animations";

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
    setFilteredData,
    setData,
    task,
    tooltip,
    setTaskModalData,
    refetch,
}: {
    setFilteredData: React.Dispatch<React.SetStateAction<TaskData | undefined>>;
    taskModalData: Task | undefined;
    setData: React.Dispatch<React.SetStateAction<TaskData | undefined>>;
    task: Task;
    tooltip: (message: string) => JSX.Element;
    setTaskModalData: React.Dispatch<React.SetStateAction<Task | undefined>>;
    refetch: () => void;
}) => {
    const [active, setActive] = useState<boolean>(task.is_active);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [checkpointsOpen, setCheckpointsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toaster = useToaster();
    const { openModal } = useModalAction();

    useEffect(() => {
        setActive(task.is_active);
    }, [task]);

    async function updateActiveState(checked: boolean) {
        setIsLoading(true);
        await api
            .put(`/tasks/schedule/${task.id}/update`, {
                days_of_week: task.days_of_week,
                frequency: task.frequency,
                frequency_value: task.frequency_value,
                start_date: task.start_date,
                task_id: task.task_id,
                weekday_ordinal: task.weekday_ordinal,
                tracker_id: task.tracker_id,
                is_active: checked,
            })
            .then(async (res) => {
                if (res.status === 200) {
                    setActive(await res.data.data.is_active);
                    refetch();
                    toaster.push(messageToaster(`Configuración actualizada correctamente`, "success"), {
                        duration: 2000 * 5,
                        placement: "topStart",
                    });
                } else {
                    setActive(task.is_active); // Revert the change if the API call fails
                }
            })
            .catch(() => {
                setActive(task.is_active); // Revert the change if the API call fails
                toaster.push(messageToaster(`Hubo un problema al actualizar la configuración`, "error"), {
                    duration: 2000 * 5,
                    placement: "topStart",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function getNextScheduledDate({ frequency_value, days_of_week, start_date }: { frequency_value: number; days_of_week: number[]; start_date: string }): Date {
        const today = new Date();
        const start = new Date(start_date);
        // If today is before start_date, use start_date as the base
        const base = today < start ? start : today;
        // Get the week difference from start_date to base
        const msInWeek = 7 * 24 * 60 * 60 * 1000;
        const weeksSinceStart = Math.floor((base.getTime() - start.getTime()) / msInWeek);
        const nextCycleStart = new Date(start.getTime() + weeksSinceStart * frequency_value * msInWeek);

        // Find the next day in days_of_week after (or equal to) today
        for (let i = 0; i < 14; i++) {
            // check up to 2 weeks ahead
            const candidate = new Date(nextCycleStart);
            candidate.setDate(candidate.getDate() + i);
            const weekday = candidate.getDay();
            if (days_of_week.includes(weekday) && candidate >= base) {
                return candidate;
            }
        }
        throw new Error("No scheduled day found");
    }

    const nextScheduledDate = getNextScheduledDate({
        frequency_value: task.frequency_value,
        days_of_week: task.days_of_week,
        start_date: task.start_date,
    });

    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const checkpointsButtonRef = useRef<HTMLButtonElement>(null);
    const { top: menuTop, left: menuLeft } = usePopoverPosition(menuOpen, menuButtonRef, 70);
    const { top: checkpointsTop, left: checkpointsLeft } = usePopoverPosition(
        checkpointsOpen,
        checkpointsButtonRef,
        task.checkpoints.length < 6 ? task.checkpoints.length * 55 : 200,
    );

    return (
        <>
            <div
                key={task.id}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    openModal("TASK_CONFIG", {
                        taskModalData: task,
                        setTaskModalData,
                        refetch,
                        setFilteredData,
                    });
                }}
                className='group grid relative items-center max-md:rounded-xl max-md:p-4 active:bg-brand-blue/10 md:grid-cols-[10rem_1fr_1fr_1fr_12rem_5rem_4rem] xl:grid-cols-[1fr_1fr_1fr_1fr_12rem_5rem_4rem] p-1.5 transition-all rounded-full group-hover:bg-brand-light-blue hover:bg-brand-light-blue'>
                <div className='flex items-center gap-3 truncate'>
                    <div
                        className={cn(
                            "flex items-center justify-center size-10 min-w-10 min-h-10 overflow-hidden rounded-full",
                            avatar_colors[task.tracker.charCodeAt(0) % avatar_colors.length],
                        )}>
                        {task.employee_image_url ? (
                            <img className='h-full' src={task.employee_image_url} />
                        ) : (
                            <h1 className='text-2xl font-medium leading-none text-white select-none '>{task.tracker[0]}</h1>
                        )}
                    </div>
                    <div className='flex flex-col text-sm uppercase truncate pe-2'>
                        <Whisper speaker={tooltip(task.employee)} onMouseOver={() => tooltip} trigger='hover' placement='topStart'>
                            <span className='font-bold truncate pe-0.5'>{task.employee ?? "N/A"}</span>
                        </Whisper>
                        <Whisper speaker={tooltip(task.tracker)} onMouseOver={() => tooltip} trigger='hover' placement='topStart'>
                            <span className='truncate opacity-70 pe-0.5'>{task.tracker}</span>
                        </Whisper>
                    </div>
                </div>
                <div className='truncate pe-1 max-md:mt-4 max-md:grid grid-cols-[100px_auto]'>
                    <span className='font-medium md:hidden'>Etiqueta: </span>
                    <div className='flex flex-col text-sm uppercase truncate pe-2'>
                        <div className='flex flex-row items-center justify-start gap-2'>
                            {task.checkpoints.length > 1 && (
                                <Popover as='div' className='relative outline-none group'>
                                    {({ open }) => {
                                        setCheckpointsOpen(open);
                                        return (
                                            <>
                                                <Popover.Button
                                                    title={open ? "Ocultar puntos de la ruta" : "Mostrar puntos de la ruta"}
                                                    ref={checkpointsButtonRef}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className='flex items-center p-1 transition rounded-full outline-none hover:bg-black/10 aspect-square'>
                                                    <HiChevronDown className={cn("size-4 transition-all rotate-0", open && "rotate-180")} />
                                                </Popover.Button>
                                                <Portal>
                                                    <div
                                                        className='absolute bg-white border rounded shadow-lg group-hover:'
                                                        style={{
                                                            position: "absolute",
                                                            top: `${checkpointsTop + 10}px`,
                                                            left: `${checkpointsLeft}px`,
                                                        }}>
                                                        <Transition show={open} as={Fragment} {...appearAnimationProps}>
                                                            <Popover.Panel className='absolute z-50 flex flex-col gap-1 p-1 bg-white rounded-lg shadow-lg outline-none min-w-40 max-w-80 w-max'>
                                                                <h1 className='text-sm font-medium text-center'>{task.label}</h1>
                                                                <hr />
                                                                <div className='max-h-[200px] overflow-y-auto'>
                                                                    {task.checkpoints.map((checkpoint, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className='flex items-center gap-2 px-4 py-1 text-gray-600 transition-all rounded-md select-none text-md focus-visible:bg-gray-200 hover:bg-gray-200'>
                                                                            <div className='p-1 text-sm font-bold leading-none text-center border rounded-full me-1 border-brand-blue/50 text-brand-blue/50 size-6'>
                                                                                {index + 1}
                                                                            </div>
                                                                            {checkpoint}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </Popover.Panel>
                                                        </Transition>
                                                    </div>
                                                </Portal>
                                            </>
                                        );
                                    }}
                                </Popover>
                            )}
                            <div className='flex flex-col'>
                                <Whisper speaker={tooltip(task.label ?? "-")} onMouseOver={() => tooltip} trigger='hover' placement='topStart'>
                                    <span className='truncate'>{task.label ?? "-"}</span>
                                </Whisper>
                                <span className='truncate opacity-70 pe-0.5 capitalize'>
                                    {task.checkpoints.length} {`punto${task.checkpoints.length > 1 ? "s" : ""}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='truncate max-md:grid grid-cols-[100px_auto]'>
                    <span className='font-medium md:hidden'>Frecuencia: </span>
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
                        <br />
                        <strong>{task.ocurrence_count ?? "-"}</strong>/{task.ocurrence_limit ?? "∞"} ocurrencia{task.ocurrence_limit !== 1 ? "s" : ""}
                    </Whisper>
                </div>
                <div className='truncate items-center max-md:grid grid-cols-[100px_auto]'>
                    <span className='font-medium md:hidden'>Días: </span>
                    {task.frequency === "every_x_weeks" ? (
                        <>{task.days_of_week.length === 7 ? "Diaria" : task.days_of_week.map((day) => days_of_week[day - 1]).join(", ")}</>
                    ) : (
                        <>
                            {task.days_of_week.length === 7
                                ? "Todos los días"
                                : task.days_of_week
                                      .map((day) => days_of_week[day - 1])
                                      .sort((a, b) => Number(a) - Number(b))
                                      .join(", ")}
                            <br />
                            {`${task.weekday_ordinal ?? "-"}${["ra", "da", "ra", "ta"][task.weekday_ordinal - 1] ?? ""} semana`}
                        </>
                    )}
                </div>
                <div className='flex flex-col'>
                    <div className='truncate max-md:grid grid-cols-[100px_auto]'>
                        <span className='font-medium md:hdden'>Inició: </span>
                        {format(new Date(task.start_date + "T04:00:00.000Z"), "dd/MM/yyyy")}
                    </div>
                    <div className='truncate max-md:grid grid-cols-[100px_auto]'>
                        <span className='font-medium md:hdden'>Próxima: </span>
                        {format(nextScheduledDate, "dd/MM/yyyy")}
                    </div>
                </div>
                <div className='truncate items-center max-md:mt-2 max-md:grid grid-cols-[100px_auto]'>
                    <span className='font-medium md:hidden'>Activa: </span>
                    <div className='flex items-center gap-2'>
                        <Switch
                            disabled={isLoading}
                            checked={active}
                            onChange={(checked: boolean) => {
                                if (checked) {
                                    setTaskModalData(task);
                                    openModal("TASK_CONFIG", {
                                        taskModalData: task,
                                        setTaskModalData,
                                        refetch,
                                        setFilteredData,
                                        reactivate: true,
                                    });
                                } else {
                                    setActive(checked);
                                    updateActiveState(checked);
                                }
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
                </div>
                <Popover as='div' className='relative w-12 h-12 outline-none max-md:absolute group max-md:end-2 max-md:top-2 ms-auto'>
                    {({ open }) => {
                        setMenuOpen(open);
                        return (
                            <>
                                <Popover.Button
                                    ref={menuButtonRef}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className='z-0 w-12 h-12 text-sm font-medium transition-all rounded-full outline-none max-md:rounded-xl active:bg-black/10 focus-visible:bg-black/5 '>
                                    <HiEllipsisVertical className='m-auto' />
                                </Popover.Button>
                                <Portal>
                                    <div
                                        className='absolute bg-white rounded shadow-lg group-hover:'
                                        style={{
                                            position: "absolute",
                                            top: `${menuTop + 10}px`,
                                            left: `${menuLeft + 60}px`,
                                        }}>
                                        <Transition
                                            as={Fragment}
                                            enter='transition ease-out duration-100'
                                            enterFrom='transform opacity-0 scale-95'
                                            enterTo='transform opacity-100 scale-100'
                                            leave='transition ease-in duration-75'
                                            leaveFrom='transform opacity-100 scale-100'
                                            leaveTo='transform opacity-0 scale-95'>
                                            <Popover.Panel className='absolute z-50 flex flex-col w-40 gap-1 p-1 bg-white border rounded-lg shadow-lg outline-none end-0'>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTaskModalData(task);
                                                        openModal("TASK_CONFIG", {
                                                            taskModalData: task,
                                                            setTaskModalData,
                                                            refetch,
                                                            setFilteredData,
                                                        });
                                                    }}
                                                    className='flex flex-row items-center gap-4 px-4 py-1 transition-all rounded-md cursor-pointer select-none text-md focus-visible:text-brand-blue hover:text-brand-blue focus-visible:bg-brand-light-blue hover:bg-brand-light-blue'>
                                                    <HiOutlinePencil />
                                                    Editar
                                                </span>
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
                                                                        duration: 2000 * 5,
                                                                        placement: "topStart",
                                                                    });
                                                                    refetch();
                                                                } else {
                                                                    toaster.push(messageToaster(`Hubo un problema al eliminar la configuración`, "error"), {
                                                                        duration: 2000 * 5,
                                                                        placement: "topStart",
                                                                    });
                                                                }
                                                            })
                                                            .catch(() => {
                                                                toaster.push(messageToaster(`Hubo un problema al eliminar la configuración`, "error"), {
                                                                    duration: 2000 * 5,
                                                                    placement: "topStart",
                                                                });
                                                            });
                                                    }}
                                                    className='flex flex-row items-center gap-4 px-4 py-1 transition-all rounded-md cursor-pointer select-none text-md focus-visible:text-red-500 hover:text-red-500 focus-visible:bg-red-200 hover:bg-red-200'>
                                                    <HiOutlineTrash />
                                                    Eliminar
                                                </button>
                                                <hr />
                                                <a
                                                    target='_blank'
                                                    href={`https://app.progps.com.do/#/entity/view/schedule/-/custom/edit/${task.task_id}`}
                                                    className='flex flex-row items-center gap-4 px-4 py-1 transition-all rounded-md cursor-pointer select-none text-md focus-visible:text-brand-blue hover:text-brand-blue focus-visible:bg-brand-light-blue hover:bg-brand-light-blue'>
                                                    <HiOutlineMapPin />
                                                    Editar tarea
                                                </a>
                                            </Popover.Panel>
                                        </Transition>
                                    </div>
                                </Portal>
                            </>
                        );
                    }}
                </Popover>
            </div>
        </>
    );
};

export const TasksList = ({
    taskModalData,
    tooltip,
    setTaskModalData,
    filteredData,
    setFilteredData,
    taskData: { isLoading, error, refetch },
}: {
    taskModalData: Task | undefined;
    tooltip: (message: string) => JSX.Element;
    setTaskModalData: React.Dispatch<React.SetStateAction<Task | undefined>>;
    taskData: UseQueryResult<TaskData, Error>;
    filteredData?: TaskData;
    setFilteredData: React.Dispatch<React.SetStateAction<TaskData | undefined>>;
}) => {
    return (
        <>
            <div>
                <div className='max-md:hidden grid md:grid-cols-[10rem_1fr_1fr_1fr_12rem_5rem_4rem] xl:grid-cols-[1fr_1fr_1fr_1fr_12rem_5rem_4rem] px-2 py-2 font-medium'>
                    <div>Empleado</div>
                    <div>Etiqueta</div>
                    <div>Frecuencia</div>
                    <div>Días</div>
                    <div>Fechas</div>
                    <div>Activa</div>
                    <div></div>
                </div>
                <hr className='mb-2' />
                <div className='md:max-h-[calc(100vh-300px)] overflow-y-auto'>
                    {isLoading && !filteredData ? (
                        <div className='relative h-52'>
                            <LoadSpinner />
                        </div>
                    ) : error ? (
                        <div className='p-4 my-4 font-medium text-center text-red-500 bg-red-200 border border-red-500 rounded-lg'>
                            <i className='mgc_warning_fill me-2'></i>
                            Ha ocurrido un error al cargar los datos.
                        </div>
                    ) : filteredData && filteredData.list.length > 0 ? (
                        <>
                            {filteredData?.list.map((task) => (
                                <TaskItem
                                    taskModalData={taskModalData}
                                    setData={setFilteredData}
                                    key={task.id}
                                    task={task}
                                    tooltip={tooltip}
                                    setFilteredData={setFilteredData}
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
