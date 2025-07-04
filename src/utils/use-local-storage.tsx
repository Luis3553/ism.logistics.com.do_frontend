import { useState, useEffect } from "react";

export function useLocalStorage(key: string, initialValue: any) {
    const [localValue, setLocalValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue !== null ? storedValue : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(localValue));
    }, [key, localValue]);

    return [localValue, setLocalValue];
}
