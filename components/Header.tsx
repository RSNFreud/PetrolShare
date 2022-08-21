import { Button, Text } from "../components/Themed";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";

type PropsType = {
  isLoggedIn: boolean;
};

export default ({ isLoggedIn }: PropsType) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  return (
    <View
      style={{
        paddingTop: 55,
        display: "flex",
        height: 132,
        flexDirection: "row",
        position: "relative",
        alignItems: "center",
        alignContent: "center",
        justifyContent: isLoggedIn ? "space-between" : "center",
        paddingBottom: isLoggedIn ? 44 : 22,
      }}
    >
      <Text
        style={{
          fontWeight: "700",
          fontSize: 26,
          lineHeight: 31,
          color: "white",
          textAlign: isLoggedIn ? "left" : "center",
        }}
      >
        PetrolShare
      </Text>
      {!!isLoggedIn && (
        <Button
          noText
          size="small"
          handleClick={() =>
            route.name != "Settings" && navigation.navigate("Settings")
          }
          styles={{
            paddingHorizontal: 0,
            position: "absolute",
            right: 0,
            paddingVertical: 0,
            top: 46,
            width: 40,
            backgroundColor: "rgba(7, 95, 113, 0.2)",
            height: 40,
            borderColor: "#1196B0",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <>
            <Svg width="16" height="17" fill="none" viewBox="0 0 16 17">
              <Path
                fill="#fff"
                d="M8.003 6.322c-.564 0-1.093.207-1.493.586-.399.38-.62.88-.62 1.415 0 .534.221 1.035.62 1.414.4.377.929.587 1.493.587.565 0 1.093-.21 1.493-.587.399-.379.62-.88.62-1.414a1.94 1.94 0 00-.62-1.415 2.106 2.106 0 00-.684-.435 2.197 2.197 0 00-.809-.151zm7.784 4.21l-1.235-.999a6.086 6.086 0 000-2.063l1.235-1a.57.57 0 00.192-.289.544.544 0 00-.016-.34l-.017-.047a7.822 7.822 0 00-1.503-2.462l-.034-.038a.612.612 0 00-.304-.182.638.638 0 00-.359.012l-1.533.517a6.692 6.692 0 00-1.88-1.028l-.297-1.518a.564.564 0 00-.168-.302.617.617 0 00-.319-.158L9.5.626a8.976 8.976 0 00-2.999 0l-.05.009a.617.617 0 00-.32.158.564.564 0 00-.168.302L5.664 2.62a6.771 6.771 0 00-1.867 1.025l-1.545-.52a.636.636 0 00-.36-.014.609.609 0 00-.302.183l-.034.038A7.884 7.884 0 00.053 5.794l-.017.047a.555.555 0 00.175.629l1.25 1.01a5.962 5.962 0 000 2.039l-1.246 1.01a.57.57 0 00-.191.29.544.544 0 00.015.34l.017.046c.342.9.846 1.731 1.503 2.463l.034.037a.61.61 0 00.304.182.64.64 0 00.359-.012l1.544-.52c.563.438 1.19.785 1.868 1.024l.298 1.526c.022.114.08.22.168.301a.617.617 0 00.319.158l.051.01a8.933 8.933 0 002.998 0l.051-.01a.617.617 0 00.32-.158.564.564 0 00.167-.301l.297-1.518a6.736 6.736 0 001.88-1.029l1.533.517a.637.637 0 00.36.013.61.61 0 00.303-.183l.034-.037a7.887 7.887 0 001.503-2.463l.017-.046a.558.558 0 00-.18-.626zm-7.784.934c-1.833 0-3.319-1.407-3.319-3.143 0-1.737 1.486-3.144 3.32-3.144 1.832 0 3.318 1.407 3.318 3.144 0 1.736-1.486 3.143-3.319 3.143z"
              ></Path>
            </Svg>
          </>
        </Button>
      )}
    </View>
  );
};
