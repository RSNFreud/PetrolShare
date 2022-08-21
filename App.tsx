import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";

import Dashboard from "./screens/dashboard";
import Login from "./screens/Login";
import Register from "./screens/register";
import NotFoundScreen from "./screens/NotFoundScreen";
import LinkingConfiguration from "./hooks/LinkingConfiguration";
import Settings from "./screens/settings";
import distance from "./screens/distance";
import logs from "./screens/logs";
import manual from "./screens/distance/manual";
import odometer from "./screens/distance/odometer";
import preset from "./screens/distance/preset";
import { AuthContext } from "./hooks/context";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  const login = React.useMemo(
    () => ({
      signIn: async (e: any) => {
        return new Promise((res, rej) => {
          axios
            .post("https://petrolshare.freud-online.co.uk/user/login", { ...e })
            .then(async ({ data }) => {
              setUserData(data);
              try {
                await SecureStore.setItemAsync(
                  "userData",
                  JSON.stringify(data)
                );
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
          await SecureStore.setItemAsync("userData", JSON.stringify(e));
        } catch {}
      },
      retrieveData: () => {
        return userData;
      },
      signOut: async () => {
        setUserData({});
        await SecureStore.deleteItemAsync("userData");
      },
      // isLoggedIn: true,
      isLoggedIn: Boolean(Object.keys(userData).length),
    }),
    [userData]
  );

  useEffect(() => {
    const async = async () => {
      try {
        const data = await SecureStore.getItemAsync("userData");

        if (data) {
          const parsed = JSON.parse(data);
          if (!("authenticationKey" in parsed)) {
            setLoading(false);
            return login.signOut;
          }

          setUserData(parsed);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    async();
  }, []);

  useEffect(() => {
    if (!loading) setTimeout(() => SplashScreen.hideAsync(), 500);
  }, [loading]);

  useEffect(() => {
    try {
      SecureStore.setItemAsync("firstLoad", "true");
    } catch {}
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
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
              animation: "none",
            }}
          >
            {login.isLoggedIn ? (
              <>
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="ManageDistance" component={distance} />
                <Stack.Screen name="AddManual" component={manual} />
                <Stack.Screen name="AddOdometer" component={odometer} />
                <Stack.Screen name="AddPreset" component={preset} />
                <Stack.Screen name="Logs" component={logs} />
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
