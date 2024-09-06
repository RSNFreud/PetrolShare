import {auth} from './auth';
import {loadingScreen} from './loadingScreen';

export const reducers = {
    auth,
    loadingScreen,
};

export type ReducersType = typeof reducers;
export type ApplicationStoreType = {
    [k in keyof ReducersType]: ReturnType<ReducersType[k]>;
};
