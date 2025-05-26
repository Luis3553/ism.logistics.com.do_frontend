import AsyncSelect from "react-select/async";
import { debounce } from "lodash";
import React, { useMemo } from "react";
import { GroupBase, StylesConfig } from "react-select";
import { AxiosResponse } from "axios";
import { LoadSpinner } from "../../../components/LoadSpinner";
import api from "../../../api";

// types
export type Option = {
    value: number | string;
    label: string;
};

export type ConfigurationItem = {
    id: number;
    origin: Option[];
    destiny: Option[];
};

type ListOfConfigurationsProps = {
    configurations: ConfigurationItem[];
    onDelete: (id: number) => void;
    onSelectChange: (id: number, type: "origin" | "destiny", selected: Option[]) => void;
    defaultOptions: Option[];
    isDefaultOptionsLoading: boolean;
    isError: boolean;
    areConfiguratinosLoading: boolean;
};

export const ListOfConfigurations = ({
    configurations,
    onSelectChange,
    defaultOptions = [],
    isDefaultOptionsLoading,
    onDelete,
    isError,
    areConfiguratinosLoading,
}: ListOfConfigurationsProps) => {
    const styles: StylesConfig<Option, true, GroupBase<Option>> = {
        container: (base) => ({
            ...base,
            maxWidth: 350,
        }),
        valueContainer: (base) => ({
            ...base,
            maxHeight: 80,
            overflowY: "auto",
        }),
        menuList: (base: any) => ({
            ...base,
            maxHeight: 150,
            overflowY: "auto",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    const rawLoadOptions = async (inputValue: string): Promise<Option[]> => {
        let response: AxiosResponse<Option[]> = await api.get("/user/geofences", { params: { search: inputValue, limit: 1000 } });
        return response.data;
    };

    const loadOptions = useMemo(() => {
        const debounced = debounce((input: string, resolve: (options: Option[]) => void) => {
            rawLoadOptions(input).then(resolve);
        }, 500);

        return (input: string) =>
            new Promise<Option[]>((resolve) => {
                debounced(input, resolve);
            });
    }, []);

    return (
        <>
            {areConfiguratinosLoading ? (
                <div className="ps-4">
                    <LoadSpinner />
                </div>
            ) : isError ? (
                <div className="mx-auto mt-40 w-fit">Ocurrió un error</div>
            ) : (
                configurations.map((config) => (
                    <React.Fragment key={config.id}>
                        <div className="grid grid-cols-[25px_1fr_1fr] items-center gap-2 mb-4">
                            <div className="group relative size-[25px]" onClick={() => onDelete(config.id)}>
                                <i className="group-hover:invisible absolute visible mgc_close_square_line hover:mgc_close_square_fill text-2xl text-red-600 cursor-pointer"></i>
                                <i className="group-hover:visible absolute invisible mgc_close_square_fill text-2xl text-red-600 cursor-pointer"></i>
                            </div>
                            <AsyncSelect
                                isMulti
                                placeholder="Seleccione..."
                                defaultOptions={[{ value: "all", label: "Todos" }, ...(defaultOptions || [])]}
                                value={config.origin}
                                isDisabled={isDefaultOptionsLoading}
                                isLoading={isDefaultOptionsLoading}
                                styles={styles}
                                menuPortalTarget={document.body}
                                loadOptions={async (input) => {
                                    const isAllSelected = config.origin.some((opt) => opt.value === "all");
                                    if (isAllSelected) {
                                        return [{ value: "all", label: "Todos" }];
                                    }

                                    const options = await loadOptions(input);
                                    return [{ value: "all", label: "Todos" }, ...options];
                                }}
                                onChange={(val) => onSelectChange(config.id, "origin", val as Option[])}
                            />

                            <AsyncSelect
                                isMulti
                                placeholder="Seleccione..."
                                defaultOptions={[{ value: "all", label: "Todos" }, ...(defaultOptions || [])]}
                                value={config.destiny}
                                isDisabled={isDefaultOptionsLoading}
                                isLoading={isDefaultOptionsLoading}
                                styles={styles}
                                menuPortalTarget={document.body}
                                loadOptions={async (input) => {
                                    const isAllSelected = config.destiny.some((opt) => opt.value === "all");
                                    if (isAllSelected) {
                                        return [{ value: "all", label: "Todos" }];
                                    }

                                    const options = await loadOptions(input);
                                    return [{ value: "all", label: "Todos" }, ...options];
                                }}
                                onChange={(val) => onSelectChange(config.id, "destiny", val as Option[])}
                            />
                        </div>
                        <span className="border-b w-full border-gray-300 mb-4 block"></span>
                    </React.Fragment>
                ))
            )}
        </>
    );
};
