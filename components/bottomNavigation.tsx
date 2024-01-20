import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useContext, useRef } from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "./text";
import Colors from "../constants/Colors";
import { AuthContext } from "../hooks/context";

type BottonNavPropTypes = {
  icon?:
    | ((props: {
        focused: boolean;
        color: string;
        size: number;
      }) => React.ReactNode)
    | undefined;
  text: string;
  active?: boolean;
  hidden?: boolean;
  handleClick?: () => void;
};

const BottomNavItem = ({
  icon: Icon,
  text,
  active,
  handleClick,
  hidden,
}: BottonNavPropTypes) => {
  if (hidden) return <></>;
  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: active ? 1 : 0.5,
          paddingVertical: 15,
          paddingHorizontal: 25,
        }}
      >
        {Icon && <Icon focused={false} color="" size={0} />}
        <Text style={{ marginTop: 10, fontSize: 14, fontWeight: "bold" }}>
          {text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const { isPremium } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const setInitialScroll = (index: number) => {
    const ref = scrollRef.current;
    if (!ref) return;
    ref.scrollTo({ y: 0, x: 30 * index, animated: true });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={{
        backgroundColor: Colors.secondary,
        width: "100%",
        flexGrow: 0,
        paddingBottom: insets.bottom,
      }}
      horizontal
      contentContainerStyle={{
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: 10,
        justifyContent: "center",
        minWidth: "100%",
      }}
    >
      {state?.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel !== "string"
            ? route.name
            : options.tabBarLabel;
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        if (isFocused) setInitialScroll(index);
        if (label === "addPreset") return;
        // if (!route.path) return;

        return (
          <BottomNavItem
            hidden={label === "Schedules" && !isPremium}
            key={route.name}
            active={isFocused}
            text={label}
            handleClick={onPress}
            icon={options.tabBarIcon}
          />
        );
      })}
    </ScrollView>
  );
};
