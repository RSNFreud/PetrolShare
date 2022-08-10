import { useContext } from "react";
import { Pressable, TouchableWithoutFeedback, View } from "react-native";
import { Box, Layout, Text } from "../components/Themed";
import generateGroupID from "../hooks/generateGroupID";
import { AuthContext } from "../navigation";

export default () => {
  const { signOut, retrieveData } = useContext(AuthContext);

  return (
    <Layout style={{ display: "flex" }}>
      <Box>
        <Text style={{ fontSize: 18 }}>
          Welcome
          <Text style={{ fontWeight: "bold" }}>
            &nbsp;
            {retrieveData ? retrieveData()?.email || "Undefined" : "Test"}
          </Text>
          !
        </Text>
        <Text style={{ fontSize: 16, marginTop: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Group ID: </Text>
          {generateGroupID()}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Current Mileage: </Text>
          10000km
        </Text>
      </Box>
      <TouchableWithoutFeedback onPress={signOut}>
        <Text style={{ fontSize: 20, marginTop: 30 }}> Log out </Text>
      </TouchableWithoutFeedback>
    </Layout>
  );
};
