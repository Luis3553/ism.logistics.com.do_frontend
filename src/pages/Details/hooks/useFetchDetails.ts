import { useEffect, useState } from "react";
import axios from "../../../api";

const endpoints = ["/report_1", "/report_2", "/report_3"];

export const useFetchDetails = (date: string) => {
    const [structure, setStructure] = useState({
        report_1: {},
        report_2: {},
        report_3: {},
    });

    useEffect(() => {
        endpoints.forEach(async (endpoint) => {
            const data = await axios.get(`${endpoint}?date=${date}`);
            setStructure((prev) => ({ ...prev, ...data }));
        });
    }, [date]);

    return structure;
};
