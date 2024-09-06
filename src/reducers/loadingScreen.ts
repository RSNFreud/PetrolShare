import {createAction, createReducer} from '@reduxjs/toolkit';

const initialState = true;

export const setLoading = createAction<boolean>('SET_LOADING');

export const loadingScreen = createReducer<boolean>(initialState, builder => {
    builder.addCase(setLoading, (state, {payload}) => payload);
});
