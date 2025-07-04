import { Option } from "src/pages/Configuration/components/ListOfConfigurations";
import { MultiValue } from "react-select";
import { useFetch } from "@hooks/useFetch";
import { useEffect, useState } from "react";
import AsyncSelectComponent from "../../../components/async-select";

export default function ListOfTags({ setTagsQuery }: { setTagsQuery: React.Dispatch<React.SetStateAction<Array<number | string>>>; }) {
    const { data, isLoading } = useFetch<Option[]>("/notifications/tags");
    const [tags, setTags] = useState<Option[]>([{ value: "all", label: "Todos" }]);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([tags[0]]);
    
    useEffect(() => {
        if (data) setTags((prev) => [...prev, ...data]);
    }, [data]);

    function onChange(e: MultiValue<Option>) {
        const allOption = tags[0];
        
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
            setTagsQuery(newSelection.map((option) => option.value));
        }
    }

    const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
        const filtered = tags.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()));
        callback(filtered);
    };
    return (
        <AsyncSelectComponent
            isLoading={isLoading}
            defaultOptions={tags.slice(undefined, 21)}
            data={tags}
            value={selectedOptions}
            loadOptions={loadOptions}
            onChange={onChange}
        />
    );
}
