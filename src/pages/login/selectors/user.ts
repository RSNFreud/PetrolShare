import {ApplicationStoreType} from 'src/reducers';

export const getLoginData = (store: ApplicationStoreType) => store.auth;

export const isLoggedIn = (store: ApplicationStoreType) => Boolean(store.auth.authenticationKey);

export const getInitialEmail = (store: ApplicationStoreType) => store.userPersistData.emailAddress;
