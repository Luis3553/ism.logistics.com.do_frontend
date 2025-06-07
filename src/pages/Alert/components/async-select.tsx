import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import AsyncSelect from "react-select/async";
import { GroupBase, MultiValue, StylesConfig } from "react-select";

const styles: StylesConfig<Option, true, GroupBase<Option>> = {
    container: (base) => ({
        ...base,
        borderRadius: 10,
        transition: "all",
        outline: "1px solid var(--light-gray)",
        ":focus-visible": {
            outline: "2px solid var(--blue)",
        },
        ":focus-within": {
            outline: "2px solid var(--blue)",
        },
    }),
    valueContainer: (base) => ({
        ...base,
        maxHeight: 80,
        overflowY: "auto",
    }),
    multiValue: (base) => ({
        ...base,
        borderRadius: 10,
        backgroundColor: "var(--light-blue)",
        color: "var(--blue)",
        border: "1px solid var(--blue)",
        padding: "0 0 0 5px",
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: "inherit",
        fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
        ...base,
        borderRadius: 9,
    }),
    control: (base) => ({
        ...base,
        border: "none",
        borderRadius: 10,
        padding: "none",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    }),
    clearIndicator: (base) => ({
        ...base,
        padding: "0 10px",
    }),
};

export default function AsyncSelectComponent(
    { 
        isLoading,
        data,
        placeholder,
        defaultOptions,
        value,
        loadOptions,
        onChange,
     }: { 
        data: Array<Option>; 
        isLoading: boolean; 
        placeholder?: string; 
        value: MultiValue<Option>;
        defaultOptions: Array<Option>;
        loadOptions: (inputValue: string, callback: (options: Option[]) => void) => void;
        onChange: (e: MultiValue<Option>) => void;
    }
) {
    return (
        <AsyncSelect
            isMulti
            isSearchable
            cacheOptions
            className='w-full min-w-60 caret-brand-blue'
            placeholder={placeholder}
            isLoading={isLoading}
            isClearable={false}
            defaultValue={data[0]}
            defaultOptions={defaultOptions}
            options={data}
            loadingMessage={() => "Cargando..."}
            noOptionsMessage={() => "No hay resultados"}
            value={value}
            loadOptions={loadOptions}
            onChange={onChange}
            styles={styles}
            escapeClearsValue
        />
    );
}
