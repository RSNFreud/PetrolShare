import {put, takeLatest} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import {router} from 'expo-router';
import {register, setName, showSuccessPopup} from '../reducers/register';
import {setPersistData} from 'src/reducers/userPersistData';

function* openRegisterPopup() {
    yield router.replace('/');
    yield put(showSuccessPopup());
}

function* storeUserData(
    action: PayloadAction<void, string, {arg: {emailAddress: string; fullName: string}}>,
) {
    const {emailAddress, fullName} = action.meta.arg;
    yield put(setPersistData({emailAddress}));
    yield put(setName(fullName));
}

export default function* registerSaga() {
    yield takeLatest(register.pending.type, storeUserData);
    yield takeLatest(register.fulfilled.type, openRegisterPopup);
}
