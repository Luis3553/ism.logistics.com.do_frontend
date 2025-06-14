import { useQuery, UseQueryResult } from "@tanstack/react-query";
import api from "@api/index";

export const fetchApi = async ({ queryKey }: any) => {
    const [route, params] = queryKey;
    const { data } = await api.get(route, { params });
    return data;
};

export const useApiQuery = <T = any>(
    route: string,
    options: {
        interval?: number | false;
        disable?: boolean;
        retry?: number | false;
        staleTime?: number;
        params?: Record<string, any>;
    },
): UseQueryResult<T, Error> => {
    return useQuery<T, Error>({
        queryKey: [route, options.params ?? {}],
        queryFn: fetchApi,
        refetchInterval: options.interval ?? false,
        enabled: !options.disable,
        retry: options.retry,
        refetchOnWindowFocus: true,
        staleTime: options.staleTime ?? Infinity, 
    });
};
