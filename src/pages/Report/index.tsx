import { Fragment, useEffect, useRef, useState } from "react";
import { Tab, Transition } from "@headlessui/react";
import cn from "classnames";
import { useFetch } from "@hooks/useFetch";
import { DriversGroup, GeneratedReportRow, ReportType, TrackersGroup, VehiclesGroup } from "@utils/types";
import api from "@api/index";
import { toISOString } from "@utils/dateISOformatter";
import { useApiQuery } from "@hooks/useQuery";
import { appearAnimationProps, scaleAnimationProps } from "@utils/animations";
import { ReportPreview } from "./components/report-preview";
import ReportCreateScreen from "./components/report-create-screen";
import ReportListScreen from "./components/report-list-screen";
import ReportCreateForm from "./components/report-create-form";
import ReportCreateList from "./components/report-create-list";
// import { useApiQuery } from "@hooks/useQuery";

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

    const [selectedTrackers, setSelectedTrackers] = useState<Set<number>>(new Set());
    const [selectedDrivers, setSelectedDrivers] = useState<Set<number>>(new Set());
    const [selectedVehicles, setSelectedVehicles] = useState<Set<number>>(new Set());

    const [errorMessage, setErrorMessage] = useState<string>();

    const { data: trackersData, isLoading: isLoadingTrackers, error: trackersError, fetcher: trackersFetcher } = useFetch<TrackersGroup[]>("/reports/panel/trackers");
    const { data: driversData, isLoading: isLoadingDrivers, error: driversError, fetcher: driversFetcher } = useFetch<TrackersGroup[]>("/reports/panel/trackers");
    const { data: vehiclesData, isLoading: isLoadingVehicles, error: vehiclesError, fetcher: vehiclesFetcher } = useFetch<TrackersGroup[]>("/reports/panel/trackers");

    const allTrackerIds = trackerGroups?.flatMap((g) => g.trackers.map((t) => t.id)) ?? [];

    const isAllSelected = allTrackerIds.length > 0 && allTrackerIds.every((id) => selectedTrackers.has(id));
    const isIndeterminate = selectedTrackers.size > 0 && !isAllSelected;

    const [payload, setPayload] = useState<{ report_type_id: number; report_payload: any }>({ report_type_id: 0, report_payload: {} });
    const [isPayloadValid, setPayloadValid] = useState<boolean>(false);

    const hasLoadedOnce = useRef(false);

    const { data, refetch: refetchReports, isError, isLoading: isLoadingReports } = useApiQuery<GeneratedReportRow[]>("/reports/list", { disable: createScreen, retry: false });

    const [reports, setReports] = useState<GeneratedReportRow[]>(data || []);

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
                newPayload.report_payload.date = toISOString(fieldValues.date);
            }
            if (fieldValues.range) {
                newPayload.report_payload.from = toISOString(fieldValues.range[0]);
                newPayload.report_payload.to = toISOString(fieldValues.range[1]);
                delete newPayload.report_payload.range;
            }

            if (activeReportType.list === "trackers") {
                newPayload.report_payload.trackers = Array.from(selectedTrackers);
            }
            if (activeReportType.list === "drivers") {
                newPayload.report_payload.drivers = Array.from(selectedDrivers);
            }
            if (activeReportType.list === "vehicles") {
                newPayload.report_payload.vehicles = Array.from(selectedVehicles);
            }

            setPayload(newPayload);
        }
    }, [fieldValues, selectedDrivers, selectedTrackers, selectedVehicles, activeReportType]);

    function validatePayload(): boolean {
        if (!activeReportType) return false;
        if (selectedDrivers.size === 0 && selectedTrackers.size === 0 && selectedVehicles.size === 0) return false;
        if (!payload.report_payload) return false;
        if (!payload.report_payload.trackers && !payload.report_payload.drivers && !payload.report_payload.vehicles) return false;
        const keys = Object.keys(payload.report_payload);
        for (let i = 0; i < keys.length; i++) {
            if (
                payload.report_payload[keys[i]] === undefined ||
                payload.report_payload[keys[i]] === null ||
                payload.report_payload[keys[i]].lenght === 0 ||
                payload.report_payload[keys[i]].size === 0 ||
                payload.report_payload[keys[i]] == ""
            ) {
                return false;
            }
        }

        return true;
    }

    async function sendReportRequest() {
        if (validatePayload())
            api.post<Response>("reports/generate", payload)
                .then(({ data: r, status }) => {
                    if (status === 201) {
                        setActiveReportType(null);
                        setSelectedDrivers(new Set());
                        setSelectedTrackers(new Set());
                        setSelectedVehicles(new Set());
                        setCreateScreen(false);
                    } else {
                        setErrorMessage(r.message);
                    }
                })
                .catch(() => {
                    setErrorMessage("Hubo un error al generar el reporte");
                });
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
        if (driversData) if (driversData.length > 0) setVehicleGroups(driversData);
    }, [driversData]);

    useEffect(() => {
        if (vehiclesData) if (vehiclesData.length > 0) setDriverGroups(vehiclesData);
    }, [vehiclesData]);

    useEffect(() => {
        setPayloadValid(validatePayload());
    }, [payload]);

    return (
        <div>
            <Transition show={true} {...scaleAnimationProps}>

                <h1 className='mb-2 text-lg font-medium text-brand-dark-gray'>Listado de reportes</h1>
                <div className='w-full bg-white shadow rounded-xl p-2 h-[80dvh] max-h-[80dvh]'>
                    <Tab.Group as={Fragment}>
                        <div className='grid grid-cols-[350px_auto] gap-x-4 h-full box-border'>
                            <div className='relative flex flex-col object-contain h-full overflow-hidden border divide-y rounded-xl'>
                                <Tab.List>
                                    <div className='grid grid-cols-2 *:w-full *:h-full min-h-10 divide-x *:transition font-medium *:border-b'>
                                        {[
                                            { label: "Reportes", active: true },
                                            { label: "Horario", active: false },
                                        ].map((title, titleIdx) => (
                                            <Tab
                                                disabled={!title.active}
                                                key={titleIdx}
                                                className={({ selected, disabled }) =>
                                                    cn(
                                                        "hover:bg-gray-100 outline-none focus-visible:bg-gray-100",
                                                        selected && "text-brand-blue border-b-brand-blue",
                                                        disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
                                                    )
                                                }>
                                                {title.label}
                                            </Tab>
                                        ))}
                                    </div>
                                </Tab.List>
                                <Tab.Panels as={Fragment}>
                                    <Tab.Panel as={Fragment}>
                                        <>
                                            <Transition show={!createScreen} {...appearAnimationProps} className="overflow-y-auto">
                                                <ReportListScreen
                                                    setActiveReport={setActiveReport}
                                                    setCreateScreen={setCreateScreen}
                                                    reports={reports}
                                                    isLoadingReports={isLoadingReports}
                                                    hasLoadedOnce={hasLoadedOnce}
                                                    refetchReports={refetchReports}
                                                    isError={isError}
                                                    filter={filter}
                                                    activeReport={activeReport}
                                                    setFilter={setFilter}
                                                />
                                            </Transition>
                                            <Transition
                                                show={createScreen}
                                                {...appearAnimationProps}
                                                enter='transition-all duration-500'
                                                leave='transition-all duration-500'
                                                className="absolute w-full h-full overflow-y-auto top-10 "    
                                            >
                                                <ReportCreateScreen
                                                    setActiveReportType={setActiveReportType}
                                                    setCreateScreen={setCreateScreen}
                                                    filter={filter}
                                                    setFilter={setFilter}
                                                    activeReportType={activeReportType}
                                                />
                                            </Transition>
                                        </>
                                    </Tab.Panel>
                                    <Tab.Panel className={"relative h-full"}>
                                        <div className='absolute inset-0 m-auto'>Por implementar</div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </div>
                            <div className='box-border w-full overflow-hidden border rounded-xl'>
                                <>
                                    {activeReport && !activeReportType ? (
                                        <ReportPreview activeReport={activeReport} setActiveReport={setActiveReport} refetch={refetchReports} />
                                    ) : activeReportType && !activeReport ? (
                                        <div className='grid h-full grid-cols-[0.5fr_1fr] divide-x overflow-hidden'>
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
                                                selectedTrackers={selectedTrackers}
                                                selectedVehicles={selectedVehicles}
                                                selectedDrivers={selectedDrivers}
                                                setSelectedTrackers={setSelectedTrackers}
                                                setSelectedVehicles={setSelectedVehicles}
                                                setSelectedDrivers={setSelectedDrivers}
                                                allTrackerIds={allTrackerIds}
                                                isAllSelected={isAllSelected}
                                                filterItem={filterItem}
                                                setFilterItem={setFilterItem}
                                                isIndeterminate={isIndeterminate}
                                            />
                                            <ReportCreateForm
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
                                            <div className='flex items-center justify-center h-full col-span-2 text-xl font-medium text-center text-slate-800'>
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
