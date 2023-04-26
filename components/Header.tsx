import { Button, Text } from "../components/Themed";
import { TouchableWithoutFeedback, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../hooks/context";
import { useContext, useState } from "react";
import Settings from "./profile";
import { Alert } from "../hooks";
import Colors from "../constants/Colors";

type PropsType = {
  isLoggedIn: boolean;
};

export default ({ isLoggedIn }: PropsType) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { signOut } = useContext(AuthContext);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleLogout = () => {
    Alert("Are you sure you want to sign out?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          signOut();
        },
      },
      { text: "No", style: "cancel" },
    ]);
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
        backgroundColor: isLoggedIn && route.name === "Dashboard" ? Colors.secondary : '',
        justifyContent: isLoggedIn ? "space-between" : "center",
        paddingBottom: 25,
      }}
    >
      <TouchableWithoutFeedback onPress={() => navigation.popToTop()}>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 26,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            verticalAlign: 'middle',
            lineHeight: 31,
            color: "white",
            textAlign: isLoggedIn ? "left" : "center",
          }}
        >
          PetrolShare
        </Text>
      </TouchableWithoutFeedback>
      {!!isLoggedIn && (
        <>
          <Button
            noText
            size="small"
            handleClick={() => setSettingsVisible(true)}
            styles={{
              paddingHorizontal: 0,
              position: "absolute",
              right: 25,
              paddingVertical: 0,
              top: 25,
              backgroundColor: Colors.primary,
              width: 40,
              height: 40,
              borderColor: Colors.border,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <>
              <Svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 18 20"
              >
                <Path
                  fill="#fff"
                  d="M4.685 5.23a4.318 4.318 0 004.312 4.312 4.318 4.318 0 004.313-4.313A4.318 4.318 0 008.997.917a4.318 4.318 0 00-4.312 4.312zm11.979 13.895h.958v-.958a6.717 6.717 0 00-6.708-6.709H7.081c-3.7 0-6.709 3.01-6.709 6.709v.958h16.292z"
                ></Path>
              </Svg>
            </>
          </Button>
          <Settings
            visible={settingsVisible}
            handleClose={() => setSettingsVisible(false)}
          />
        </>
      )}
    </View>
  );
};
