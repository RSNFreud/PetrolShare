type PropsType = {
  isLoggedIn: boolean;
};
import { Text, View } from "../components/Themed";

export default ({ isLoggedIn }: PropsType) => {
  return (
    <View
      style={{
        marginTop: 55,
        padding: "0 25px",
        marginBottom: 22,
        position: undefined,
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
