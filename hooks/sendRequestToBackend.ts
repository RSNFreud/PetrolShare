import {API_ADDRESS, EMAIL_ADRESS} from '@constants';
import * as Sentry from '@sentry/react-native';

type PropsType = {
    url: string;
    data?: RequestInit;
    onError?: () => void;
    isEmail?: boolean;
};

export const sendRequestToBackend = async ({url, data, onError, isEmail}: PropsType) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
        const res = await fetch(`${isEmail ? EMAIL_ADRESS : API_ADDRESS}/${url}`, {
            ...data,
            signal: controller.signal,
        });
        return res;
    } catch {
        Sentry.captureMessage('Unable to connect to API server');
        if (onError) onError();
    } finally {
        clearTimeout(timeoutId);
    }
};
