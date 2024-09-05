import {ENDPOINTS} from '@constants/api-routes';
import {createAction, createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';

const initialState: UserType = {
    isLoading: false,
    emailAddress: '',
    fullName: '',
    authenticationKey: '',
    currentMileage: '',
    groupID: '',
    error: '',
};

type ResponseType = {
    emailAddress: string;
    fullName: string;
    authenticationKey: string;
    currentMileage: string;
    groupID: string;
    distance?: string;
    petrol?: string;
    currency?: string;
    premium?: number;
};

export type UserType = ResponseType & {
    isLoading: boolean;
    error: string;
};

export const login = createAsyncThunk<
    ResponseType | undefined,
    {emailAddress: string; password: string}
>('auth/login', async ({emailAddress, password}) => {
    const response = await sendPostRequest(ENDPOINTS.LOGIN, {
        emailAddress,
        password,
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

export const resetError = createAction<void>('RESET_ERROR');

export const auth = createReducer<UserType>(initialState, builder => {
    builder
        .addCase(login.pending, state => ({
            ...state,
            isLoading: true,
            error: '',
        }))
        .addCase(resetError, state => ({
            ...state,
            error: '',
        }))
        .addCase(login.rejected, (state, action) => ({
            ...state,
            isLoading: false,
            error:
                action.error.message ||
                'We are having trouble connecting to our authentication servers. Please try again later...',
        }))
        .addCase(login.fulfilled, state => ({
            ...state,
            isLoading: false,
            error: '',
        }));
});
