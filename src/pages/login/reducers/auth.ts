import {createAction, createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {sendPostRequest, sendRequestToBackend} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/endpoints';
import {setItem} from 'src/hooks/common';
import {STORAGE_KEYS} from '@constants/storage-keys';

const initialState: UserType = {
    isLoading: false,
    emailAddress: '',
    fullName: '',
    currentMileage: '',
    groupID: '',
    error: '',
    userID: '',
    distance: '',
};

type ResponseType = {
    emailAddress: string;
    fullName: string;
    userID: string;
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
>('LOGIN@AUTH', async ({emailAddress, password}) => {
    const response = await sendPostRequest(ENDPOINTS.LOGIN, {
        emailAddress,
        password,
    });

    if (response?.ok) {
        const data = await response.json();
        setItem(STORAGE_KEYS.authKey, data?.authenticationKey);
        return data;
    }

    const errorMessage = await response?.text();

    throw new Error(
        errorMessage ||
            'We are having trouble connecting to our authentication servers. Please try again later...',
    );
});

export const fetchData = createAsyncThunk<ResponseType | undefined>('FETCH_DATA', async () => {
    const response = await sendRequestToBackend({
        url: ENDPOINTS.GET_DATA,
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

export const fetchSelf = createAsyncThunk<ResponseType | undefined>('FETCH_SELF@AUTH', async () => {
    const response = await sendRequestToBackend({
        url: ENDPOINTS.GET_DATA,
    });

    if (response?.ok) {
        return {...(await response.json())};
    }

    const errorMessage = await response?.text();

    throw new Error(
        errorMessage ||
            'We are having trouble connecting to our authentication servers. Please try again later...',
    );
});

export const updateData = createAction<void>('UPDATE_DATA');
export const resetError = createAction<void>('RESET_ERROR');
export const logOut = createAction<void>('LOGOUT');

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
        .addCase(logOut, () => initialState)
        .addCase(login.rejected, (state, action) => ({
            ...state,
            isLoading: false,
            error:
                action.error.message ||
                'We are having trouble connecting to our authentication servers. Please try again later...',
        }))
        .addCase(fetchSelf.rejected, (state, action) => ({
            ...state,
            isLoading: false,
            error:
                action.error.message ||
                'We are having trouble connecting to our authentication servers. Please try again later...',
        }))
        .addCase(login.fulfilled, (state, {payload}) => ({
            ...state,
            ...payload,
            isLoading: false,
            error: '',
        }))
        .addCase(fetchSelf.fulfilled, (state, {payload}) => ({
            ...state,
            ...payload,
            isLoading: false,
            error: '',
        }))
        .addCase(fetchData.fulfilled, (state, {payload}) => ({
            ...state,
            ...payload,
            isLoading: false,
            error: '',
        }));
});
