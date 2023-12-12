import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import config from "../config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const schedulePushNotification = async (
  title?: string,
  body?: string
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { route: "Payments", invoiceID: 417 },
    },
    trigger: { seconds: 2 },
  });
};

export const registerForPushNotificationsAsync = async (
  emailAddress: string
) => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      vibrationPattern: [0, 250, 250, 250],
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  if (Platform.OS === "web") return;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      return;
    }
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } catch {}

    if (!token) return;

    await axios
      .post(config.REACT_APP_API_ADDRESS + "/notify/register", {
        emailAddress: emailAddress,
        notificationKey: token,
      })
      .catch(({ response }) => {
        console.log(response);
      });
  } else {
    // alert("Must use physical device for Push Notifications");
  }

  return token;
};

export const deregisterForPushNotifications = async (emailAddress: string) => {
  await axios
    .post(config.REACT_APP_API_ADDRESS + "/notify/deregister", {
      emailAddress: emailAddress,
    })
    .catch(({ response }) => {
      console.log(response);
    });
};
