import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";

type PropsType = {
  children: JSX.Element | Array<JSX.Element>;
  navigation: any;
};

export default ({ children, navigation }: PropsType) => {
  const position = new Animated.Value(1000);
  useEffect(() => {
    Animated.sequence([
      Animated.timing(position, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [position]);

  return (
    <TouchableWithoutFeedback
      style={{
        width: "100%",
        position: "absolute",
        top: 0,
        zIndex: 100,
        height: "100%",
        backgroundColor: "rgba(35, 35, 35, 0.8)",
      }}
      onPress={() => navigation.goBack()}
    >
      <Animated.View
        style={{
          backgroundColor: "#001E24",
          height: "auto",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          width: "100%",
          position: "absolute",
          transform: [{ translateY: position }],
          bottom: 0,
          zIndex: 2,
          paddingTop: 30,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#063943",
        }}
      >
        <Text style={{ color: "white" }}>
          TESTING
          {children}
        </Text>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#001E24",
    height: "auto",
    borderRadius: 8,
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: "30px 20px 20px",
    border: "1px solid #063943",
  },
});
