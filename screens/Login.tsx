import { useState } from "react";

import Input from "../components/Input";
import { Button, View, Text } from "../components/Themed";
import CustomModal from "../components/CustomModal";

export default ({ navigation }: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Input
        placeholder="Enter username"
        label="Username"
        style={{ marginBottom: 15 }}
      />
      <Input
        placeholder="Enter password"
        label="Enter password"
        style={{ marginBottom: 15 }}
      />
      <Text
        style={{
          fontSize: 14,
          textDecorationLine: "underline",
          marginBottom: 28,
        }}
        onPress={() => setVisible(true)}
      >
        Forgot my password...
      </Text>
      <Button type="submit">Submit</Button>
      <CustomModal visible={visible} handleClose={() => setVisible(false)}>
        <Input
          placeholder="Enter email address"
          label="Enter email address"
          style={{ marginBottom: 15 }}
        />
        <Button>Test</Button>
      </CustomModal>
    </View>
  );
};
