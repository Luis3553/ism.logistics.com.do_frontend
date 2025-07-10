import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { MultiValue } from "react-select";
import { useEffect, useState } from "react";
import AsyncSelectComponent from "../../../components/async-select";

export default function ListOfTrackers({
    data,
    isLoading,
    setGroupsQuery,
}: {
    data: Option[];
    isLoading: boolean;
    setGroupsQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>;
}) {
    const [groups, setGroups] = useState<Option[]>([{ value: "all", label: "Todos" }]);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([groups[0]]);

    useEffect(() => {
        if (data) setGroups((prev) => [...prev, ...data]);
    }, [data]);

    function onChange(e: MultiValue<Option>) {
        const allOption = groups[0];

        if (!e || e.length === 0) {
            setSelectedOptions([allOption]);
        } else {
            const isAllSelected = e.some((opt) => opt.value === allOption.value);
            const isNewSelectedAll = e[e.length - 1].value == allOption.value;
            const wasAllSelected = selectedOptions.some((opt) => opt.value === allOption.value);

            let newSelection: MultiValue<Option>;

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
            setGroupsQuery(newSelection.map((option) => Number(option.value)));
        }
    }

    const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
        const filtered = groups.filter((opt) => String(opt.label).toLowerCase().includes(inputValue.toLowerCase()));
        callback(filtered);
    };
    return (
        <AsyncSelectComponent
            isLoading={isLoading}
            defaultOptions={groups.slice(undefined, 21)}
            data={groups}
            value={selectedOptions}
            loadOptions={loadOptions}
            onChange={onChange}
        />
    );
}
