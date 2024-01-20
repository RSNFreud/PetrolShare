import Header from "@components/Header";
import AlertBox from "@components/alertBox";
import { StatusBar } from "expo-status-bar";
import { AuthContext, AuthContextType, StoreData } from "hooks/context";
import React, { useEffect, useState } from "react";
import { Animated, View, Dimensions, Platform } from "react-native";
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
import Premium from "@components/premium";
import Purchases from "react-native-purchases";
import { logIn } from "hooks/login";

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
      signIn: async ({ emailAddress, password }) => {
        const data = await logIn(emailAddress, password);
        if (data) {
          setUserData(data);
          sendCustomEvent("openSplash");
          setTimeout(() => {
            sendCustomEvent("closeSplash");
          }, 500);
          return { valid: true };
        } else
          return { valid: false, message: "Invalid username or password!" };
      },
      register: async (e: any) => {
        setUserData(e);
        try {
          setItem("userData", JSON.stringify(e));
        } catch {}
      },
      retrieveData: userData,
      setData: setUserData,
      updateData: () => fetchData(),
      isLoading: loading,
      isPremium: isPremium,
      setPremiumStatus: setIsPremium,
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
    checkIfAuth();
  }, []);

  // Update session data when user data changes
  useEffect(() => {
    setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    fetchData();
  }, [pathname]);

  const checkIfAuth = async () => {
    const ogData = getItem("userData");
    // If not signed in show login
    if (!ogData)
      return setLoadingStatus((loadingStatus) => ({
        ...loadingStatus,
        auth: true,
      }));

    // If auth key missing also show login
    const parsed = JSON.parse(ogData);
    if (!("authenticationKey" in parsed)) {
      setLoading(false);
      return store.signOut;
    }

    // Check if auth key valid
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    try {
      const data = await fetch(
        `${config.REACT_APP_API_ADDRESS}/user/verify?authenticationKey=${parsed.authenticationKey}`,
        { signal: controller.signal }
      );
      if (data && data.status === 200) {
        const userData = await data.json();
        setItem("userData", JSON.stringify({ ...parsed, ...userData }));
        setUserData({ ...parsed, ...userData });
        setLoadingStatus((loadingStatus) => ({
          ...loadingStatus,
          auth: true,
        }));
        return;
      }
      if (data.status === 400 && (await data.text()).includes("deactivated")) {
        setTimeout(async () => {
          Alert("Account Deactivated", await data.text());
        }, 500);
      }
    } catch {
      console.log("====================================");
      console.log("unexpected error");
      console.log("====================================");
    } finally {
      clearTimeout(timeoutId);
    }

    setLoadingStatus((loadingStatus) => ({
      ...loadingStatus,
      auth: true,
    }));
    store.signOut();
  };

  const fetchData = async () => {
    if (!userData.authenticationKey) return;
    const res = await fetch(
      config.REACT_APP_API_ADDRESS +
        `/user/get?authenticationKey=${userData?.authenticationKey}`
    );

    if (res.ok) {
      const newData = await res.json();
      setUserData((rest) => ({ ...rest, ...newData }));
    }
  };

  useEffect(() => {
    if (fontsLoaded)
      setLoadingStatus((loadingStatus) => ({ ...loadingStatus, fonts: true }));
  }, [fontsLoaded]);

  useEffect(() => {
    checkForUpdates(loading);
  }, [isUpdateAvailable, loading]);

  useEffect(() => {
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

  useEffect(() => {
    if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_lTKKSMIRMQmuaTqjQwdeuRjLqQc" });
    }
    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: "appl_WqDbxNapCEFuKTgtIlsqKCMAXVn" });
    }
  }, []);

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
            {store.isLoggedIn && <Premium />}
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
