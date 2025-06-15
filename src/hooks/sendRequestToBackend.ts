import * as Sentry from '@sentry/react-native';
import {getItem} from './common';
import {API_ADDRESS, EMAIL_ADDRESS} from '@constants/api-routes';
import {STORAGE_KEYS} from '@constants/storage-keys';

type PropsType = {
    url: string;
    data?: RequestInit;
    onError?: () => void;
    isEmail?: boolean;
    isPost?: boolean;
};

export const sendPostRequest = async (url: string, body?: object, isEmail?: boolean) => {
    try {
        return await sendRequestToBackend({
            url,
            data: {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body || {}),
            },
            isEmail: Boolean(isEmail),
        });
    } catch {}
};

const fetch_retry = (url: string, options: RequestInit, n: number): Promise<Response> =>
    fetch(url, options).catch(function (error) {
        if (n === 1) throw error;
        return fetch_retry(url, options, n - 1);
    });

export const sendRequestToBackend = async ({url, data, onError, isEmail}: PropsType) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const authKey = getItem(STORAGE_KEYS.authKey);
    try {
        const res = await fetch_retry(
            `${isEmail ? EMAIL_ADDRESS : API_ADDRESS}/${url}`,
            {
                ...data,
                headers: {...data?.headers, Authorization: `Bearer ${authKey}`},
                signal: controller.signal,
            },
            3,
        );
        return res;
    } catch {
        Sentry.captureMessage('Unable to connect to API server');
        if (onError) onError();
    } finally {
        clearTimeout(timeoutId);
    }
};
