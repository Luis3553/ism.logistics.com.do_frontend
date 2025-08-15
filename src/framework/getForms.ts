import { useQuery } from "@tanstack/react-query";
import api from "./index";
import { Report } from "@utils/types";

const fetchFormTemplates = async () => {
    const { data } = await api.post("/form/template/list", {});
    return data as { list: Report[] } ?? [];
};

const useFormTemplatesQuery = () => {
    return useQuery<{ list: Report[] }, Error>({
        queryKey: ["/form/template/list"],
        queryFn: () => fetchFormTemplates(),
        retry: 3,
        staleTime: 5000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};

export { fetchFormTemplates, useFormTemplatesQuery };
