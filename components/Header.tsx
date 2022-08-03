type PropsType = {
  isLoggedIn: boolean;
};
import { Text, View } from "../components/Themed";

export default ({ isLoggedIn }: PropsType) => {
  return (
    <View
      style={{
        marginTop: 55,
        paddingHorizontal: 25,
        marginBottom: 22,
        backgroundColor: "transparent",
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
