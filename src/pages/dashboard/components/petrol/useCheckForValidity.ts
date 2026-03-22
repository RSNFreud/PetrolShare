import {ENDPOINTS} from '@constants/endpoints';
import {useEffect, useState} from 'react';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export enum FormState {
    DEFAULT = 0,
    LOADING = 1,
    VALID = 2,
    INVALID = 3,
}

export const useCheckForValidity = () => {
    const [formState, setFormState] = useState(FormState.DEFAULT);

    const sendRequest = async () => {
        setFormState(FormState.LOADING);
        const res = await sendRequestToBackend({url: ENDPOINTS.CHECK_VALIDITY});
        if (!res?.ok) {
            throw new Error(`Failed to fetch petrol validation`);
        }
        const valid = (await res.text()) === 'true';

        setFormState(valid ? FormState.VALID : FormState.INVALID);
    };

    useEffect(() => {
        sendRequest();
    }, []);

    return formState;
};
