import { Animated, Modal, Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";

type ModalType = {
  visible: boolean;
  handleClose: () => void;
  children: JSX.Element | Array<JSX.Element>;
  height?: string | number;
};

export default ({
  visible,
  handleClose,
  children,
  height = "auto",
}: ModalType) => {
  const [opened, setOpened] = useState(false);
  let position = new Animated.Value(1000);
  useEffect(() => {
    if (opened) return;

    Animated.sequence([
      Animated.timing(position, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    position.addListener(({ value }) => {
      if (visible && value === 0) setOpened(true);
    });
    return () => position.removeAllListeners();
  }, [position]);

  const close = () => {
    position.setValue(0);

    Animated.sequence([
      Animated.timing(position, {
        toValue: 1000,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    position.addListener(({ value }) => {
      if (value === 1000) {
        handleClose();
      }
    });
  };
  useEffect(() => {
    if (!visible) setOpened(false);
  }, [visible]);

  return (
    <Modal animationType="fade" visible={visible} transparent={true}>
      <Pressable
        onPress={close}
        android_disableSound={true}
        style={{ backgroundColor: "rgba(35, 35, 35, 0.8)", height: "100%" }}
      />

      <Animated.View
        style={{
          backgroundColor: "#001E24",
          height: height,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          transform: [{ translateY: position }],
          position: "absolute",
          bottom: 0,
          width: "100%",
          zIndex: 2,
          paddingTop: 40,
          paddingHorizontal: 20,
          paddingBottom: 40,
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#063943",
        }}
      >
        <Pressable
          android_disableSound={true}
          onPress={() => {
            close();
          }}
          style={{
            position: "absolute",
            right: 0,
            top: 10,
            width: 20,
            height: 20,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Svg width="10" height="10" fill="none" viewBox="0 0 10 10">
            <Path
              fill="#fff"
              d="M10 .875L9.125 0 5 4.125.875 0 0 .875 4.125 5 0 9.125.875 10 5 5.875 9.125 10 10 9.125 5.875 5 10 .875z"
            ></Path>
          </Svg>
        </Pressable>
        {children}
      </Animated.View>
    </Modal>
  );
};
