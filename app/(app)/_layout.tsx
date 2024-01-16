import BottomNavigation from "@components/bottomNavigation";
import SplashScreen from "@components/splashScreen";
import Calendar from "@icons/calendar";
import House from "@icons/house";
import Colors from "constants/Colors";
import { Redirect, Stack, Tabs } from "expo-router";
import { useSession } from "hooks/context";

export default function AppLayout() {
  const { isLoggedIn, isLoading } = useSession();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: () => <></>,
      }}
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
        name="schedules/index"
        options={{
          tabBarLabel: "Schedules",
          tabBarIcon: () => <Calendar />,
        }}
      />
    </Tabs>
  );
}
