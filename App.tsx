import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
import { deleteItem, getItem, setItem } from "./hooks";
import petrol from "./screens/petrol";
import invoices from "./screens/invoices";

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
            .post(process.env.REACT_APP_API_ADDRESS + "/user/login", { ...e })
            .then(async ({ data }) => {
              setUserData(data);
              try {
                await setItem("userData", JSON.stringify(data));
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
          await setItem("userData", JSON.stringify(e));
        } catch {}
      },
      retrieveData: () => {
        return userData;
      },
      setData: (e: any) => {
        setUserData(e);
      },
      isLoading: loading,
      signOut: async () => {
        setUserData({});
        await deleteItem("userData");
      },
      isLoggedIn: Boolean(Object.keys(userData).length),
    }),
    [userData, loading]
  );

  useEffect(() => {
    const async = async () => {
      try {
        const data = await getItem("userData");

        if (data) {
          const parsed = JSON.parse(data);
          if (!("authenticationKey" in parsed)) {
            setLoading(false);
            return login.signOut;
          }
          axios
            .get(
              process.env.REACT_APP_API_ADDRESS +
                "/user/verify?authenticationKey=" +
                parsed.authenticationKey
            )
            .then(() => {
              setUserData(parsed);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
              return login.signOut;
            });
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
    setItem("firstLoad", "true");
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
              animation: "fade",
              animationDuration: 300,
            }}
          >
            {loading || login.isLoggedIn ? (
              <>
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="ManageDistance" component={distance} />
                <Stack.Screen name="AddManual" component={manual} />
                <Stack.Screen name="AddOdometer" component={odometer} />
                <Stack.Screen name="AddPreset" component={preset} />
                <Stack.Screen name="AddPetrol" component={petrol} />
                <Stack.Screen name="Logs" component={logs} />
                <Stack.Screen name="Invoices" component={invoices} />
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
