import { HiChevronUp, HiXMark } from "react-icons/hi2";
import SortableList from "./sortableList";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { appearAnimationProps } from "@utils/animations";
import classNames from "classnames";
import { usePlanificationStore } from "@contexts/planification.context";
import ListboxComponent from "@components/listbox";
import api from "@api/index";
import { Button } from "@components/Button";


function RouteOptimization() {
    // const { selectedOrders } = usePlanificationStore();
    const [selectedOption, setSelectedOption] = useState({ value: 0, label: "Seleccione..." });

    const [open, setOpen] = useState(false);
    return (
        <div className={classNames("relative z-30 rounded-3xl rounded-t-lg bg-white", open ? "border border-b-0" : "h-8")}>
            <Transition show={open} {...appearAnimationProps}>
                <div className='flex flex-row items-start p-4 gap-x-2 h-28'>
                    <ListboxComponent options={[]} selectedOption={selectedOption} onChange={setSelectedOption} />
                    <button className='p-2 px-4 text-white rounded bg-brand-blue'>Ok</button>
                </div>
            </Transition>
            <Button
                variant='subtle'
                onClick={() => setOpen(!open)}
                className={classNames(
                    "absolute bottom-0 z-50 w-full p-2 font-medium text-center transition-all rounded-full outline-none  focus-visible:text-white hover:text-white active:text-white ",
                    open && "hover:bg-red-500 focus-visible:bg-red-500 active:bg-red-500/80 bg-red-200 text-red-500",
                )}>
                {!open ? "Optimizar" : "Cancelar"}
            </Button>
        </div>
    );
}

function RouteNameInput() {
    const { routeName, setRouteName } = usePlanificationStore();
    return (
        <div className='relative w-full'>
            <input
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                type='text'
                className={classNames(
                    "w-full p-3 transition-all border rounded-lg outline-none pe-10 ring-0 focus-visible:border-brand-blue caret-brand-blue",
                    routeName.length == 0 && "border-red-400",
                )}
                placeholder='Nombre de la ruta'
            />
            <div>
                <button
                    onClick={() => setRouteName("")}
                    className='absolute inset-0 flex items-center justify-center my-auto text-red-400 transition-all rounded-full outline-none focus-visible:bg-red-100 aspect-square hover:bg-red-100 me-3 ms-auto end-0 size-min active:bg-red-200'>
                    <HiXMark className='m-0.5' />
                </button>
            </div>
        </div>
    );
}

export default function RoutePane() {
    const { routePaneOpen: open, setRoutePaneOpen: setOpen, routeName, selectedOrders } = usePlanificationStore();
    // @ts-ignore
    function submitRoute() {
        const payload = {
            name: selectedOrders.length > 1 ? routeName : selectedOrders[0].title,
            orders: selectedOrders.map((order) => order.id),
        };

        api.post("/delivery-planner/tasks/create", payload)
            .then(() => {})
            .catch((error) => {
                console.error("Error al guardar la ruta:", error);
            });
    }

    return (
        <div className='z-50 absolute flex flex-col p-3 transition-all bg-white border shadow top-4 end-4 w-[calc((100%/3)-40px)] max-h-[calc(90vh-40px)] h-[calc(90vh-40px)] grow gap-y-4 rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <button onClick={() => setOpen(!open)} className='p-2 transition-all outline-none rounded-xl hover:bg-slate-100 focus-visible:bg-slate-100 active:bg-slate-200'>
                    <HiChevronUp className={classNames(!open ? "rotate-180" : "rotate-0")} />
                </button>
                <h1 className='text-[14px] font-bold'>Ruta</h1>
            </div>
            {open && (
                <>
                    {selectedOrders.length > 1 && <RouteNameInput />}
                    {selectedOrders.length === 0 ? (
                        <div className='flex items-center justify-center w-full h-20 text-gray-500'>No hay órdenes seleccionadas</div>
                    ) : (
                        <div className='overflow-y-auto h-[calc(100%-200px)]'>
                            <SortableList items={selectedOrders} />
                        </div>
                    )}
                    <div className='absolute bottom-0 left-0 right-0 flex flex-col p-2 gap-y-2'>
                        {selectedOrders.length > 1 && <RouteOptimization />}
                        <div className='flex flex-col gap-2 md:flex-row'>
                            <Button
                                variant='subtle'
                                strength='muted'
                                rounded='lg'
                                onClick={() => {}}
                                className='z-50 w-full p-2 font-medium text-center transition-all rounded-full outline-none focus-visible:text-white hover:text-white active:text-white hover:bg-slate-600 focus-visible:bg-slate-600 active:bg-slate-600/80 bg-slate-200 text-slate-500'>
                                Cancelar
                            </Button>
                            <Button variant='solid' strength='primary' rounded='lg' onClick={() => {}} className='z-50 w-full'>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}