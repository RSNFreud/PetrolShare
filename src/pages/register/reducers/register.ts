import {ENDPOINTS} from '@constants/api-routes';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';

export const register = createAsyncThunk<
    ResponseType | undefined,
    {emailAddress: string; password: string; name: string}
>('REGISTER@REGISTER_USER', async ({emailAddress, password, name}) => {
    const response = await sendPostRequest(ENDPOINTS.REGISTER, {
        emailAddress,
        password,
        name,
    });

    if (response?.ok) {
        return await response.json();
    }

    const errorMessage = await response?.text();

    throw new Error(
        errorMessage ||
            'We are having trouble connecting to our authentication servers. Please try again later...',
    );
});
