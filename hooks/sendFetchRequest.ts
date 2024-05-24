import {postHeaders} from '@constants';

import {sendRequestToBackend} from './sendRequestToBackend';

export const sendPostRequest = async (url: string, body: object, isEmail?: boolean) => {
    try {
        return await sendRequestToBackend({
            url,
            data: {
                ...postHeaders,
                body: JSON.stringify(body),
            },
            isEmail: Boolean(isEmail),
        });
    } catch {}
};
