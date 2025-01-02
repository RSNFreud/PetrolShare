import {router} from 'expo-router';
import {all, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import {fetchData, fetchSelf, login, logOut, updateData} from '../reducers/auth';
import {STORAGE_KEYS} from '@constants/storage-keys';
import {deleteItem} from 'src/hooks/common';
import {registerForPushNotificationsAsync} from 'src/hooks/notifications';
import {setPersistData} from 'src/reducers/userPersistData';

function* registerNotifs({payload}: ReturnType<typeof login.fulfilled>) {
    const email = payload?.emailAddress;
    if (email) yield registerForPushNotificationsAsync(email);
}

function* deleteAuthKey() {
    yield deleteItem(STORAGE_KEYS.authKey);
}

function* redirectToHome() {
    yield router.replace('/');
}

function* handleLoginFulfilled(result: ReturnType<typeof login.fulfilled>) {
    yield all([registerNotifs(result), redirectToHome()]);
}

function* storeUserData(
    action: PayloadAction<void, string, {arg: {emailAddress: string; password: string}}>,
) {
    const {emailAddress} = action.meta.arg;
    yield put(setPersistData({emailAddress}));
}

function* getUpdatedData() {
    yield put(fetchData());
}

export default function* authSaga() {
    yield takeLatest(login.pending.type, storeUserData);
    yield takeLatest(updateData, getUpdatedData);
    yield put(fetchSelf());
    yield all([
        takeLatest(login.fulfilled.type, handleLoginFulfilled),
        takeEvery(fetchSelf.fulfilled.type, handleLoginFulfilled),
        takeLatest(logOut, deleteAuthKey),
    ]);
}
