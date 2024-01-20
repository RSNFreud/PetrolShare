import { Text } from "@components/text";
import Tooltip from "@components/tooltip";
import GroupIcon from "@icons/group";
import NavigationMarker from "@icons/navigationMarker";
import Share from "@icons/share";
import Colors from "constants/Colors";
import * as Clipboard from "expo-clipboard";
import { Alert } from "hooks";
import React from "react";
import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 25,
    paddingBottom: 35,
  },
  innerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: Colors.border,
    borderStyle: "solid",
    borderWidth: 1,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  distanceRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowWrapper: {
    gap: 5,
  },
  distanceText: {
    fontWeight: "300",
  },
});

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
        : "",
    );
    Alert(
      "Information:",
      "Copied the group ID to your\nclipboard - feel free to share it to invite other members to your group!",
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
                  "This unique ID is used to identify your group. Share it with others to invite them to your group.",
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
