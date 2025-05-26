import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { MultiValue } from "react-select";
import { useFetch } from "@hooks/useFetch";
import { useEffect, useState } from "react";
import AsyncSelectComponent from "./async-select";

export default function ListOfAlerts({ setNotificationsQuery }: { setNotificationsQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>; }) {
    const { data, isLoading } = useFetch<Option[]>("/notifications/rules");
    const [alerts, setAlerts] = useState<Option[]>([{ value: "all", label: "Todas" }]);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([alerts[0]]);

    useEffect(() => {
        if (data) setAlerts((prev) => [...prev, ...data]);
    }, [data]);

    function onChange(e: MultiValue<Option>) {
        const allOption = alerts[0];
        
        if (!e || e.length === 0) {
            setSelectedOptions([allOption]);
        } else {
            const isAllSelected = e.some((opt) => opt.value === allOption.value);
            const isNewSelectedAll = e[e.length-1].value == allOption.value;
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
            setNotificationsQuery(newSelection.map((option) => option.value));
        }
    }

    const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
        const filtered = alerts.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()));
        callback(filtered);
    };
    return (
        <AsyncSelectComponent
            isLoading={isLoading}
            defaultOptions={alerts.slice(undefined, 21)}
            data={alerts}
            value={selectedOptions}
            loadOptions={loadOptions}
            onChange={onChange}
        />
    );
}
