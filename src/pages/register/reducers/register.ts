import {createAction, createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {ENDPOINTS} from '@constants/endpoints';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';

type RegisterUserPayload = {emailAddress: string; password: string; fullName: string};

type RegisterType = {
    isLoading: boolean;
    error: string;
    shouldShowSuccessPopup: boolean;
    name: string;
};

const initialState: RegisterType = {
    isLoading: false,
    error: '',
    shouldShowSuccessPopup: false,
    name: '',
};

export const register = createAsyncThunk<null | undefined, RegisterUserPayload>(
    'REGISTER@REGISTER_USER',
    async ({emailAddress, password, fullName}) => {
        const response = await sendPostRequest(ENDPOINTS.REGISTER, {
            emailAddress,
            password,
            fullName,
        });

        if (response?.ok) {
            return null;
        }

        const errorMessage = await response?.text();

        throw new Error(
            errorMessage ||
                'We are having trouble connecting to our authentication servers. Please try again later...',
        );
    },
);

export const setName = createAction<string>('REGISTER@SET_NAME');
export const resetSuccessPopup = createAction<void>('REGISTER@RESET_SUCCESS_POPUP');
export const showSuccessPopup = createAction<void>('REGISTER@SHOW_SUCCESS_POPUP');

export const registerReducer = createReducer<RegisterType>(initialState, builder => {
    builder
        .addCase(register.pending, state => ({
            ...state,
            isLoading: true,
        }))
        .addCase(setName, (state, {payload}) => ({
            ...state,
            name: payload,
        }))
        .addCase(resetSuccessPopup, state => ({
            ...state,
            shouldShowSuccessPopup: false,
        }))
        .addCase(showSuccessPopup, state => ({
            ...state,
            shouldShowSuccessPopup: true,
        }))
        .addCase(register.rejected, (state, action) => ({
            ...state,
            isLoading: false,
            error:
                action.error.message ||
                'We are having trouble connecting to our authentication servers. Please try again later...',
        }))
        .addCase(register.fulfilled, state => ({
            ...initialState,
            name: state.name,
            shouldShowSuccessPopup: true,
        }));
});
