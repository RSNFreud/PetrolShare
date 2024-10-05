import {STORAGE_KEYS} from '@constants/storage-keys';
import {router} from 'expo-router';
import {all, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {deleteItem, setItem} from 'src/hooks/common';
import {registerForPushNotificationsAsync} from 'src/hooks/notifications';
import {fetchSelf, login, logOut} from '../reducers/auth';
import {PayloadAction} from '@reduxjs/toolkit';
import {setPersistData} from 'src/reducers/userPersistData';

function* registerNotifs({payload}: ReturnType<typeof login.fulfilled>) {
    const email = payload?.emailAddress;
    if (email) yield registerForPushNotificationsAsync(email);
}

function* saveAuthKey({payload}: ReturnType<typeof login.fulfilled>) {
    const authKey = payload?.authenticationKey;
    if (authKey) setItem(STORAGE_KEYS.authKey, authKey);
}

function* deleteAuthKey() {
    yield deleteItem(STORAGE_KEYS.authKey);
}

function* redirectToHome() {
    yield router.replace('/');
}

function* handleLoginFulfilled(result: ReturnType<typeof login.fulfilled>) {
    yield all([registerNotifs(result), saveAuthKey(result), redirectToHome()]);
}

function* storeUserData(
    action: PayloadAction<void, string, {arg: {emailAddress: string; password: string}}>,
) {
    const {emailAddress} = action.meta.arg;
    yield put(setPersistData({emailAddress}));
}

export default function* authSaga() {
    yield takeLatest(login.pending.type, storeUserData);
    yield put(fetchSelf());
    yield all([
        takeLatest(login.fulfilled.type, handleLoginFulfilled),
        takeEvery(fetchSelf.fulfilled.type, handleLoginFulfilled),
        takeLatest(logOut, deleteAuthKey),
    ]);
}