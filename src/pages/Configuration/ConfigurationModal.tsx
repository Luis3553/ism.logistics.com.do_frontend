import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import api from "../../api";
import { ConfigurationItem, ListOfConfigurations, Option } from "./components/ListOfConfigurations";

// Types
type ConfigurationModalProps = {
    onClose: () => void;
};

export const ConfigurationModal = ({ onClose }: ConfigurationModalProps) => {
    // Data fetching & Loading State;
    const {
        data: configurations,
        isLoading: areConfiguratinosLoading,
        setData: setConfigurations,
        error: configErrror,
    } = useFetch<ConfigurationItem[]>("/user/geofence_configurations");
    const { data: initialOptions, isLoading: isDefaultOptionsLoading } = useFetch<Option[]>("/user/geofences");

    // Keep track of deleted Ids
    const [deletedIds, setDeletedIds] = useState<number[]>([]);

    // Saving Config State
    const [isConfigSaving, setIsConfigSaving] = useState(false);

    // Handle all the selects of the configurations
    const handleSelectChange = (id: number, type: "origin" | "destiny", selected: Option[]) => {
        const allSelected = selected.some((option) => option.value === "all");
        const newSelection = allSelected ? [{ value: "all", label: "Todos" }] : selected.filter((option) => option.value !== "all");

        setConfigurations((prev) => prev.map((record) => (record.id === id ? { ...record, [type]: newSelection } : record)));
    };

    const addRecord = () => {
        setConfigurations((prev) => {
            const nextTempId = prev.reduce((acc, r) => (r.id < acc ? r.id : acc), 0) - 1;
            return [...prev, { id: nextTempId, origin: [], destiny: [] }];
        });
    };

    const deleteRecord = (id: number) => {
        setConfigurations((prev) => prev.filter((r) => r.id !== id));
        setDeletedIds((prev) => [...prev, id]);
    };

    const saveConfig = async () => {
        const existing = configurations.filter((r) => r.id > 0);
        const newOnes = configurations.filter((r) => r.id < 0);

        try {
            setIsConfigSaving(true);

            // Update exxisting configs
            if (existing.length) {
                await api.post("/user/geofence_configurations/bulk_update", { configs: existing });
            }

            // Create new configs
            if (newOnes.length) {
                await api.post("/user/geofence_configurations/bulk_create", {
                    configs: newOnes.map(({ id, ...rest }) => rest),
                });
            }

            // Delete removed configs
            if (deletedIds.length) {
                await api.post("/user/geofence_configurations/bulk_delete", {
                    ids: deletedIds,
                });
            }

            setDeletedIds([]);

            alert("✅ Configuraciones guardadas correctamente.");
        } catch (error) {
            console.error("❌ Error al guardar configuraciones:", error);
            alert("Hubo un problema al guardar. Intente nuevamente.");
        } finally {
            setIsConfigSaving(false);
        }
    };

    return (
        <div className="w-full h-full grid grid-rows-[auto_auto_1fr_auto]">
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">Panel de configuración para viajes</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
                    <i className="text-2xl mgc_close_line"></i>
                </button>
            </div>
            <span className="text-gray-700 mb-4 text-sm">Seleccione geocercas de origen y destino para la contabilización de los viajes.</span>
            <div className="flex flex-col">
                <div className="grid grid-cols-[25px_1fr_1fr] gap-2 mb-2">
                    <label htmlFor="plant" className="text-sm font-medium col-start-2">
                        Origen de viajes
                    </label>
                    <label htmlFor="plant" className="text-sm font-medium">
                        Destino de viajes
                    </label>
                </div>
                <div className="overflow-y-auto h-full grow max-h-[350px]">
                    <ListOfConfigurations
                        isError={configErrror}
                        onDelete={deleteRecord}
                        isDefaultOptionsLoading={isDefaultOptionsLoading}
                        areConfiguratinosLoading={areConfiguratinosLoading}
                        configurations={configurations}
                        onSelectChange={handleSelectChange}
                        defaultOptions={initialOptions}
                    />
                </div>
            </div>
            <div className="flex w-full justify-between">
                <button
                    disabled={areConfiguratinosLoading || isDefaultOptionsLoading || isConfigSaving}
                    onClick={addRecord}
                    className="disabled:border-brand-blue/50 disabled:text-brand-blue/50 disabled:hover:text-white/50 disabled:cursor-wait flex mt-4 items-center justify-center gap-1 px-4 py-2 border-2 border-brand-blue rounded-sm text-brand-blue cursor-pointer hover:bg-brand-blue hover:text-white transition-all duration-200">
                    <i className="text-md mgc_add_circle_line"></i>Agregar
                </button>
                <button
                    disabled={areConfiguratinosLoading || isDefaultOptionsLoading || isConfigSaving}
                    onClick={saveConfig}
                    className="disabled:bg-brand-blue/50 disabled:cursor-wait mt-4 px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white rounded cursor-pointer">
                    Guardar
                </button>
            </div>
        </div>
    );
};
