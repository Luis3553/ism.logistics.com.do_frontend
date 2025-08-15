import { useQuery } from "@tanstack/react-query";
import api from "./index";

type Tracker = {
    id: number;
    label: string;
    group_id: number;
    source: {
        id: number;
        device_id: string;
        model: string;
        phone: string | null;
    };
    tag_bindings: {
        tag_id: number;
        ordinal: number;
    }[];
    clone: boolean;
};

const fetchTrackers = async (): Promise<{ list: Tracker[] }> => {
    const { data } = await api.post<{ list: Tracker[] }>("/tracker/list", {});
    return data;
};

const useTrackersQuery = () => {
    return useQuery<{ list: Tracker[] }, Error>({
        queryKey: ["/tracker/list"],
        queryFn: () => fetchTrackers(),
        retry: 3,
        staleTime: 5000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};

export { fetchTrackers, useTrackersQuery };
