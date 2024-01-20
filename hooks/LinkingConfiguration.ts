import { getStateFromPath } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import { setItem } from ".";

const linking: any = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      initialRouteName: "Home",
      Home: {
        screens: {
          Payments: "payments",
          ManageGroup: "manage-group",
          Dashboard: "dashboard/:groupID?",
          History: "history",
          Schedules: "schedules",
        },
      },
      Login: "login/:groupID?",
      Register: "register",
      ManageDistance: "manage-distance",
      AddPetrol: "add-petrol",
      AddPreset: "manage-distance/select-preset",
      AddManual: "manage-distance/manual",
      NotFound: "*/:groupID?",
      GPS: "gps-tracking",
      DesktopScreen: "/",
      DesktopApp: "/desktop",
      PublicInvoice: "/payments/public/:uniqueURL",
    },
  },
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    let url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    url = response?.notification.request.content.data.url as string;

    return url;
  },
  subscribe(listener: (arg0: string) => void) {
    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      listener(url);
    });

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data.url;
        listener(url);
      },
    );

    return () => {
      // Clean up the event listeners
      linkingSubscription.remove();
      subscription.remove();
    };
  },
  getStateFromPath(path: string, config: { screens: object }) {
    if (path.includes("groupID=")) {
      const id = path.split("groupID=")[1].match(/\b\w*\b/);
      if (id) setItem("referalCode", id[0]);
      return undefined;
    }

    if (path === "/") return undefined;

    return getStateFromPath(path, config);
  },
};

export default linking;
