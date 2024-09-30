import {ENDPOINTS} from '@constants/api-routes';
import {createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';

type RegisterUserPayload = {emailAddress: string; password: string; fullName: string};

type RegisterType = {
    isLoading: boolean;
    error: string;
    shouldShowSuccessPopup: boolean;
};

const initialState: RegisterType = {
    isLoading: false,
    error: '',
    shouldShowSuccessPopup: false,
};

export const register = createAsyncThunk<ResponseType | undefined, RegisterUserPayload>(
    'REGISTER@REGISTER_USER',
    async ({emailAddress, password, fullName}) => {
        const response = await sendPostRequest(ENDPOINTS.REGISTER, {
            emailAddress,
            password,
            fullName,
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

export const registerReducer = createReducer<RegisterType>(initialState, builder => {
    builder
        .addCase(register.pending, state => ({
            ...state,
            isLoading: true,
            error: '',
        }))
        .addCase(register.rejected, (state, action) => ({
            ...state,
            isLoading: false,
            error:
                action.error.message ||
                'We are having trouble connecting to our authentication servers. Please try again later...',
        }))
        .addCase(register.fulfilled, () => ({
            ...initialState,
            shouldShowSuccessPopup: true,
        }));
});
