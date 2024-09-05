import {auth} from './auth';

export const reducers = {
    auth,
};

export type ReducersType = typeof reducers;
export type ApplicationStoreType = {
    [k in keyof ReducersType]: ReturnType<ReducersType[k]>;
};
