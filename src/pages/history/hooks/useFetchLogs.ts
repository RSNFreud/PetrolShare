import {useQuery} from '@tanstack/react-query';
import {ENDPOINTS} from '@constants/endpoints';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export type FlatSession = {
    sessionID: string;
    sessionActive?: boolean;
    sessionStart?: string;
    sessionEnd?: string;
    logs: {
        fullName: string;
        distance: number;
        date: string;
        logID: string;
        pending: boolean;
        userID: string;
    }[];
};

export const useFetchLogs = () => {
    return useQuery({
        queryKey: ['logs'],
        queryFn: async () => {
            const res = await sendRequestToBackend({url: ENDPOINTS.GET_LOGS});
            if (res?.ok) {
                return (await res.json()) as FlatSession[];
            }
        },
        refetchOnMount: true,
    });
};
