import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { MultiValue } from "react-select";
import { useEffect, useState } from "react";
import AsyncSelectComponent from "./async-select";

export default function ListOfTrackers({
    data,
    isLoading,
    setTrackersQuery,
}: {
    data: Option[];
    isLoading: boolean;
    setTrackersQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>;
}) {
    const [trackers, setTrackers] = useState<Option[]>([{ value: "all", label: "Todos" }]);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([trackers[0]]);

    useEffect(() => {
        if (data) setTrackers((prev) => [...prev, ...data]);
    }, [data]);

    function onChange(e: MultiValue<Option>) {
        const allOption = trackers[0];
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
            setTrackersQuery(newSelection.map((option) => option.value));
        }
    }

    const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
        const filtered = trackers.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()));
        callback(filtered);
    };
    return (
        <AsyncSelectComponent
            isLoading={isLoading}
            defaultOptions={trackers.slice(undefined, 21)}
            data={trackers}
            value={selectedOptions}
            loadOptions={loadOptions}
            onChange={onChange}
        />
    );
}
