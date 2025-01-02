import {useQuery} from '@tanstack/react-query';
import {GetMemberType} from './constants';
import {ENDPOINTS} from '@constants/endpoints';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export const useMemberRequest = (userID: string, active: boolean) => {
    const {data} = useQuery({
        queryKey: ['GET_MEMBERS'],
        enabled: active,
        queryFn: async () => {
            const res = await sendRequestToBackend({
                url: `${ENDPOINTS.GET_MEMBERS}`,
            });

            if (res?.ok) {
                const data = (await res.json()) as GetMemberType;

                return data
                    .filter(data => String(data.userID) !== String(userID))
                    .map(data => ({
                        value: String(data.userID),
                        label: data.fullName,
                    }));
            }
            return [];
        },
        refetchInterval: 10000,
    });
    return data;
};
