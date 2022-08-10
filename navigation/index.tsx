/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useEffect, useState } from "react";

import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import Register from "../screens/register/Register";
import NotFoundScreen from "../screens/NotFoundScreen";
import LinkingConfiguration from "./LinkingConfiguration";
export const AuthContext = createContext({} as any);
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

export default function Navigation() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  const login = React.useMemo(
    () => ({
      signIn: async (e: any) => {
        setUserData(e);
        try {
          await SecureStore.setItemAsync("userData", e);
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
          setUserData(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch {}
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
            headerShown: false,
            animation: "none",
          }}
        >
          {Boolean(Object.keys(userData).length) ? (
            <Stack.Screen name="Dashboard" component={Dashboard} />
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
