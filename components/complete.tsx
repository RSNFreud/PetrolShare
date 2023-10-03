import { useState, useContext } from "react";
import { AuthContext } from "../hooks/context";
import { View, TouchableWithoutFeedback } from "react-native";
import { Text } from "./Themed";
import * as Clipboard from "expo-clipboard";
import Button from "./button";
import Tick from "../assets/icons/tick";
import Copy from "../assets/icons/copy";

type PropsType = {
  newGroup?: boolean;
  groupID: string;
  handleClose: () => void;
};

export default ({ groupID, newGroup, handleClose }: PropsType) => {
  const [copied, setCopied] = useState(false);
  const { retrieveData } = useContext(AuthContext);

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(
      `https://petrolshare.freud-online.co.uk/short/referral?groupID=${groupID}` ||
        "test"
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  return (
    <View>
      <Text style={{ fontSize: 16, lineHeight: 25 }}>
        {newGroup && (
          <>
            Thank you for creating a group with PetrolShare{" "}
            <Text style={{ fontWeight: "bold" }}>
              {retrieveData && retrieveData?.fullName}
            </Text>
            .{"\n"}
            {"\n"}
          </>
        )}
        Your Group ID number is:
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 32, marginVertical: 20 }}>
          {groupID}
        </Text>
        <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
          {copied ? <Tick /> : <Copy />}
        </TouchableWithoutFeedback>
      </View>
      <Text style={{ fontSize: 16, lineHeight: 25 }}>
        Share this with other members in your group to add them to your account.
        You can access this ID number at any time from your dashboard.
      </Text>

      <Button
        style={{ marginTop: 25 }}
        handleClick={handleClose}
        text="Start Driving"
      />
    </View>
  );
};
