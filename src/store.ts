import {configureStore} from '@reduxjs/toolkit';
import {reducers} from './reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import {useDispatch} from 'react-redux';
import {persistStore} from 'redux-persist';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(sagaMiddleware),
    devTools: false,
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer()),
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
