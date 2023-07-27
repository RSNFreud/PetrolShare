import {
  Platform,
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import { MMKV } from 'react-native-mmkv'
import { ButtonType } from '../components/alertBox'
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from 'expo-updates'

const storage = new MMKV()

export const getItem = (key: string) => {
  if (Platform.OS === 'web') return window.localStorage.getItem(key)
  else return storage.getString(key)
}

export const setItem = (key: string, data: string) => {
  if (Platform.OS === 'web') return window.localStorage.setItem(key, data)
  else return storage.set(key, data)
}

export const deleteItem = (key: string) => {
  if (Platform.OS === 'web') return window.localStorage.removeItem(key)
  else return storage.delete(key)
}

export const convertToSentenceCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase()
}

export const convertToDate = (date: string, time?: boolean) => {
  let x: Date = new Date(parseInt(date))
  const month = x.getMonth() + 1

  if (!time)
    return `${x.getDate() < 10 ? '0' : ''}${x.getDate()}/${month < 10 ? '0' : ''
      }${month}/${x.getFullYear()}`
  return `${x.getDate() < 10 ? '0' : ''}${x.getDate()}/${month < 10 ? '0' : ''
    }${month}/${x.getFullYear()}, ${x.getHours() > 12 ? x.getHours() - 12 : x.getHours()
    }:${x.getMinutes() < 10 ? '0' : ''}${x.getMinutes()}${x.getHours() > 12 ? 'pm' : 'am'
    }`
}

export const getGroupData = async () => {
  let sessionStorage = await getItem('groupData')
  if (sessionStorage) return JSON.parse(sessionStorage)
  else return null
}

export const Alert = (
  title: string,
  message?: string,
  buttons?: ButtonType[],
) => {
  sendCustomEvent('openAlert', ({ title: title, message: message, buttons: buttons }))
}

export const currencyPosition = (value: number, symbol: string) => {
  if (symbol === '$' || symbol === '£' || symbol === '€')
    return `${symbol.trim()}${value}`
  return `${value} ${symbol}`
}

export const sendCustomEvent = (event: string, data?: any) => {
  EventRegister.emit(event, data)
}


export const checkForUpdates = async (force?: boolean) => {
  return new Promise(async (res, rej) => {
    try {
      const resolve = await checkForUpdateAsync()
      if (resolve.isAvailable) {
        await fetchUpdateAsync()
        if (force) {
          await fetchUpdateAsync()
          await reloadAsync()
          res(false)
        }
        else {
          res(true)
          Alert("Update Available", "An update to the app has been downloaded to your device. Click the Update button to install it, alternatively, it will be installed on the next boot of the app",
            [{ text: 'Dismiss' }, { text: "Update", onPress: async () => await reloadAsync() }]
          )
        }
      } else
        res(false)
    } catch {
      rej(false)
    }
  })
}

export const convertHexToRGBA = (hexCode: string, opacity = 1) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }

  return `rgba(${r},${g},${b},${opacity})`;
};