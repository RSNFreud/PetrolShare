import {STORAGE_KEYS} from '@constants/storage-keys';
import {router} from 'expo-router';
import {all, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {deleteItem, setItem} from 'src/hooks/common';
import {registerForPushNotificationsAsync} from 'src/hooks/notifications';
import {fetchSelf, login, logOut} from 'src/reducers/auth';

function* registerNotifs({payload}: ReturnType<typeof login.fulfilled>) {
    if (!payload || !payload.emailAddress) return;
    registerForPushNotificationsAsync(payload.emailAddress);
}

function* saveAuthKey({payload}: ReturnType<typeof login.fulfilled>) {
    if (!payload || !payload.authenticationKey) return;
    setItem(STORAGE_KEYS.authKey, payload.authenticationKey);
}

function* deleteAuthKey() {
    deleteItem(STORAGE_KEYS.authKey);
}

function* redirectToHome() {
    router.replace('/');
}

function* handleLoginFulfilled(result: ReturnType<typeof login.fulfilled>) {
    yield registerNotifs(result);
    yield redirectToHome();
    yield saveAuthKey(result);
}

export default function* authSaga() {
    yield put(fetchSelf());
    yield all([takeLatest(login.fulfilled, handleLoginFulfilled)]);
    yield all([takeEvery(fetchSelf.fulfilled.type, handleLoginFulfilled)]);
    yield takeLatest(logOut, deleteAuthKey);
}
