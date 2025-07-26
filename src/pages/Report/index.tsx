import { Fragment, useEffect, useRef, useState } from "react";
import { Tab, Transition } from "@headlessui/react";
import cn from "classnames";
import { useFetch } from "@hooks/useFetch";
import { DriversGroup, GeneratedReportRow, ReportType, TrackersGroup, VehiclesGroup } from "@utils/types";
import api from "@api/index";
import { useApiQuery } from "@hooks/useQuery";
import { appearAnimationProps, scaleAnimationProps } from "@utils/animations";
import { ReportPreview } from "./components/report-preview";
import ReportCreateScreen from "./components/report-create-screen";
import ReportListScreen from "./components/report-list-screen";
import ReportCreateForm from "./components/report-create-form";
import ReportCreateList from "./components/report-create-list";
import { useToaster } from "rsuite";
import { HiChevronLeft, HiChevronUp } from "react-icons/hi2";
import { ErrorBoundary } from "react-error-boundary";
import messageToaster from "@utils/toaster";

type Response = {
    message: string;
    report: {
        percent: number;
        report_payload: any;
        report_type_id: number;
        created_at: string;
        updated_at: string;
    };
};

export const Reports = () => {
    const [createScreen, setCreateScreen] = useState(false);

    const [activeReportType, setActiveReportType] = useState<ReportType | null>(null);
    const [activeReport, setActiveReport] = useState<GeneratedReportRow | null>(null);

    const [filter, setFilter] = useState("");
    const [filterItem, setFilterItem] = useState("");
    const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

    const [trackerGroups, setTrackerGroups] = useState<TrackersGroup[]>();
    const [vehicleGroups, setVehicleGroups] = useState<VehiclesGroup[]>();
    const [driverGroups, setDriverGroups] = useState<DriversGroup[]>();

    const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());
    const [selectedTrackers, setSelectedTrackers] = useState<Set<number>>(new Set());
    const [selectedDrivers, setSelectedDrivers] = useState<Set<number>>(new Set());
    const [selectedVehicles, setSelectedVehicles] = useState<Set<number>>(new Set());

    const [errorMessage, setErrorMessage] = useState<string>();

    const { data: trackersData, isLoading: isLoadingTrackers, error: trackersError, fetcher: trackersFetcher } = useFetch<TrackersGroup[]>("/reports/panel/trackers");
    const { data: driversData, isLoading: isLoadingDrivers, error: driversError, fetcher: driversFetcher } = useFetch<DriversGroup[]>("/reports/panel/employees");
    const { data: vehiclesData, isLoading: isLoadingVehicles, error: vehiclesError, fetcher: vehiclesFetcher } = useFetch<TrackersGroup[]>("/reports/panel/trackers");

    const allTrackerIds = trackerGroups?.flatMap((g) => g.trackers.map((t) => t.id)) ?? [];
    const allDriversIds = driverGroups?.flatMap((g) => g.employees.map((t) => t.id)) ?? [];
    const allGroupIds = trackerGroups?.flatMap((g) => g.id) ?? [];

    let isAllSelected = false;
    if (activeReportType?.list === "trackers") {
        isAllSelected = allTrackerIds.length > 0 && allTrackerIds.every((id) => selectedTrackers.has(id));
    } else if (activeReportType?.list === "drivers") {
        isAllSelected = allDriversIds.length > 0 && allDriversIds.every((id) => selectedDrivers.has(id));
    }
    const isIndeterminate = selectedTrackers.size > 0 && !isAllSelected;

    const [payload, setPayload] = useState<{ report_type_id: number; report_payload: any }>({ report_type_id: 0, report_payload: {} });
    const [isPayloadValid, setPayloadValid] = useState<boolean>(false);

    const hasLoadedOnce = useRef(false);

    const { data, refetch: refetchReports, isError, isLoading: isLoadingReports } = useApiQuery<GeneratedReportRow[]>("/reports/list", { disable: createScreen, retry: false });

    const [reports, setReports] = useState<GeneratedReportRow[]>(data || []);

    const [generatingReport, setGeneratingReport] = useState<boolean>(false);

    const toaster = useToaster();

    useEffect(() => {
        if (!isLoadingReports && data) {
            hasLoadedOnce.current = true;
            setReports(data);
        }
    }, [data, isLoadingReports]);

    useEffect(() => {
        if (fieldValues && activeReportType) {
            let newPayload: { report_type_id: number; report_payload: any } = { report_type_id: activeReportType.id, report_payload: { ...fieldValues } };

            if (fieldValues.date) {
                newPayload.report_payload.date = fieldValues.date ? fieldValues.date.toISOString().split(".")[0] + "Z" : "";
            }

            if (fieldValues.from && !fieldValues.range) {
                newPayload.report_payload.from = fieldValues.from ? fieldValues.from.toISOString().split(".")[0] + "Z" : "";
            }

            if (fieldValues.to && !fieldValues.range) {
                newPayload.report_payload.to = fieldValues.to ? fieldValues.to.toISOString().split(".")[0] + "Z" : "";
            }

            if (fieldValues.range) {
                newPayload.report_payload.from = fieldValues.range[0] ? fieldValues.range[0].toISOString().split(".")[0] + "Z" : "";
                newPayload.report_payload.to = fieldValues.range[1] ? fieldValues.range[1].toISOString().split(".")[0] + "Z" : "";
                delete newPayload.report_payload.range;
            }
            if (fieldValues.groupBy) {
                newPayload.report_payload.groupBy = fieldValues.groupBy.value;
            }

            if (activeReportType.list === "trackers") {
                newPayload.report_payload.trackers = Array.from(selectedTrackers);
                newPayload.report_payload.groups = Array.from(selectedGroups);
            }
            if (activeReportType.list === "drivers") {
                newPayload.report_payload.employees = Array.from(selectedDrivers);
            }
            if (activeReportType.list === "vehicles") {
                newPayload.report_payload.vehicles = Array.from(selectedVehicles);
            }

            setPayload(newPayload);
        }
    }, [fieldValues, selectedGroups, selectedDrivers, selectedTrackers, selectedVehicles, activeReportType]);

    function validatePayload(): boolean {
        if (!activeReportType) return false;
        if (selectedDrivers.size === 0 && selectedTrackers.size === 0 && selectedVehicles.size === 0) return false;
        if (!payload.report_payload) return false;
        if (!payload.report_payload.trackers && !payload.report_payload.employees && !payload.report_payload.vehicles) return false;
        const keys = Object.keys(payload.report_payload);
        for (let i = 0; i < keys.length; i++) {
            // if (keys[i] !== "from" && keys[i] !== "to") {
            if (
                (payload.report_payload[keys[i]] === undefined ||
                    payload.report_payload[keys[i]] === null ||
                    (typeof payload.report_payload[keys[i]] === "string" && payload.report_payload[keys[i]].length === 0) ||
                    (payload.report_payload[keys[i]] && typeof payload.report_payload[keys[i]].size === "number" && payload.report_payload[keys[i]].size === 0) ||
                    payload.report_payload[keys[i]] === "") &&
                activeReportType.fields[i]?.required
            ) {
                return false;
            }
            // }
        }

        return true;
    }

    async function sendReportRequest() {
        // toaster.push(messageToaster(`Validando reporte...`, "info"), { duration: 5000, placement: "topEnd" });
        setGeneratingReport(true);
        if (validatePayload()) {
            try {
                api.post<Response>("reports/generate", payload)
                    .then(({ data: r, status }) => {
                        if (status === 201) {
                            toaster.push(messageToaster("Generando reporte...", "success"), { duration: 5000, placement: "topEnd" });
                            setActiveReportType(null);
                            setSelectedDrivers(new Set());
                            setSelectedTrackers(new Set());
                            setSelectedVehicles(new Set());
                            setSelectedGroups(new Set());
                            setCreateScreen(false);
                            setErrorMessage(undefined);
                            setPayload({ report_type_id: 0, report_payload: {} });
                            setFieldValues({});
                            refetchReports();
                        } else {
                            toaster.push(messageToaster(r.message), { duration: 5000, placement: "topEnd" });
                            setErrorMessage(r.message);
                        }
                    })
                    .catch(() => {
                        toaster.push(messageToaster("Hubo un error al generar el reporte."), { duration: 5000, placement: "topEnd" });
                        setErrorMessage("Hubo un error al generar el reporte");
                    });
            } catch (error) {
                console.error("Error al enviar la solicitud de reporte:", error);
                toaster.push(messageToaster("Hubo un error al generar el reporte."), { duration: 5000, placement: "topEnd" });
                setErrorMessage("Hubo un error al generar el reporte");
            }
        } else {
            toaster.push(messageToaster(`Uno o más campos están vacíos`), { duration: 5000, placement: "topEnd" });
        }
        setGeneratingReport(false);
    }

    useEffect(() => {
        if (activeReportType) {
            const initialValues: Record<string, any> = {};
            activeReportType.fields.forEach((_field, _index) => {
                initialValues[`${_field.key}`] = _field.defaultValue; // or a better key
            });
            setFieldValues(initialValues);
        }
    }, [activeReportType]);

    useEffect(() => {
        if (trackersData) if (trackersData.length > 0) setTrackerGroups(trackersData);
    }, [trackersData]);

    useEffect(() => {
        if (driversData) if (driversData.length > 0) setDriverGroups(driversData);
    }, [driversData]);

    useEffect(() => {
        if (vehiclesData) if (vehiclesData.length > 0) setVehicleGroups(vehiclesData);
    }, [vehiclesData]);

    useEffect(() => {
        setPayloadValid(validatePayload());
    }, [payload]);

    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <div className='text-[0.9rem] px-0'>
            <Transition show={true} {...scaleAnimationProps}>
                <h1 className='mb-2 text-lg font-medium text-brand-dark-gray'>Reportes personalizados</h1>
                <div className='relative w-full bg-white shadow rounded-xl p-2 h-[85dvh] max-h-[85dvh]'>
                    <Tab.Group as={Fragment}>
                        <div
                            className={cn(
                                "relative grid max-d:grid-rows-2 gap-2 h-full box-border",
                                isMenuOpen ? "md:grid-cols-[340px_auto] transition-all" : "md:grid-cols-[2.5rem_auto] transition-all",
                            )}>
                            <div
                                className='absolute top-0 md:relative w-full bg-white z-50 aria-expanded:max-md:shadow-md shadow-none flex flex-col object-contain max-md:aria-expanded:max-h-[60dvh] max-md:aria-expanded:min-h-[60dvh] transition-all max-md:aria-hidden:h-10 md:aria-hidden:w-10 md:h-full overflow-hidden border divide- rounded-xl'
                                aria-expanded={isMenuOpen}
                                aria-hidden={!isMenuOpen}>
                                <Transition show={!isMenuOpen} unmount={false} {...appearAnimationProps} className='absolute left-0 right-0 invisible rotate-90 top-16 md:visible'>
                                    <p className='font-medium text-gray-700 text-nowrap'>Reportes generados</p>
                                </Transition>
                                <Tab.List className={"relative"}>
                                    <>
                                        <div
                                            className={cn(
                                                "grid grid-cols-2 *:w-full *:h-full min-h-10 divide-x *:transition font-medium *:border-b",
                                                isMenuOpen ? "md:visible md:opacity-100" : "md:invisible md:opacity-0",
                                            )}>
                                            {[
                                                { label: "Reportes", active: true },
                                                { label: "Horario", active: false },
                                            ].map((title, titleIdx) => (
                                                <Tab
                                                    disabled={!title.active}
                                                    key={titleIdx}
                                                    className={({ selected, disabled }) =>
                                                        cn(
                                                            "uppercase hover:bg-gray-100 outline-none focus-visible:bg-gray-100",
                                                            selected && "text-brand-blue border-b-brand-blue",
                                                            disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
                                                        )
                                                    }>
                                                    {title.label}
                                                </Tab>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className='absolute top-0 visible block border-t-0! w-10 h-10 transition-all outline-none opacity-100 max-md:invisible max-md:opacity-0 max-md:hidden hover:bg-black/20 focus-visible:bg-black/20'>
                                            <HiChevronLeft className={cn("m-auto size-4 transition-all", isMenuOpen ? "rotate-0" : "rotate-180")} />
                                        </button>
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className='absolute top-0 invisible hidden w-10 h-10 transition-all outline-none opacity-0 max-md:visible max-md:opacity-100 max-md:block hover:bg-black/20 focus-visible:bg-black/20'>
                                            <HiChevronUp className={cn("m-auto size-4 transition-all", isMenuOpen ? "rotate-0" : "rotate-180")} />
                                        </button>
                                    </>
                                </Tab.List>
                                <Tab.Panels as={Fragment}>
                                    <Tab.Panel as={Fragment}>
                                        <div
                                            className={cn(
                                                "relative flex flex-col h-full overflow-hidden outline-none grow transition-opacity duration-500",
                                                isMenuOpen ? "visible opacity-100" : "invisible opacity-0",
                                            )}>
                                            <Transition show={!createScreen} unmount={false} {...appearAnimationProps} className='overflow-y-auto grow'>
                                                <ReportListScreen
                                                    setActiveReport={setActiveReport}
                                                    setCreateScreen={setCreateScreen}
                                                    reports={reports}
                                                    isLoadingReports={isLoadingReports}
                                                    hasLoadedOnce={hasLoadedOnce}
                                                    refetchReports={refetchReports}
                                                    isError={isError}
                                                    filter={filterItem}
                                                    activeReport={activeReport}
                                                    setFilter={setFilterItem}
                                                    setIsMenuOpen={setIsMenuOpen}
                                                />
                                            </Transition>
                                            <Transition
                                                unmount={true}
                                                show={createScreen}
                                                {...appearAnimationProps}
                                                enter='transition-all duration-500'
                                                leave='transition-all duration-500'
                                                className='absolute w-full h-full overflow-y-auto '>
                                                <ReportCreateScreen
                                                    setActiveReportType={setActiveReportType}
                                                    setCreateScreen={setCreateScreen}
                                                    filter={filter}
                                                    setIsMenuOpen={setIsMenuOpen}
                                                    setFilter={setFilter}
                                                    activeReportType={activeReportType}
                                                />
                                            </Transition>
                                        </div>
                                    </Tab.Panel>
                                    <Tab.Panel className={cn("relative h-full outline-none", isMenuOpen ? "visible" : "invisible")}>
                                        <div className='absolute inset-0 m-auto'>Por implementar</div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </div>
                            <div className='box-border w-full mt-12 overflow-hidden border md:mt-0 rounded-xl'>
                                <>
                                    {activeReport && !activeReportType ? (
                                        <ErrorBoundary fallback={<div className='text-red-500'>Hubo un error al cargar el reporte. Por favor, inténtelo de nuevo.</div>}>
                                            <ReportPreview activeReport={activeReport} setActiveReport={setActiveReport} refetch={refetchReports} />
                                        </ErrorBoundary>
                                    ) : activeReportType && !activeReport ? (
                                        <div className='grid h-full max-md:grid-rows-[0.75fr_1fr] md:grid-cols-[1fr_1fr] xl:grid-cols-[0.5fr_1fr] divide-x overflow-hidden'>
                                            <ReportCreateList
                                                activeReportType={activeReportType}
                                                trackerGroups={trackerGroups}
                                                vehicleGroups={vehicleGroups}
                                                driverGroups={driverGroups}
                                                isLoadingTrackers={isLoadingTrackers}
                                                trackersError={trackersError}
                                                trackersFetcher={trackersFetcher}
                                                isLoadingVehicles={isLoadingVehicles}
                                                vehiclesError={vehiclesError}
                                                vehiclesFetcher={vehiclesFetcher}
                                                isLoadingDrivers={isLoadingDrivers}
                                                driversError={driversError}
                                                driversFetcher={driversFetcher}
                                                selectedGroups={selectedGroups}
                                                selectedTrackers={selectedTrackers}
                                                selectedVehicles={selectedVehicles}
                                                selectedDrivers={selectedDrivers}
                                                setSelectedGroups={setSelectedGroups}
                                                setSelectedTrackers={setSelectedTrackers}
                                                setSelectedVehicles={setSelectedVehicles}
                                                setSelectedDrivers={setSelectedDrivers}
                                                allTrackerIds={allTrackerIds}
                                                allDriversIds={allDriversIds}
                                                allGroupIds={allGroupIds}
                                                isAllSelected={isAllSelected}
                                                filterItem={filterItem}
                                                setFilterItem={setFilterItem}
                                                isIndeterminate={isIndeterminate}
                                            />
                                            <ReportCreateForm
                                                setIsMenuOpen={setIsMenuOpen}
                                                setCreateScreen={setCreateScreen}
                                                generatingReport={generatingReport}
                                                activeReportType={activeReportType}
                                                fieldValues={fieldValues}
                                                setFieldValues={setFieldValues}
                                                isPayloadValid={isPayloadValid}
                                                sendReportRequest={sendReportRequest}
                                                errorMessage={errorMessage}
                                                setActiveReportType={setActiveReportType}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className='flex items-center justify-center h-full col-span-2 px-4 text-xl font-medium text-center text-slate-800'>
                                                Seleccione un reporte para continuar
                                            </div>
                                        </>
                                    )}
                                </>
                            </div>
                        </div>
                    </Tab.Group>
                </div>
            </Transition>
        </div>
    );
};
