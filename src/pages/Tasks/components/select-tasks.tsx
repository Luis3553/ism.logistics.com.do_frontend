import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { MultiValue } from "react-select";
import { useState } from "react";
import AsyncSelectComponent from "../../../components/async-select";

export default function ListOfTasks({
    data,
    isLoading,
    setTasksQuery,
}: {
    data: Option[];
    isLoading: boolean;
    setTasksQuery: React.Dispatch<React.SetStateAction<Array<Option>>>;
}) {
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([{ value: "all", label: "Todos" }]);

    function onChange(e: MultiValue<Option>) {
        const allOption = data[0];
        let newSelection: MultiValue<Option>;

        if (!e || e.length === 0) {
            newSelection = [allOption];
        } else {
            const isAllSelected = e.some((opt) => opt.value === allOption.value);
            const isNewSelectedAll = e[e.length - 1].value == allOption.value;
            const wasAllSelected = selectedOptions.some((opt) => opt.value === allOption.value);


            if (isAllSelected && !wasAllSelected) {
                // "Todos" just got selected after others: override everything
                newSelection = [allOption];
            } else if (isAllSelected && !isNewSelectedAll) {
                // Other option selected while "Todos" is already selected: remove "Todos"
                newSelection = e.filter((opt) => opt.value !== allOption.value);
            } else {
                // Normal multi-select behavior
                newSelection = e;
            }
            setSelectedOptions(newSelection);
            setTasksQuery(newSelection.map((option) => option));
        }
    }

    const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
        const filtered = data.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()));
        callback(filtered);
    };
    return (
        <AsyncSelectComponent
            isLoading={isLoading}
            defaultOptions={data.slice(undefined, 21)}
            data={data}
            value={selectedOptions}
            loadOptions={loadOptions}
            onChange={onChange}
        />
    );
}
