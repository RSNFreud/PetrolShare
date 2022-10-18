import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { Platform, ToastAndroid, useWindowDimensions } from "react-native";
import * as TaskManager from "expo-task-manager";

import Dashboard from "./screens/dashboard";
import Login from "./screens/Login";
import Register from "./screens/register";
import NotFoundScreen from "./screens/NotFoundScreen";
import LinkingConfiguration from "./hooks/LinkingConfiguration";
import distance from "./screens/distance";
import DesktopScreen from "./screens/desktopScreen";
import logs from "./screens/logs";
import preset from "./screens/distance/preset";
import { AuthContext } from "./hooks/context";
import { Alert, deleteItem, getGroupData, getItem, setItem } from "./hooks";
import petrol from "./screens/petrol";
import invoices from "./screens/invoices";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import {
  deregisterForPushNotifications,
  registerForPushNotificationsAsync,
} from "./components/sendNotification";
import gps from "./screens/gps";
import config from "./config";
import haversine from "haversine";
import { AndroidNotificationPriority } from "expo-notifications";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

TaskManager.defineTask(
  "gpsTracking",
  async ({ data: { locations }, error }: any) => {
    if (error) {
      return;
    }

    locations = locations[locations.length - 1];
    const { distance: distanceFormat } = await getGroupData();
    let previousCoords:
      | string
      | null
      | { longitude: string; latitude: string } = await getItem("gpsOldData");

    if (!previousCoords)
      return await setItem(
        "gpsOldData",
        JSON.stringify({
          longitude: locations["coords"].longitude,
          latitude: locations["coords"].latitude,
        })
      );
    previousCoords = JSON.parse(previousCoords);

    if (!previousCoords || typeof previousCoords === "string") return;

    if (
      previousCoords.latitude !== undefined &&
      previousCoords.longitude !== undefined
    ) {
      const calcDistance = haversine(
        {
          longitude: parseFloat(previousCoords.longitude),
          latitude: parseFloat(previousCoords.latitude),
        },
        {
          longitude: locations.coords.longitude,
          latitude: locations.coords.latitude,
        },
        { unit: distanceFormat !== "km" ? "mile" : "km" }
      );

      if (calcDistance < 0.01) return;
      if (Platform.OS === "android")
        ToastAndroid.show(calcDistance.toString(), ToastAndroid.SHORT);

      const oldDistance = (await getItem("gpsDistance")) || "0";

      await setItem(
        "gpsDistance",
        (parseFloat(oldDistance) + calcDistance).toString()
      );
    }

    await setItem(
      "gpsOldData",
      JSON.stringify({
        longitude: locations["coords"].longitude,
        latitude: locations["coords"].latitude,
      })
    );
  }
);

Notifications.addNotificationResponseReceivedListener((e) => {
  console.log("Notification Title:", e.notification.request);
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    priority: AndroidNotificationPriority.DEFAULT,
  }),
});

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const [firstSteps, setFirstSteps] = useState(false);
  const navRef = useNavigationContainerRef();
  const { width } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
  });
  const login = React.useMemo(
    () => ({
      signIn: async (e: any) => {
        return new Promise((res, rej) => {
          axios
            .post(config.REACT_APP_API_ADDRESS + "/user/login", {
              ...e,
            })
            .then(async ({ data }) => {
              registerForPushNotificationsAsync(data.emailAddress);
              setUserData(data);
              try {
                await setItem("userData", JSON.stringify(data));
              } catch {}
              res(data);
            })
            .catch(({ response }) => {
              rej(response.data);
            });
        });
      },
      register: async (e: any) => {
        setUserData(e);
        try {
          await setItem("userData", JSON.stringify(e));
        } catch {}
      },
      retrieveData: () => {
        return userData;
      },
      setData: (e: any) => {
        setUserData(e);
      },
      isLoading: loading,
      signOut: async () => {
        deregisterForPushNotifications(userData.emailAddress);
        setUserData({});
        await deleteItem("userData");
      },
      isLoggedIn: Boolean(Object.keys(userData).length),
    }),
    [userData, loading]
  );

  useEffect(() => {
    if (!fontsLoaded) return;
    const async = async () => {
      try {
        const data = await getItem("userData");

        if (data) {
          const parsed = JSON.parse(data);

          if (!("authenticationKey" in parsed)) {
            setLoading(false);
            return login.signOut;
          }
          axios
            .get(
              config.REACT_APP_API_ADDRESS +
                "/user/verify?authenticationKey=" +
                parsed.authenticationKey
            )
            .then(async ({ data }) => {
              await setItem("userData", JSON.stringify({ ...parsed, ...data }));
              setUserData({ ...parsed, ...data });
              if (fontsLoaded) setLoading(false);
            })
            .catch(() => {
              setLoading(false);
              return login.signOut;
            });
        } else {
          if (fontsLoaded) setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        Alert(`An error has occured! - ${err}`);
        console.log(err);
      }
    };
    async();
  }, [fontsLoaded]);

  useEffect(() => {
    if (!loading) setTimeout(() => SplashScreen.hideAsync(), 500);
    if (!loading && login.isLoggedIn) {
      Notifications.addNotificationResponseReceivedListener((e) => {
        console.log(
          "Notification Title:",
          e.notification.request.content.title
        );

        const routeName = e.notification.request.content.data["route"] as any;
        const invoiceID = e.notification.request.content.data[
          "invoiceID"
        ] as string;
        if (!routeName) return;
        navRef.navigate(routeName, { id: invoiceID });
      });
    }
  }, [loading]);

  useEffect(() => {
    setItem("firstLoad", "true");
  }, []);

  useEffect(() => {
    if (
      navRef.getCurrentRoute.name != "Dashboard" &&
      "groupID" in userData &&
      userData["groupID"] === null
    )
      setFirstSteps(true);
    else setFirstSteps(false);

    if (userData["emailAddress"]) {
      registerForPushNotificationsAsync(userData.emailAddress);
    }
  }, [userData]);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navRef}
        linking={LinkingConfiguration}
        theme={{
          dark: true,
          colors: {
            ...DefaultTheme.colors,
            background: "#001E24",
            text: "white",
          },
        }}
      >
        <AuthContext.Provider value={login}>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: false,
              headerShown: false,
              animation: "fade",
              animationDuration: 300,
            }}
          >
            {width > 768 && Platform.OS === "web" ? (
              <Stack.Screen
                name="DesktopScreen"
                component={DesktopScreen}
                options={{ title: "PetrolShare" }}
              />
            ) : loading || login.isLoggedIn ? (
              <>
                <Stack.Screen name="Dashboard" component={Dashboard} />
                {!firstSteps && (
                  <>
                    <Stack.Screen
                      name="ManageDistance"
                      component={distance}
                      options={{ title: "Manage Distance" }}
                    />
                    <Stack.Screen
                      name="GPS"
                      component={gps}
                      options={{ title: "GPS Tracking" }}
                    />
                    <Stack.Screen
                      name="AddPreset"
                      component={preset}
                      options={{ title: "Add Preset" }}
                    />
                    <Stack.Screen
                      name="AddPetrol"
                      component={petrol}
                      options={{ title: "Add Petrol" }}
                    />
                    <Stack.Screen name="Logs" component={logs} />
                    <Stack.Screen name="Invoices" component={invoices} />
                  </>
                )}
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
              </>
            )}
            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ title: "Oops!" }}
            />
          </Stack.Navigator>
        </AuthContext.Provider>
      </NavigationContainer>
      <StatusBar style="light" backgroundColor="#001E24" />
    </SafeAreaProvider>
  );
}
