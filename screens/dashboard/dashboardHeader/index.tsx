import Tooltip from "@components/tooltip";
import NavigationMarker from "@icons/navigationMarker";
import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { Text } from "@components/text";
import GroupIcon from "@icons/group";
import Share from "@icons/share";
import { Alert } from "hooks";
import * as Clipboard from "expo-clipboard";
import { styles } from "./styles";

type PropsType = {
  groupID?: string;
  currentMileage?: string;
  distance?: string;
};

export const DashboardHeader = ({
  groupID,
  currentMileage,
  distance,
}: PropsType) => {
  const copyToClipboard = async () => {
    console.log("====================================");
    console.log("clicked");
    console.log("====================================");
    Clipboard.setStringAsync(
      groupID
        ? `https://petrolshare.freud-online.co.uk/short/referral?groupID=${groupID}`
        : ""
    );
    Alert(
      "Information:",
      "Copied the group ID to your\nclipboard - feel free to share it to invite other members to your group!"
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        <View style={styles.rowWrapper}>
          <View style={styles.row}>
            <GroupIcon width="15" height="15" />
            <TouchableWithoutFeedback
              onPress={() =>
                Alert(
                  "Group ID",
                  "This unique ID is used to identify your group. Share it with others to invite them to your group."
                )
              }
            >
              <View style={styles.distanceRow}>
                <Text style={{ fontSize: 18, fontWeight: "500" }}>
                  {groupID || "Loading..."}
                </Text>
                <Tooltip
                  title="Group ID"
                  message="This unique ID is used to identify your group. Share it with others to invite them to your group."
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.row}>
            <NavigationMarker width="15" height="15" />
            <Text style={styles.distanceText}>
              {currentMileage || 0} {distance}
            </Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
          <View style={styles.row}>
            {groupID && <Share width="25" height="25" />}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};
