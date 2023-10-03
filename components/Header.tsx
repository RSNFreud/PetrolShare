import { Text } from "../components/Themed";
import { TouchableWithoutFeedback, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../hooks/context";
import { useContext, useState } from "react";
import Settings from "./profile";
import Colors from "../constants/Colors";
import axios from "axios";
import config from "../config";
import { deleteItem, getItem, sendCustomEvent, setItem } from "../hooks";
import { TouchableBase } from "./button";
import Person from "../assets/icons/person";

export default ({ isGuestMode }: { isGuestMode?: boolean }) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { isLoggedIn, retrieveData, setData } = useContext(AuthContext);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleUpdate = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/user/get?authenticationKey=${retrieveData?.authenticationKey}`
      )
      .then(async ({ data }) => {
        let sessionStorage;
        try {
          sessionStorage = getItem("userData");
          if (!sessionStorage) return;
          sessionStorage = JSON.parse(sessionStorage);
          sessionStorage = { ...sessionStorage, ...data[0] };
          if (setData) setData(sessionStorage);
          setItem("userData", JSON.stringify(sessionStorage));
        } catch (err) {
          console.log(err);
        }
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };
  const handleClose = () => {
    const delayedAlert = getItem("delayedAlert");

    if (delayedAlert) {
      sendCustomEvent("sendAlert", delayedAlert);
      deleteItem("delayedAlert");
    }
    setSettingsVisible(false);
  };

  const getHeaderColour = () => {
    if (isLoggedIn && route.name === "Dashboard") return Colors.secondary;
    if (route.name.includes("Schedule")) return Colors.primary;
    return "";
  };

  return (
    <View
      style={{
        paddingTop: 30,
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
        onPress={() => (isGuestMode ? null : navigation.popToTop())}
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
              top: 25,
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
            onUpdate={handleUpdate}
            visible={settingsVisible}
            handleClose={handleClose}
          />
        </>
      )}
    </View>
  );
};
