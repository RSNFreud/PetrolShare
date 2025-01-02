import {ApplicationStoreType} from 'src/reducers';

export const getUserData = (store: ApplicationStoreType) => store.auth;

export const getDistanceFormat = (store: ApplicationStoreType) => store.auth.distance;
