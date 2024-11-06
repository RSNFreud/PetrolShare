import {ENDPOINTS} from '@constants/api-routes';
import {STORAGE_KEYS} from '@constants/storage-keys';
import {createAction, createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {getItem} from 'src/hooks/common';
import {sendPostRequest, sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

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
>('LOGIN@AUTH', async ({emailAddress, password}) => {
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

export const fetchData = createAsyncThunk<ResponseType | undefined, {authenticationKey: string}>(
    'FETCH_DATA',
    async ({authenticationKey}) => {
        const response = await sendRequestToBackend({
            url: `${ENDPOINTS.GET_DATA}?authenticationKey=${authenticationKey}`,
        });

        if (response?.ok) {
            return await response.json();
        }

        const errorMessage = await response?.text();

        throw new Error(
            errorMessage ||
                'We are having trouble connecting to our authentication servers. Please try again later...',
        );
    },
);

export const fetchSelf = createAsyncThunk<ResponseType | undefined>('FETCH_SELF@AUTH', async () => {
    const authKey = getItem(STORAGE_KEYS.authKey);

    if (!authKey) return {};

    const response = await sendRequestToBackend({
        url: `${ENDPOINTS.VERIFY_KEY}?authenticationKey=${authKey}`,
    });

    if (response?.ok) {
        return {...(await response.json()), authenticationKey: authKey};
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
