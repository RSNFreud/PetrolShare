import {createAction, createReducer} from '@reduxjs/toolkit';

type OdometerType = {
    odometerStart: number;
    recoverMessageShown: boolean;
};

const initialState: OdometerType = {
    recoverMessageShown: false,
    odometerStart: 0,
};
export const setOdometerData = createAction<Partial<OdometerType>>('SET_ODOMETER_DATA');

export const odometerData = createReducer<OdometerType>(initialState, builder => {
    builder.addCase(setOdometerData, (state, {payload}) => ({...state, ...payload}));
});
