import {auth} from '@pages/login/reducers/auth';
import {loadingScreen} from './loadingScreen';
import {registerReducer} from '@pages/register/reducers/register';

export const reducers = {
    auth,
    loadingScreen,
    registerReducer,
};

export type ReducersType = typeof reducers;
export type ApplicationStoreType = {
    [k in keyof ReducersType]: ReturnType<ReducersType[k]>;
};
