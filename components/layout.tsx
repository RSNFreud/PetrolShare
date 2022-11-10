import { deleteItem, getItem } from "../hooks";
import { EventRegister } from "react-native-event-listeners";
import React, { useContext, useEffect } from "react";
import { ViewProps, View, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { Text } from "./Themed";
import { AuthContext } from "../hooks/context";
import Header from "./Header";

export default ({
  children,
  style,
  ...rest
}: {
  children: any;
  style?: ViewProps["style"];
  onLayout?: any;
}) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  const ToastConfig = {
    default: ({ text1 }: { text1?: string }) => (
      <View
        style={{
          backgroundColor: "#0B404A",
          borderColor: "#1196B0",
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 4,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "white",
            fontWeight: "700",
            lineHeight: 24,
          }}
        >
          {text1}
        </Text>
      </View>
    ),
  };

  useEffect(() => {
    EventRegister.addEventListener("dataUpdated", () => {
      setTimeout(async () => {
        if ((await getItem("showToast")) === "distanceUpdated") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1: "Distance successfully updated!",
          });
        }
        if ((await getItem("showToast")) === "nameUpdated") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1: "Your name has been successfully updated!",
          });
        }
        if ((await getItem("showToast")) === "draftSaved") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1:
              "Saved your distance as a draft! Access it by clicking on Manage Distance again!",
          });
        }
        if ((await getItem("showToast")) === "resetDistance") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1: "Reset your distance back to 0!",
          });
        }
      }, 300);
    });

    return () => {
      EventRegister.removeEventListener("dataUpdated");
    };
  }, []);

  if (isLoading) return <></>;

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        style={[{ paddingHorizontal: 20 }, style]}
        {...rest}
      >
        <Header isLoggedIn={isLoggedIn} />
        <View style={{ paddingBottom: 55 }}>
          <>{children}</>
        </View>
        <Toast config={ToastConfig} />
      </ScrollView>
    </>
  );
};
