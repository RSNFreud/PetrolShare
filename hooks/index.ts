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

export const convertToDate = (date: string, time?: boolean) => {
  let x: Date = new Date(parseInt(date));
  const month = x.getMonth() + 1

  if (!time)
    return `${x.getDate() < 10 ? "0" : ""}${x.getDate()}/${month < 10 ? "0" : ""
      }${month}/${x.getFullYear()}`;
  return `${x.getDate() < 10 ? "0" : ""}${x.getDate()}/${month < 10 ? "0" : ""
    }${month}/${x.getFullYear()}, ${x.getHours() > 12 ? x.getHours() - 12 : x.getHours()}:${x.getMinutes() < 10 ? '0' : ''}${x.getMinutes()}${x.getHours() > 12 ? 'pm' : 'am'}`;
};

export const getGroupData = async () => {
  let sessionStorage = await getItem("groupData");
  if (sessionStorage) return (JSON.parse(sessionStorage));
  else return null
}

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
