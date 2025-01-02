import {useQuery} from '@tanstack/react-query';
import {ENDPOINTS} from '@constants/endpoints';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export const useFetchPresets = (): {
    data?: {distance: number; presetID: number; presetName: string}[];
    isLoading: boolean;
    refetch: () => void;
} => {
    const {data, refetch, isLoading} = useQuery({
        queryKey: ['PRESETS'],
        queryFn: async () => {
            const res = await sendRequestToBackend({
                url: ENDPOINTS.GET_PRESETS,
            });
            if (!res?.ok) {
                throw new Error(`Failed to fetch presets: ${res?.statusText || 'Unknown error'}`);
            }
            return await res.json();
        },
    });

    return {data, isLoading, refetch};
};
