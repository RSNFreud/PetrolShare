import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";


export const getItem = async (key: string) => {
    if (Platform.OS === "web") return window.sessionStorage.getItem(key)
    else return await SecureStore.getItemAsync(key);
}

export const setItem = async (key: string, data: string) => {
    if (Platform.OS === "web") return window.sessionStorage.setItem(key, data)
    else return await SecureStore.setItemAsync(key, data);
}

export const deleteItem = async (key: string) => {
    if (Platform.OS === "web") return window.sessionStorage.removeItem(key)
    else return await SecureStore.deleteItemAsync(key);
}