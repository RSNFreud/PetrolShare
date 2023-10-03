import React, { useContext, useRef } from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "./Themed";
import Colors from "../constants/Colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../hooks/context";
import House from "../assets/icons/house";
import Invoice from "../assets/icons/invoice";
import History from "../assets/icons/history";
import Calendar from "../assets/icons/calendar";

type BottonNavPropTypes = {
  icon: JSX.Element;
  text: string;
  active?: boolean;
  hidden?: boolean;
  handleClick?: () => void;
};

const icon = (route: string) => {
  switch (route) {
    case "Dashboard":
      return <House />;
    case "Payments":
      return <Invoice />;
    case "History":
      return <History />;
    case "Schedules":
      return <Calendar />;
    default:
      return <></>;
  }
};

const BottomNavItem = ({
  icon,
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
        {icon}
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

  const setInitialScroll = (index: number) => {
    const ref = scrollRef.current;
    if (!ref) return;
    ref.scrollTo({ y: 0, x: 30 * index, animated: true });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={{ backgroundColor: Colors.secondary, width: "100%", flexGrow: 0 }}
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

        return (
          <BottomNavItem
            hidden={label === "Schedules" && !isPremium}
            key={route.name}
            active={isFocused}
            text={label}
            handleClick={onPress}
            icon={icon(route.name)}
          />
        );
      })}
    </ScrollView>
  );
};
