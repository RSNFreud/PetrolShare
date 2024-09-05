import {ApplicationStoreType} from 'src/reducers';

export const getLoginData = (store: ApplicationStoreType) => store.auth;
