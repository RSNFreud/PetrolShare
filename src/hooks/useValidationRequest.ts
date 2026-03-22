import {sendPostRequest} from './sendRequestToBackend';
import {useState} from 'react';

export const useValidationRequest = () => {
    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = async (url: string, body: object) => {
        setIsLoading(true);
        const res = await sendPostRequest(url, body);
        setIsLoading(false);
        return res;
    };

    return {sendRequest, isLoading};
};
