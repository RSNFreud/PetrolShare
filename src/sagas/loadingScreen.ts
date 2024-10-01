import {fetchSelf, login} from '@pages/login/reducers/auth';
import {all, put, takeEvery} from 'redux-saga/effects';
import {setLoading} from 'src/reducers/loadingScreen';

function* setLoadingState() {
    yield put(setLoading(true));
}

function* setLoadedState() {
    yield put(setLoading(false));
}

export default function* loadingSaga() {
    yield all([takeEvery(fetchSelf.fulfilled.type, setLoadedState)]);
    // yield all([takeEvery(login.pending.type, setLoadingState)]);
    // yield all([takeEvery(login.rejected.type, setLoadedState)]);
    yield all([takeEvery(login.fulfilled.type, setLoadedState)]);
}
