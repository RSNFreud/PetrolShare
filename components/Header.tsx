type PropsType = {
  isLoggedIn: boolean;
};
import { Button, Text } from "../components/Themed";
import { View } from "react-native";

export default ({ isLoggedIn }: PropsType) => {
  return (
    <View
      style={{
        paddingTop: 55,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: isLoggedIn ? "space-between" : "center",
        paddingBottom: 22,
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
        <Button size="small" styles={{ width: 103 }}>
          Settings
        </Button>
      )}
    </View>
  );
};
