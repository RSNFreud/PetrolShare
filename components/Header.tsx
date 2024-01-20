import { StackActions } from "@react-navigation/native";
import { useNavigation, usePathname } from "expo-router";
import { useContext, useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TouchableBase } from "./button";
import Settings from "./profile";
import { Text } from "./text";
import Person from "../assets/icons/person";
import Colors from "../constants/Colors";
import { deleteItem, getItem, sendCustomEvent } from "../hooks";
import { AuthContext } from "../hooks/context";

export default ({ isGuestMode }: { isGuestMode?: boolean }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, updateData } = useContext(AuthContext);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const pathname = usePathname();

  const handleClose = () => {
    const delayedAlert = getItem("delayedAlert");

    if (delayedAlert) {
      sendCustomEvent("sendAlert", delayedAlert);
      deleteItem("delayedAlert");
    }
    setSettingsVisible(false);
  };

  const getHeaderColour = () => {
    if (isLoggedIn && pathname === "/") return Colors.secondary;
    if (pathname.includes("schedule")) return Colors.primary;
    return Colors.background;
  };

  return (
    <View
      style={{
        paddingTop: insets.top + 30,
        paddingHorizontal: 25,
        display: "flex",
        flexDirection: "row",
        position: "relative",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: getHeaderColour(),
        justifyContent: isLoggedIn && !isGuestMode ? "space-between" : "center",
        paddingBottom: 25,
      }}
    >
      <TouchableWithoutFeedback
        onPress={() =>
          isGuestMode ? null : navigation.dispatch(StackActions.popToTop)
        }
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: 26,
            height: 40,
            display: "flex",
            alignItems: "center",
            verticalAlign: "middle",
            lineHeight: 31,
            color: "white",
            textAlign: isLoggedIn && !isGuestMode ? "left" : "center",
          }}
        >
          PetrolShare
        </Text>
      </TouchableWithoutFeedback>
      {isLoggedIn && !isGuestMode && (
        <>
          <TouchableBase
            analyticsLabel="Settings"
            handleClick={() => setSettingsVisible(true)}
            style={{
              paddingHorizontal: 0,
              position: "absolute",
              right: 25,
              paddingVertical: 0,
              top: insets.top + 25,
              backgroundColor: Colors.primary,
              width: 40,
              height: 40,
              borderRadius: 4,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: Colors.border,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Person />
          </TouchableBase>
          <Settings
            onUpdate={updateData}
            visible={settingsVisible}
            handleClose={handleClose}
          />
        </>
      )}
    </View>
  );
};
