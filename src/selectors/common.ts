import {ApplicationStoreType} from 'src/reducers';

export const getUserData = (store: ApplicationStoreType) => store.auth;

export const getAuthKey = (store: ApplicationStoreType) => store.auth.authenticationKey;
