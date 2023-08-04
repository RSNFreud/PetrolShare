import {
  Animated,
  Dimensions,
  Keyboard,
  LayoutChangeEvent,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import Svg, { Path } from "react-native-svg";
import Colors from "../constants/Colors";
import AlertBox from "./alertBox";
import { sendCustomEvent } from "../hooks";
import { Text } from "./Themed";

const TIME_TO_CLOSE = 200;

type ModalType = {
  visible: boolean;
  handleClose: () => void;
  children: JSX.Element | Array<JSX.Element>;
  height?: string | number;
  animate?: boolean;
  showClose?: boolean;
  title?: string;
};

export default ({
  visible,
  handleClose,
  children,
  showClose = true,
  height = "auto",
  animate = true,
  title,
}: ModalType) => {
  const [opened, setOpened] = useState(false);
  const [modalHeight, setModalHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  let position = useRef(new Animated.Value(modalHeight)).current;

  const getHeight = (event: LayoutChangeEvent) => {
    setModalHeight(event?.nativeEvent?.layout.height);
  };

  const open = () => {
    Animated.sequence([
      Animated.timing(position, {
        toValue: 0,
        duration: TIME_TO_CLOSE,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start((e) => {
      if (isVisible || visible) setOpened(true);
    });
  };

  const close = () => {
    position.setValue(0);
    setOpened(true);
    Animated.sequence([
      Animated.timing(position, {
        toValue: modalHeight,
        duration: TIME_TO_CLOSE,
        useNativeDriver: true,
      }),
    ]).start((e) => {
      setIsVisible(false);
      setOpened(false);
      setTimeout(() => {
        handleClose();
        sendCustomEvent("popupVisible", visible);
      }, 300);
    });
  };

  useEffect(() => {
    if (!isVisible || opened) return;
    position.setValue(modalHeight || 1000);

    if (!animate) return position.setValue(0);
    if (modalHeight >= 1) open();
  }, [isVisible, modalHeight]);

  useEffect(() => {
    if (!visible && isVisible) {
      try {
        Keyboard.dismiss();
      } catch { }
      setTimeout(() => {
        close();
      }, 400); // Hide keyboard
      return;
    }
    sendCustomEvent("popupVisible", visible);
    setIsVisible(visible);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={true}
      accessibilityLabel={"popup"}
      onRequestClose={() => showClose && close()}
    >
      <AlertBox />
      <Pressable
        onPress={() => showClose && close()}
        android_disableSound={true}
        style={{
          backgroundColor: "rgba(35, 35, 35, 0.8)",
          height: Dimensions.get("window").height,
        }}
      />
      <Animated.View
        onLayout={(e) => getHeight(e)}
        style={{
          backgroundColor: Colors.secondary,
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
          borderColor: Colors.border,
        }}
      >
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            paddingHorizontal: 25,
            paddingVertical: 5,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
            backgroundColor: Colors.primary,
          }}
        >
          <View>
            {!!title && <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title} </Text>}
          </View>
          {showClose && (
            <Pressable
              android_disableSound={true}
              onPress={close}
              accessibilityHint={"closes the popup"}
              style={{
                width: 40,
                height: 40,
                alignContent: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg width="14" height="14" fill="none" viewBox="0 0 10 10">
                <Path
                  fill="#fff"
                  d="M10 .875L9.125 0 5 4.125.875 0 0 .875 4.125 5 0 9.125.875 10 5 5.875 9.125 10 10 9.125 5.875 5 10 .875z"
                ></Path>
              </Svg>
            </Pressable>
          )}
        </View>
        <ScrollView
          keyboardShouldPersistTaps={"always"}
          style={{
            height: "100%",
            marginTop: 51,
          }}
          contentContainerStyle={{
            paddingVertical: 30,
            paddingHorizontal: 25,
          }}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};
