import { useQuery } from "@tanstack/react-query";
import api from "./index";

type Employee = {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    [any: string]: any; // Allow additional properties
}

const fetchEmployees = async () => {
    const { data } = await api.post("/employee/list", {});
    return data.list as Employee[];
};

const useEmployeesQuery = () => {
    return useQuery<Employee[], Error>({
        queryKey: ["/employee/list"],
        queryFn: () => fetchEmployees(),
        retry: 3,
        staleTime: 5000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};

export { fetchEmployees, useEmployeesQuery };
