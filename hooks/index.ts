import * as SecureStore from "expo-secure-store";
import { AlertButton, AlertOptions, Platform, Alert as DefaultAlert } from "react-native";

export const getItem = async (key: string) => {
  if (Platform.OS === "web") return window.localStorage.getItem(key);
  else return await SecureStore.getItemAsync(key);
};

export const setItem = async (key: string, data: string) => {
  if (Platform.OS === "web") return window.localStorage.setItem(key, data);
  else return await SecureStore.setItemAsync(key, data);
};

export const deleteItem = async (key: string) => {
  if (Platform.OS === "web") return window.localStorage.removeItem(key);
  else return await SecureStore.deleteItemAsync(key);
};

export const convertToDate = (date: string) => {
  let x: Date = new Date(parseInt(date));
  return `${x.getDate() < 10 ? "0" : ""}${x.getDate()}/${x.getMonth() < 10 ? "0" : ""
    }${x.getMonth()}/${x.getFullYear()}`;
};


export const Alert = (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => {
  if (Platform.OS !== 'web') DefaultAlert.alert(title, message, buttons, options)
  else alertPolyfill(title, message, buttons, options)
}

const alertPolyfill = (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => {
  const result = window.confirm([title, message].filter(Boolean).join('\n'))
  if (!buttons) return
  if (result) {
    const confirmOption: any = buttons.find(({ style }) => style !== 'cancel')
    confirmOption && confirmOption.onPress()
  } else {
    const cancelOption: any = buttons.find(({ style }) => style === 'cancel')
    cancelOption && cancelOption.onPress()
  }
}
