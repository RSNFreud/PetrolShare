import {all} from 'redux-saga/effects';
import authSaga from './auth';
import loadingSaga from './loadingScreen';

export default function* rootSaga() {
    try {
        yield all([authSaga(), loadingSaga()]);
    } catch {}
}
