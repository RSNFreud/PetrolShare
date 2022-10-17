import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";

type ModalType = {
  visible: boolean;
  handleClose: () => void;
  children: JSX.Element | Array<JSX.Element>;
  height?: string | number;
  animate?: boolean;
  showClose?: boolean;
};

export default ({
  visible,
  handleClose,
  children,
  showClose = true,
  height = "auto",
  animate = true,
}: ModalType) => {
  const [opened, setOpened] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  let position = new Animated.Value(1000);
  useEffect(() => {
    if (opened) return;
    if (!animate) return position.setValue(0);

    Animated.sequence([
      Animated.timing(position, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isVisible || visible) setOpened(true);
    });
    position.addListener(({ value }) => {});

    return () => {
      position.removeAllListeners();
    };
  }, [position]);

  const close = () => {
    position.setValue(0);
    Animated.sequence([
      Animated.timing(position, {
        toValue: 1000,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start((e) => {
      setIsVisible(false);
      setOpened(false);
    });
  };
  useEffect(() => {
    if (!visible && isVisible) return close();
    else setIsVisible(visible);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={true}
      accessibilityLabel={"popup"}
    >
      <Pressable
        onPress={() => handleClose()}
        android_disableSound={true}
        style={{
          backgroundColor: "rgba(35, 35, 35, 0.8)",
          height: Dimensions.get("window").height,
        }}
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
          maxHeight: Dimensions.get("window").height * 0.9,
          zIndex: 2,
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#063943",
        }}
      >
        {showClose && (
          <Pressable
            android_disableSound={true}
            onPress={() => {
              handleClose();
            }}
            accessibilityHint={"closes the popup"}
            style={{
              position: "absolute",
              right: 4,
              top: 4,
              padding: 10,
              zIndex: 1,
              width: 30,
              height: 30,
              alignContent: "center",
              display: "flex",
              alignItems: "center",
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
        )}
        <ScrollView
          style={{
            height: "100%",
            paddingVertical: 40,
            paddingHorizontal: 20,
          }}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};
