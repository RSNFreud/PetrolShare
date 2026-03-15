import {router} from 'expo-router';
import {all, call, delay, fork, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import {fetchData, fetchSelf, login, logOut, updateData} from '../reducers/auth';
import {STORAGE_KEYS} from '@constants/storage-keys';
import {deleteItem, getItem} from 'src/hooks/common';
import {registerForPushNotificationsAsync} from 'src/hooks/notifications';
import {setPersistData} from 'src/reducers/userPersistData';
import {setLoading} from 'src/reducers/loadingScreen';

function* registerNotifs({payload}: ReturnType<typeof login.fulfilled>) {
    const email = payload?.emailAddress;
    if (email) yield registerForPushNotificationsAsync(email);
}

function* deleteAuthKey() {
    yield deleteItem(STORAGE_KEYS.authKey);
}

function* redirectToHome() {
    delay(200);
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

function* fetchSelfData() {
    const authKey = getItem(STORAGE_KEYS.authKey);

    if (!authKey) {
        yield put(setLoading(false));
        return;
    }

    yield put(fetchSelf());
}

export default function* authSaga() {
    yield takeLatest(login.pending.type, storeUserData);
    yield takeLatest(updateData, getUpdatedData);
    yield all([
        takeLatest(login.fulfilled.type, handleLoginFulfilled),
        takeEvery(fetchSelf.fulfilled.type, handleLoginFulfilled),
        takeLatest(logOut, deleteAuthKey),
        fork(fetchSelfData),
    ]);
}
