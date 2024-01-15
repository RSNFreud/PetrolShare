import BottomNavigation from "@components/bottomNavigation";
import SplashScreen from "@components/splashScreen";
import Calendar from "@icons/calendar";
import House from "@icons/house";
import { Redirect, Stack, Tabs } from "expo-router";
import { useSession } from "hooks/context";

export default function AppLayout() {
  const { isLoggedIn, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <SplashScreen />;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isLoggedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs
      screenOptions={{ header: () => <></> }}
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
