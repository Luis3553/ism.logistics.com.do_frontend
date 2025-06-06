import { LoadSpinner } from "@components/LoadSpinner";
import { Modal } from "@components/Modal";
import { useFetch } from "@hooks/useFetch";
import { Tracker, Vehicle, Tag as VehicleTag } from "@utils/types";
import { useEffect, useState } from "react";
import { IoCloseOutline, IoReload } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import cn from "classnames";

export function LabeledInput({ className, label, value }: { className?: string; label: string; value: string }) {
    return (
        <div className={cn("flex-col gap-0", className)}>
            <span className='text-sm leading-none opacity-80'>{label}</span>
            <p className='font-medium leading-none rounded text-md border-brand-light-gray'>{value}</p>
        </div>
    );
}

export function Tag({ tag }: { tag: VehicleTag }) {
    return (
        <div
            title={tag.name}
            style={{
                color: `#${tag.color}`,
                backgroundColor: `#${tag.color}30`,
                borderColor: `#${tag.color}`,
            }}
            className={"px-4 text-sm text-center py-0.5 font-medium rounded-full border"}>
            {tag.name}
        </div>
    );
}

export default function VehicleModal({
    alertName,
    rowData,
    isOpen,
    setIsOpen,
}: {
    alertName: string;
    rowData: Tracker;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { data, isLoading, error, fetcher } = useFetch<{ success: boolean; value: Vehicle }>(`/notifications/tracker/${rowData.vehicle_id}/vehicle`);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);

    const colorMap: Record<string, string> = {
        BLANCO: "outline outline-1 outline-brand-light-gray",
        VERDE: "bg-green-500",
        ROJO: "bg-red-500",
        AZUL: "bg-blue-500",
        NEGRO: "bg-black",
        AMARILLO: "bg-yellow-400",
        GRIS: "bg-gray-500",
    };

    const typeMap: Record<string, string> = {
        car: "Vehículo",
        truck: "Camión",
        bus: "Autobús",
        special: "Especial",
    };

    const subtypeMap: Record<string, string> = {
        // car
        sedan: "Sedan",
        universal: "Universal",
        hatchback: "Hatchback",
        liftback: "Liftback",
        limousine: "Limusina",
        pickup: "Camioneta",
        coupe: "Coupe-2 puertas",
        coupe4d: "Coupe-4 puertas",
        muscle: "Muscle car",
        convertible: "Convertible",
        phaeton: "Faetón",
        lando: "Lando",
        crossover: "Crossover",
        roadster: "De turismo",
        suv: "SUV",

        // truck 
        minivan: "Minivan",
        tipper: "Volquete",
        board: "Tarjeta",
        covered: "Cubierto",
        awning: "Con toldo",
        mixer: "Mezclador",
        tanker: "Cisterna",
        refrigerator: "Refrigerador",
        transporter: "Transportador",
        container: "Contenedor",
        tractor: "Trailer",

        // bus
        city: "Ciudad",
        shuttle: "Microbús",
        platform: "Plataforma",
        school: "Escuela",
        intercity: "Interurbano",
        local: "Local",
        sightseeing: "Turismo",

        // special
        mobile_crane: "Grúa",
        racing: "Carreras",
        buggy: "Buggy",
        ambulance: "Ambulancia",
        firefighter: "Bombero",
        hearse: "Carroza fúnebre",
        shop: "Concesionario de vehículos",
        harvester: "Cosechadora",
        snowplow: "Quitanieves",
        grader: "Motoniveladora",
        excavator: "Excavadora",
        bulldozer: "Bulldozer",
        armored: "Blindado",
        amphibian: "Anfibio",
        boat: "Barco",
    };

    useEffect(() => {
        if (data) setVehicle(data.value);
    }, [data]);

    return (
        <Modal className='h-screen md:h-min max-w-[900px]' onClose={() => setIsOpen(false)} isOpen={isOpen}>
            {isLoading ? (
                <div className='relative h-[600px]'>
                    <LoadSpinner />
                </div>
            ) : error ? (
                <div>
                    <div className='flex justify-between pb-4'>
                        <h1 className='text-lg font-semibold'>{rowData.name}</h1>
                        <button onClick={() => setIsOpen(false)}>
                            <i className='mgc_close_line'></i>
                        </button>
                    </div>
                    <div className='flex flex-col items-center justify-center h-40 text-xl text-center '>
                        <span className='flex flex-col items-center font-bold text-red-500 md:flex-row'>
                            <RiErrorWarningLine className='me-4 size-8' />
                            Error cargando la información del vehículo
                        </span>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='flex items-center justify-center px-8 py-1 mt-8 font-semibold text-red-500 transition-all bg-red-200 rounded-lg shadow w-44 hover:shadow-lg hover:bg-transparent'>
                                <IoCloseOutline className='me-2 size-7' />
                                Cerrar
                            </button>
                            <button
                                onClick={fetcher}
                                className='flex items-center justify-center px-8 py-1 mt-8 font-semibold text-blue-500 transition-all bg-blue-200 rounded-lg shadow w-44 hover:shadow-lg hover:bg-transparent'>
                                <IoReload className='me-2 size-5' />
                                Recargar
                            </button>
                        </div>
                    </div>
                </div>
            ) : vehicle ? (
                <div className='flex flex-col h-full px-2 overflow-y-auto'>
                    <div className='flex justify-between pb-4'>
                        <h1 className='text-lg font-semibold'>{rowData.name}</h1>
                        <button onClick={() => setIsOpen(false)}>
                            <i className='mgc_close_line'></i>
                        </button>
                    </div>
                    <div className='grid grid-cols-1 gap-8 h-fit md:grid-cols-2'>
                        <div className='flex flex-col justify-between h-full overflow-hidden shadow-lg rounded-xl'>
                            <div>
                                <div className='flex items-center justify-center object-contain overflow-hidden bg-green-300 rounded-xl align-center text-brand-blue h-44 border-brand-blue'>
                                    <iframe
                                        src={`https://maps.google.com/?q=${rowData.latitude},${rowData.longitude}&z=15&output=embed`}
                                        className='w-full h-full'
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading='eager'
                                        referrerPolicy='no-referrer-when-downgrade'></iframe>
                                </div>
                                <div className='flex flex-col gap-2 p-6 pt-2'>
                                    <small>{rowData.address}</small>
                                    <div className='grid md:grid-cols-2'>
                                        <LabeledInput label='Inicio' className='text-sm' value={rowData.start_date} />
                                        <LabeledInput label='Fin' className='text-sm' value={rowData.end_date} />
                                    </div>

                                    <hr />
                                    <LabeledInput label='Alerta' value={`${alertName} (${rowData.time})`} />
                                    <LabeledInput label='Nombre' value={vehicle.label} />
                                    <LabeledInput label='Placa' value={vehicle.reg_number} />
                                    
                                </div>
                            </div>
                            <Link
                                target='_blank'
                                to={"https://app.progps.com.do/#/tracking"}
                                className='p-3 px-4 font-medium text-center text-blue-500 transition shadow hover:bg-blue-500 hover:text-white'>
                                Seguimiento
                            </Link>
                        </div>
                        <div className='flex flex-col justify-between mb-4'>
                            <div className='*:py-2'>
                                <div className='grid grid-cols-2'>
                                    <LabeledInput
                                        label='Conductor'
                                        value={
                                            vehicle.driver
                                                ? `${
                                                      vehicle.driver.first_name != ""
                                                          ? `${vehicle.driver.first_name}${vehicle.driver.phone != "" ? `, ${vehicle.driver.phone}` : ""}`
                                                          : "-"
                                                  }${vehicle.driver.middle_name != "" ? ` ${vehicle.driver.middle_name}` : ""} ${
                                                      vehicle.driver.last_name != "" ? vehicle.driver.last_name : ""
                                                  }`
                                                : "-"
                                        }
                                    />
                                    <LabeledInput label='Garaje' value={vehicle.garage_organization_name != "" && vehicle.garage_id != null ? vehicle.garage_organization_name : "-"} />
                                </div>
                                <div className='grid grid-cols-2'>
                                    <LabeledInput label='Tipo' value={typeMap[vehicle.type] ?? "Otro"} />
                                    <LabeledInput label='Subtipo' className="capitalize" value={subtypeMap[vehicle.subtype] ?? "Otro"} />
                                </div>
                                <div className='grid grid-cols-2'>
                                    <LabeledInput label='Modelo' value={vehicle.model} />
                                    <div className={cn("flex-col gap-0")}>
                                        <span className='text-sm leading-none opacity-80'>Color</span>
                                        <div className='flex flex-row'>
                                            {(() => {
                                                const colorKey = vehicle.color?.toUpperCase?.().trim();
                                                const colorClass = colorKey && colorMap[colorKey] ? colorMap[colorKey] : "bg-gray-400";
                                                return <i className={cn("h-4 rounded-full me-2 aspect-square shadow-md", colorClass)}></i>;
                                            })()}
                                            <span className='font-medium leading-none rounded text-md border-brand-light-gray'>{vehicle.color != "" ? vehicle.color : "-"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <LabeledInput label='VIN/Chasis' value={vehicle.chassis_number != "" ? vehicle.chassis_number : vehicle.vin != "" ? vehicle.vin : "-"} />
                                    <LabeledInput label='No. de registro del tráiler' value={vehicle?.trailer_reg_number ?? "N/A"} />
                                </div>

                                <div className='grid grid-cols-2'>
                                    <LabeledInput label='Número de cuadro' value={vehicle.frame_number != "" ? vehicle.frame_number : "-"} />
                                    <LabeledInput label='Año de fabricación' value={String(vehicle.manufacture_year ?? "-")} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm opacity-80'>Etiquetas</span>
                                    <div className='flex flex-row flex-wrap gap-2 overflow-y-auto max-h-[110px]'>
                                        {vehicle.tags.length > 0 ? vehicle.tags.map((tag, tagIdx) => <Tag key={`tag-${tagIdx}-${tag}`} tag={tag} />) : "-"}
                                    </div>
                                </div>
                            </div>
                            <Link
                                target='_blank'
                                to={"https://app.progps.com.do/#/entity/view/vehicle"}
                                className='p-3 px-4 font-medium text-center text-blue-500 transition rounded-md shadow hover:bg-blue-100'>
                                Gestión de flotas
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </Modal>
    );
}
