import {useQuery} from '@tanstack/react-query';
import {GetMemberType} from './constants';
import {ENDPOINTS} from '@constants/api-routes';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export const useMemberRequest = (authKey: string, userID: string) => {
    const {data} = useQuery({
        queryKey: ['GET_MEMBERS'],
        queryFn: async () => {
            const res = await sendRequestToBackend({
                url: `${ENDPOINTS.GET_MEMBERS}?authenticationKey=${authKey}`,
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
        refetchInterval: 2000,
    });
    return data;
};
