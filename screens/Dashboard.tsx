import { useContext } from "react";
import { Pressable, TouchableWithoutFeedback, View } from "react-native";
import { Layout, Text } from "../components/Themed";
import { AuthContext } from "../navigation";

export default () => {
  const { signOut } = useContext(AuthContext);

  return (
    <Layout style={{ display: "flex" }}>
      <Text>
        Hello world - Click
        <TouchableWithoutFeedback onPress={signOut}>
          <Text> here </Text>
        </TouchableWithoutFeedback>
        to log out
      </Text>
    </Layout>
  );
};
