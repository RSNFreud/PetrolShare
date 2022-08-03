type PropsType = {
  isLoggedIn: boolean;
};
import { Text } from "../components/Themed";
import { View } from "react-native";

export default ({ isLoggedIn }: PropsType) => {
  return (
    <View
      style={{
        paddingTop: 55,
        paddingHorizontal: 25,
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
    </View>
  );
};
