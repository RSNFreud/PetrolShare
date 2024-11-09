import {createAction, createReducer} from '@reduxjs/toolkit';

type PersistDataType = {
    emailAddress: string;
    name: string;
    odometerStart: number;
};

const initialState: PersistDataType = {
    emailAddress: '',
    name: '',
    odometerStart: 0,
};
export const setPersistData = createAction<Partial<PersistDataType>>('SET_PERSIST_DATA');

export const userPersistData = createReducer<PersistDataType>(initialState, builder => {
    builder.addCase(setPersistData, (state, {payload}) => ({...state, ...payload}));
});
