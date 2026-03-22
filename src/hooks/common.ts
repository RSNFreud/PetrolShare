import {Platform} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {createMMKV} from 'react-native-mmkv';
import {FormValues} from '@constants/common';
import z from 'zod';

export const sendCustomEvent = (event: string, data?: any) => {
    EventRegister.emit(event, data);
};

const storage = createMMKV();

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
    else return storage.remove(key);
};

export const convertToSentanceCase = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const returnValuesFromObject = (formData: {[key: string]: FormValues}) =>
    Object.entries(formData).reduce(
        (prevData, [key, value]) => ({
            ...prevData,
            [key]: value.value,
        }),
        {} as {[key: string]: string},
    );

const returnErrorObject = (
    formData: {[key: string]: FormValues},
    errors: {[key: string]: {errors: string[]} | undefined} | undefined,
) =>
    Object.entries(formData).reduce(
        (prevData, [key, value]) => ({
            ...prevData,
            [key]: {
                value: value.value,
                error: errors ? errors[key]?.errors[0] : '',
            },
        }),
        {} as {[key: string]: {value: string}},
    );

export type DataType = {[key: string]: FormValues};

export const validate = (rules: z.ZodObject, data: DataType, setData: (data: DataType) => void) => {
    const values = returnValuesFromObject(data);
    const result = rules.safeParse(values);
    if (!result.success) {
        const {properties: errors} = z.treeifyError(result.error);

        setData(returnErrorObject(data, errors) as typeof data);
        return false;
    }
    return true;
};
