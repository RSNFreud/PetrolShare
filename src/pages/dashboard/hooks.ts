import {ENDPOINTS} from '@constants/api-routes';
import {GetMemberType} from './constants';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export const getMembers = async (
    authKey: string,
    userID: string,
): Promise<{value: string; label: string}[]> => {
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
};
