import { useCallback, useEffect, useState } from "react";
import api from "../api";

export const useFetch = <T>(path: string) => {
    const [data, setData] = useState<T>(null as T);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetcher = useCallback(async () => {
        setError(false);
        setIsLoading(true);
        try {
            const response = await api.get(path);
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`HTTP ERROR: ${response.status} ${response.statusText}`);
            }
            setData(response.data);
        } catch (e) {
            console.log("An error ocurred while fetching the data: " + e);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetcher();
    }, []);

    return { isLoading, data, fetcher, error, setData };
};
