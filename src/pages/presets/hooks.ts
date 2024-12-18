import {useQuery} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {ENDPOINTS} from '@constants/api-routes';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';
import {getAuthKey} from 'src/selectors/common';

export const useFetchPresets = (): {
    data?: {distance: number; presetID: number; presetName: string}[];
    isLoading: boolean;
    refetch: () => void;
} => {
    const authenticationKey = useSelector(getAuthKey);
    const {data, isLoading, refetch} = useQuery({
        enabled: Boolean(authenticationKey),
        queryKey: ['PRESETS'],
        queryFn: async () => {
            const res = await sendRequestToBackend({
                url: `${ENDPOINTS.GET_PRESETS}?authenticationKey=${authenticationKey}`,
            });
            if (!res?.ok) {
                throw new Error(`Failed to fetch presets: ${res?.statusText || 'Unknown error'}`);
            }
            return await res.json();
        },
    });

    return {data, isLoading, refetch};
};
