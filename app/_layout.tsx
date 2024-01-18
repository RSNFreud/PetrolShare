import Header from "@components/Header";
import AlertBox from "@components/alertBox";
import { StatusBar } from "expo-status-bar";
import { AuthContext, AuthContextType, StoreData } from "hooks/context";
import React, { useEffect, useState } from "react";
import { Animated, View, Dimensions } from "react-native";
import Toast from "react-native-toast-message";
import SplashScreenComponent from "@components/splashScreen";
import * as Sentry from "@sentry/react-native";
import * as Notifications from "expo-notifications";
import { deregisterForPushNotifications } from "@components/sendNotification";
import axios from "axios";
import config from "config";
import {
  setItem,
  sendCustomEvent,
  deleteItem,
  checkForUpdates,
  Alert,
  getItem,
} from "hooks";
import { Text } from "@components/text";
import { Slot, Stack, usePathname, useRootNavigation } from "expo-router";
import { useFonts } from "expo-font";
import Colors from "constants/Colors";
import { useUpdates } from "expo-updates";

const ToastConfig = {
  default: ({ text1 }: { text1?: string }) => (
    <View
      style={{
        backgroundColor: Colors.background,
        borderColor: Colors.border,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "white",
          fontWeight: "700",
          textAlign: "center",
          lineHeight: 24,
        }}
      >
        {text1}
      </Text>
    </View>
  ),
};

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
Sentry.init({
  dsn: "https://9262fe64d3f987c3fdb7f20c0d506641@o4506003486277632.ingest.sentry.io/4506003538575360",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<Partial<StoreData>>({});
  const [isPremium, setIsPremium] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
  });
  const [notifData, setNotifData] = useState({ routeName: "", invoiceID: "" });
  const pathname = usePathname();
  const ref = useRootNavigation();
  const [loadingStatus, setLoadingStatus] = useState({
    fonts: fontsLoaded,
    auth: false,
  });
  const { isChecking, isUpdateAvailable } = useUpdates();

  const store = React.useMemo(
    () => ({
      signIn: async (e: any) => {
        return new Promise((res, rej) => {
          axios
            .post(config.REACT_APP_API_ADDRESS + "/user/login", {
              ...e,
            })
            .then(async ({ data }) => {
              setUserData(data);
              try {
                setItem("userData", JSON.stringify(data));
              } catch {}
              sendCustomEvent("openSplash");
              res(data);
            })
            .catch(({ response }) => {
              rej(response?.data);
            });
        });
      },
      register: async (e: any) => {
        setUserData(e);
        try {
          setItem("userData", JSON.stringify(e));
        } catch {}
      },
      retrieveData: userData,
      setData: (e: any) => {
        setUserData(e);
      },
      isLoading: loading,
      isPremium: isPremium,
      setPremiumStatus: (e) => setIsPremium(e),
      signOut: async () => {
        deleteItem("userData");
        deleteItem("presets");
        deleteItem("groupData");
        if (userData?.emailAddress)
          deregisterForPushNotifications(userData.emailAddress);
        setUserData({});
      },
      isLoggedIn: Boolean(Object.keys(userData).length),
    }),
    [userData, loading]
  ) as AuthContextType;

  useEffect(() => {
    const async = async () => {
      try {
        const data = getItem("userData");

        if (data) {
          const parsed = JSON.parse(data);
          if (!("authenticationKey" in parsed)) {
            setLoading(false);
            return store.signOut;
          }

          axios
            .get(
              config.REACT_APP_API_ADDRESS +
                "/user/verify?authenticationKey=" +
                parsed.authenticationKey,
              { timeout: 1000 }
            )
            .then(async ({ data }) => {
              setItem("userData", JSON.stringify({ ...parsed, ...data }));
              setUserData({ ...parsed, ...data });
              setLoadingStatus((loadingStatus) => ({
                ...loadingStatus,
                auth: true,
              }));
              if (fontsLoaded) setLoading(false);
            })
            .catch(({ response }) => {
              console.log(response);
              setLoadingStatus((loadingStatus) => ({
                ...loadingStatus,
                auth: true,
              }));
              if (response?.data.includes("This account has been deactivated"))
                setTimeout(() => {
                  Alert("Account Deactivated", response.data);
                }, 500);
              store.signOut();
              return;
            });
        } else {
          setLoadingStatus((loadingStatus) => ({
            ...loadingStatus,
            auth: true,
          }));
        }
      } catch (data) {
        setLoadingStatus((loadingStatus) => ({ ...loadingStatus, auth: true }));
        setUserData({});
        deleteItem("userData");
        deleteItem("presets");
        deleteItem("groupData");
        // Alert(`An error has occured!`, (data as string).toString());
      }
    };
    async();
    checkForUpdates(true)
      .then((e) => {
        if (!e)
          setLoadingStatus((loadingStatus) => ({
            ...loadingStatus,
            update: true,
          }));
      })
      .catch(() =>
        setLoadingStatus((loadingStatus) => ({
          ...loadingStatus,
          update: true,
        }))
      );
  }, []);

  useEffect(() => {
    if (fontsLoaded)
      setLoadingStatus((loadingStatus) => ({ ...loadingStatus, fonts: true }));
  }, [fontsLoaded]);

  useEffect(() => {
    checkForUpdates(loading);
  }, [isUpdateAvailable, loading]);

  useEffect(() => {
    let i: NodeJS.Timeout;
    if (isUpdateAvailable || isChecking) return;
    if (loadingStatus.auth && loadingStatus.fonts) setLoading(false);
  }, [loadingStatus, isChecking, isUpdateAvailable]);

  useEffect(() => {
    let i: string | number | NodeJS.Timeout | undefined;

    if (!loading && !notifData.invoiceID && !notifData.routeName) {
      sendCustomEvent("closeSplash");
    }
    Notifications.addNotificationResponseReceivedListener((e) => {
      const routeName = e.notification.request.content.data["route"] as any;
      const invoiceID = e.notification.request.content.data[
        "invoiceID"
      ] as string;
      if (!routeName) return;
      setNotifData({ routeName: routeName, invoiceID: invoiceID });
    });
    return () => clearTimeout(i);
  }, [loading, notifData]);

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <>
      <SplashScreenComponent />
      <Animated.View
        style={{
          flex: 1,
          opacity: loading ? 0 : 1,
          backgroundColor: Colors.background,
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: Colors.background,
            flex: 1,
          }}
        >
          <AuthContext.Provider value={store}>
            <Header />
            <Slot />
            {!popupVisible && <AlertBox />}
            <Toast config={ToastConfig} />
          </AuthContext.Provider>
          <StatusBar
            style="light"
            backgroundColor={
              pathname != "/" ? Colors.background : Colors.secondary
            }
          />
        </View>
      </Animated.View>
    </>
  );
};

export default Sentry.wrap(App);
