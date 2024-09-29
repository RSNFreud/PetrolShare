import {all} from 'redux-saga/effects';
import authSaga from '@pages/login/sagas/auth';
import loadingSaga from './loadingScreen';

export default function* rootSaga() {
    try {
        yield all([authSaga(), loadingSaga()]);
    } catch {}
}
