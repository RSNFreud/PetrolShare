import { StatusBar } from "expo-status-bar";
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
import { Dimensions, Platform, View, useWindowDimensions, } from "react-native";
import Dashboard from "./screens/dashboard";
import Login from "./screens/login";
import Register from "./screens/register";
import NotFoundScreen from "./screens/NotFoundScreen";
import LinkingConfiguration from "./hooks/LinkingConfiguration";
import DesktopScreen from "./screens/desktopScreen";
import logs from "./screens/logs";
import preset from "./screens/distance/preset";
import { AuthContext } from "./hooks/context";
import { Alert, checkForUpdates, deleteItem, getItem, sendCustomEvent, setItem } from "./hooks";
import invoices from "./screens/invoices";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import {
  deregisterForPushNotifications,
  registerForPushNotificationsAsync,
} from "./components/sendNotification";
import config from "./config";
import { AndroidNotificationPriority } from "expo-notifications";
import Purchases from "react-native-purchases";
import Colors from "./constants/Colors";
import Premium from "./components/premium";
import SplashScreenComponent from "./components/splashScreen";
import Header from "./components/Header";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from "expo-constants";
import bottomNavigation from "./components/bottomNavigation";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  const [screen, setScreen] = useState("");
  const navRef = useNavigationContainerRef();
  const { width } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
  });

  const [notifData, setNotifData] = useState({ routeName: "", invoiceID: "" });

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
                setItem("userData", JSON.stringify(data));
              } catch { }
              sendCustomEvent('openSplash')
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
          setItem("userData", JSON.stringify(e));
        } catch { }
      },
      retrieveData: () => {
        return userData;
      },
      setData: (e: any) => {
        setUserData(e);
      },
      isLoading: loading,
      signOut: async () => {
        deleteItem("userData");
        deleteItem("groupData");
        setUserData({});
        deregisterForPushNotifications(userData.emailAddress);
      },
      isLoggedIn: Boolean(Object.keys(userData).length),
    }),
    [userData, loading]
  );

  useEffect(() => {
    // Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_lTKKSMIRMQmuaTqjQwdeuRjLqQc" });
    }
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    const async = async () => {
      try {
        const data = getItem("userData");
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
              setItem("userData", JSON.stringify({ ...parsed, ...data }));
              setUserData({ ...parsed, ...data });
              if (fontsLoaded) setLoading(false);
            })
            .catch(({ response }) => {
              setLoading(false);
              setTimeout(() => {
                Alert('Account Deactivated', response.data)
              }, 500);
              login.signOut()
              return;
            });
        } else {
          if (fontsLoaded) setLoading(false);
        }
      } catch (data) {
        setLoading(false);
        setUserData({});
        deleteItem("userData");
        deleteItem("groupData");
        // Alert(`An error has occured!`, (data as string).toString());
      }
    };
    async();
  }, [fontsLoaded]);

  useEffect(() => {
    if (!loading) setTimeout(() => {
      sendCustomEvent('closeSplash')
      SplashScreen.hideAsync();
      checkForUpdates()
    }, 1000);
    Notifications.addNotificationResponseReceivedListener((e) => {
      console.log("Notification Title:", e.notification.request.content.title);
      const routeName = e.notification.request.content.data["route"] as any;
      const invoiceID = e.notification.request.content.data[
        "invoiceID"
      ] as string;
      if (!routeName) return;
      setNotifData({ routeName: routeName, invoiceID: invoiceID });
    });
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    if (notifData.invoiceID || notifData.routeName) {
      setNotifData({ routeName: "", invoiceID: "" });
      navRef.navigate(notifData.routeName as any, { id: notifData.invoiceID });
    }
  }, [notifData, loading]);

  useEffect(() => {
    setItem("firstLoad", "true");
  }, []);

  const checkFirstTime = () => {
    if (
      navRef &&
      navRef.getCurrentRoute()?.name != "Dashboard" &&
      "groupID" in userData &&
      userData["groupID"] === null
    )
      setFirstSteps(true);
    else setFirstSteps(false);
  };

  const updateScreen = () => {
    if (!navRef || !navRef.getCurrentRoute()) return
    setScreen(navRef.getCurrentRoute()?.name || "")
  }

  useEffect(() => {
    if (userData["emailAddress"]) {
      registerForPushNotificationsAsync(userData.emailAddress);
    }
  }, [userData]);


  return (<>
    <SplashScreenComponent />
    {login.isLoading ? <></> :
      <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, paddingTop: Constants.statusBarHeight, }}>
        <AuthContext.Provider value={login}>
          <Premium />
          <NavigationContainer
            onReady={() => checkFirstTime()}
            onStateChange={() => updateScreen()}
            ref={navRef}
            linking={LinkingConfiguration}
            theme={{
              dark: true,
              colors: {
                ...DefaultTheme.colors,
                background: Colors.background,
                text: "white",
              },
            }}
          >
            <Stack.Navigator
              screenOptions={{
                gestureEnabled: false,
                headerShown: true,
                header: () => <Header />,
                animation: "slide_from_right",
                animationDuration: 600,
              }}
            >
              {width > 768 && Platform.OS === "web" ? (
                <Stack.Screen
                  name="DesktopScreen"
                  component={DesktopScreen}
                  options={{ title: "PetrolShare", headerShown: false }}
                />
              ) : loading || login.isLoggedIn ? (
                <>
                  <Stack.Screen name="Home" component={BottomNavigator} options={{ headerShown: false }} />
                  {!firstSteps && <Stack.Screen
                    name="AddPreset"
                    component={preset}
                    options={{ title: "Add Preset" }}
                  />}
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
          </NavigationContainer>
          <StatusBar
            style="light"
            backgroundColor={
              screen != "Dashboard" ? Colors.background : Colors.secondary
            }
          />
        </AuthContext.Provider>
      </View>
    }
  </>
  );
}

const BottomNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: true, header: () => <Header /> }} tabBar={bottomNavigation}>
    <Tab.Screen name="Dashboard" component={Dashboard} options={{
      tabBarLabel: 'Home'
    }} />
    <Tab.Screen name="Payments" component={invoices} />
    <Tab.Screen name="History" component={logs} />
  </Tab.Navigator>
)
