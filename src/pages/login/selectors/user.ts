import {ApplicationStoreType} from 'src/reducers';

export const getLoginData = (store: ApplicationStoreType) => store.auth;

export const isLoggedIn = (store: ApplicationStoreType) => Boolean(store.auth.userID);

export const getInitialEmail = (store: ApplicationStoreType) => store.userPersistData.emailAddress;

export const getRegisterSuccess = (store: ApplicationStoreType) =>
    store.register.shouldShowSuccessPopup;

export const getUserName = (store: ApplicationStoreType) => store.register.name;
