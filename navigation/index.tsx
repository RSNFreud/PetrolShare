/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useEffect, useState } from "react";
import { ColorSchemeName, Pressable } from "react-native";
import Header from "../components/Header";

import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import Register from "../screens/Register";
import NotFoundScreen from "../screens/NotFoundScreen";

import LinkingConfiguration from "./LinkingConfiguration";
export const AuthContext = createContext(false as any);
import * as SecureStore from "expo-secure-store";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState("");

  const login = React.useMemo(
    () => ({
      signIn: async (e: any) => {
        setIsLoggedIn(true);

        await SecureStore.setItemAsync("userID", e["email"]);
      },
    }),
    []
  );

  useEffect(() => {
    const async = async () => {
      setIsLoggedIn(false);
      const username = await SecureStore.getItemAsync("userID");

      // if (username) {
      //   setIsLoggedIn(true);
      //   setUserID(username);
      // } else {
      //   setIsLoggedIn(false);
      // }
    };

    async();
  }, []);
  return (
    <NavigationContainer
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
            headerShown: true,
            header: () => <Header isLoggedIn={isLoggedIn} />,
            contentStyle: {
              paddingHorizontal: 20,
            },
            animation: "none",
          }}
        >
          {isLoggedIn ? (
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
