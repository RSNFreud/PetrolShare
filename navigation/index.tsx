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
import Login from "../screens/Login";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
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
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Dashboard" component={TabOneScreen} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
        <Stack.Group
          screenOptions={{
            presentation: "transparentModal",
            animation: "slide_from_bottom",
            animationDuration: 5000,
            header: () => <></>,
          }}
        >
          <Stack.Screen name="Modal" component={ModalScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator();
