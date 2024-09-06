import {Platform} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {MMKV} from 'react-native-mmkv';

export const sendCustomEvent = (event: string, data?: any) => {
    EventRegister.emit(event, data);
};

const storage = new MMKV();

export const getItem = (key: string) => {
    if (Platform.OS === 'web') return window.localStorage.getItem(key);
    else return storage.getString(key);
};

export const setItem = (key: string, data: string) => {
    if (Platform.OS === 'web') return window.localStorage.setItem(key, data);
    else return storage.set(key, data);
};

export const deleteItem = (key: string) => {
    if (Platform.OS === 'web') return window.localStorage.removeItem(key);
    else return storage.delete(key);
};
