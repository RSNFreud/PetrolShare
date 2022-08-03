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
import React, { useState } from "react";
import { ColorSchemeName, Pressable } from "react-native";
import Header from "../components/Header";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import NotFoundScreen from "../screens/NotFoundScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: () => <Header isLoggedIn={isLoggedIn} />,
          contentStyle: {
            paddingHorizontal: 20,
          },
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Dashboard" component={Dashboard} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator();
