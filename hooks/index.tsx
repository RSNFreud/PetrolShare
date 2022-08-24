import * as SecureStore from "expo-secure-store";
import { useContext, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { AuthContext } from "./context";

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
  return `${x.getDate() < 10 ? "0" : ""}${x.getDate()}/${
    x.getMonth() < 10 ? "0" : ""
  }${x.getMonth()}/${x.getFullYear()}`;
};
