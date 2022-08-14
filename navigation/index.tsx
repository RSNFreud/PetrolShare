/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useEffect, useState } from "react";

import Dashboard from "../screens/dashboard/Dashboard";
import Login from "../screens/Login";
import Register from "../screens/register/Register";
import NotFoundScreen from "../screens/NotFoundScreen";
import LinkingConfiguration from "./LinkingConfiguration";
export const AuthContext = createContext({} as any);
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import Settings from "../screens/settings/Settings";
import axios from "axios";
import distance from "../screens/distance";

export default function Navigation() {
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

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={{
        dark: true,
        colors: {
          ...DefaultTheme.colors,
          background: "#001E24",
          text: "white",
          card: "red",
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
              <Stack.Screen name="AddDistance" component={distance} />
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
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator();
