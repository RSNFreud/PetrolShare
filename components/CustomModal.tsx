import {
  Animated,
  Modal,
  TouchableWithoutFeedback,
  View as DefaultView,
} from "react-native";
import { Button, View, Text } from "../components/Themed";
import { useEffect } from "react";

type ModalType = {
  visible: boolean;
  handleClose: () => void;
  children: JSX.Element | Array<JSX.Element>;
};

export default ({ visible, handleClose, children }: ModalType) => {
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

  const close = () => {
    Animated.sequence([
      Animated.timing(position, {
        toValue: 1000,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    position.addListener(({ value }) => {
      if (value === 1000) handleClose();
    });
  };

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      style={{ backgroundColor: "red" }}
    >
      <TouchableWithoutFeedback onPress={() => close()}>
        <View
          style={{ backgroundColor: "rgba(35, 35, 35, 0.8)", height: "100%" }}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          backgroundColor: "#001E24",
          height: "auto",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          transform: [{ translateY: position }],
          position: "absolute",
          bottom: "0",
          width: "100%",
          zIndex: 2,
          paddingTop: 30,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#063943",
        }}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};
