import BottomNavigation from "@components/bottomNavigation";
import SplashScreen from "@components/splashScreen";
import Calendar from "@icons/calendar";
import History from "@icons/history";
import House from "@icons/house";
import Invoice from "@icons/invoice";
import Colors from "constants/Colors";
import { Redirect, Tabs } from "expo-router";
import { useSession } from "hooks/context";
import React from "react";

export default function AppLayout() {
  const { isLoggedIn, isLoading } = useSession();
  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: () => <></>,
        tabBarInactiveBackgroundColor: Colors.primary,
        tabBarActiveBackgroundColor: Colors.primary,
      }}
      sceneContainerStyle={{ backgroundColor: Colors.background }}
      tabBar={(props) => <BottomNavigation {...props} />}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <House />,
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          tabBarLabel: "Invoices",
          tabBarIcon: () => <Invoice />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: "History",
          tabBarIcon: () => <History />,
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          tabBarLabel: "Schedules",
          tabBarIcon: () => <Calendar />,
        }}
      />
      <Tabs.Screen
        // Name of the route to hide.
        name="addPreset"
        options={{
          // This tab will no longer show up in the tab bar.
          href: null,
        }}
      />
    </Tabs>
  );
}
