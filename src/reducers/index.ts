import {auth} from '@pages/login/reducers/auth';
import {loadingScreen} from './loadingScreen';
import {registerReducer as register} from '@pages/register/reducers/register';
import {userPersistData} from './userPersistData';
import {persistReducer} from 'redux-persist';
import {MMKV} from 'react-native-mmkv';
import {combineReducers} from 'redux';

const storage = new MMKV();

const reduxPersistStorage = {
    setItem: (key: string, value: string | number | boolean | Uint8Array) => {
        storage.set(key, value);
        return Promise.resolve(true);
    },
    getItem: (key: string) => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },
    removeItem: (key: string) => {
        storage.delete(key);
        return Promise.resolve();
    },
};

const persistConfig = {
    key: 'root',
    storage: reduxPersistStorage,
};

const persistedReducer = persistReducer(persistConfig, userPersistData);

export const reducers = combineReducers({
    auth,
    loadingScreen,
    register,
    userPersistData: persistedReducer,
});

export type ApplicationStoreType = ReturnType<typeof reducers>;
