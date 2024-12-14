import {all, delay, put, takeEvery} from 'redux-saga/effects';
import {fetchSelf, login} from '@pages/login/reducers/auth';
import {setLoading} from 'src/reducers/loadingScreen';

function* setLoadingState() {
    yield put(setLoading(true));
    delay(300);
    yield put(setLoading(false));
}

function* setLoadedState() {
    yield put(setLoading(false));
}

export default function* loadingSaga() {
    yield all([takeEvery(fetchSelf.fulfilled.type, setLoadedState)]);
    yield all([takeEvery(login.fulfilled.type, setLoadingState)]);
}
