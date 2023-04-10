import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Colors from "../../constants/Colors";

type PropTypes = {
  active?: boolean;
  width: string | number;
  withBar?: boolean;
  barHighlight?: boolean;
};

export default ({
  active,
  width,
  withBar = true,
  barHighlight = true,
}: PropTypes) => {
  const styles = StyleSheet.create({
    circle: {
      height: 30,
      width: 30,
      display: "flex",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      backgroundColor: active ? Colors.tertiary : Colors.secondary,
    },
    bar: {
      height: 4,
      backgroundColor: active && barHighlight ? Colors.tertiary : Colors.secondary,
      width: width,
    },
    wrapper: {
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <View style={styles.wrapper}>
      {withBar && <View style={styles.bar} />}
      <View style={styles.circle}>
        {active && (
          <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <Path
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.75 8.75l3.5 3.5 7-7.5"
            ></Path>
          </Svg>
        )}
      </View>
    </View>
  );
};
