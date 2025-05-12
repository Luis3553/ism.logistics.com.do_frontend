import { useState } from "react";

export const useNestedExpansion = () => {
    const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});

    const toggle = (key: string) => {
        setExpandedLevels((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return {
        expandedLevels,
        toggle,
    };
};
