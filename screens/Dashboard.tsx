import { useContext } from "react";
import { Pressable, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "../components/Themed";
import { AuthContext } from "../navigation";

export default () => {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ display: "flex" }}>
      <Text>
        Hello world - Click
        <TouchableWithoutFeedback onPress={signOut}>
          <Text> here </Text>
        </TouchableWithoutFeedback>
        to log out
      </Text>
    </View>
  );
};
