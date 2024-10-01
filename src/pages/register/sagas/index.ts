import {put, takeLatest} from 'redux-saga/effects';
import {register} from '../reducers/register';
import {PayloadAction} from '@reduxjs/toolkit';
import {setPersistData} from 'src/reducers/userPersistData';

function* openRegisterPopup() {}

function* storeUserData(action: PayloadAction<void, string, {arg: {emailAddress: string}}>) {
    const {emailAddress} = action.meta.arg;
    yield put(setPersistData({emailAddress}));
}

export default function* registerSaga() {
    yield takeLatest(register.pending.type, storeUserData);
    yield takeLatest(register.fulfilled.type, openRegisterPopup);
}
