import {takeLatest} from 'redux-saga/effects';
import {registerForPushNotificationsAsync} from 'src/hooks/notifications';
import {login} from 'src/reducers/auth';

function* registerNotifs({payload}: ReturnType<typeof login.fulfilled>) {
    if (!payload) return;
    registerForPushNotificationsAsync(payload.emailAddress);
}

export default function* authSaga() {
    yield takeLatest(login.fulfilled, registerNotifs);
}
