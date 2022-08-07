/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useContext, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  Text as DefaultText,
  View as DefaultView,
} from "react-native";
import { AuthContext } from "../navigation";
import Header from "./Header";

export type TextProps = DefaultText["props"];
export type ViewProps = DefaultView["props"];

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;

  return (
    <DefaultText
      style={[{ fontFamily: "Roboto", color: "white" }, style]}
      {...otherProps}
    />
  );
}

type ButtonType = {
  children: JSX.Element | Array<JSX.Element> | string;
  color?: "blue" | "red";
  style?: "regular" | "ghost";
  size?: "regular" | "small";
  handleClick?: () => void;
  styles?: ViewProps["style"];
};

export const Button = ({
  children,
  handleClick,
  size,
  style,
  color,
  styles,
}: ButtonType) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    if (handleClick) handleClick();
  };

  useEffect(() => {
    let timeout: any = null;

    if (pressed) {
      timeout = setTimeout(() => setPressed(false), 300);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [pressed]);

  let variableProperties = {
    height: 51,
    fontSize: 18,
    backgroundColor: "#1196B0",
    borderColor: "#58D3EC",
    paddingHorizontal: 16,
    paddingVertical: 16,
    textColor: "white",
  };

  switch (size) {
    case "small":
      variableProperties.height = 26;
      variableProperties.paddingVertical = 6;
      variableProperties.paddingHorizontal = 12;
      variableProperties.fontSize = 12;
      break;

    default:
      break;
  }

  switch (color) {
    case "red":
      variableProperties.borderColor = "#BA3737";
      variableProperties.backgroundColor = "#FA4F4F";
      style === "ghost" && (variableProperties.textColor = "#FA4F4F");
      break;
    default:
      style === "ghost" && (variableProperties.textColor = "#15CEF3");
      break;
  }

  switch (style) {
    case "ghost":
      variableProperties.borderColor = variableProperties.textColor;
      variableProperties.backgroundColor = "transparent";
      break;
    default:
      break;
  }

  return (
    <Pressable onPress={handlePress} android_disableSound={true}>
      <DefaultView
        style={[
          {
            borderStyle: "solid",
            borderRadius: 4,
            borderWidth: 1,
            borderColor: variableProperties.borderColor,
            paddingHorizontal: variableProperties.paddingHorizontal,
            paddingVertical: variableProperties.paddingVertical,
            width: "100%",
            alignContent: "center",
            alignItems: "center",
            transform: pressed ? [{ scale: 0.99 }] : [],
            opacity: pressed ? 0.9 : 1,
            minHeight: variableProperties.height,
            backgroundColor: variableProperties.backgroundColor,
          },
          styles,
        ]}
      >
        <Text
          style={{
            color: variableProperties.textColor,
            fontSize: variableProperties.fontSize,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {children}
        </Text>
      </DefaultView>
    </Pressable>
  );
};

export const Seperator = ({ style }: ViewProps) => {
  return (
    <DefaultView
      style={[
        {
          height: 1,
          width: "100%",
          backgroundColor: "#445C61",
        },
        style,
      ]}
    />
  );
};

export const Box = ({ children }: any) => {
  return (
    <DefaultView
      style={{
        backgroundColor: "rgba(7, 95, 113, 0.2)",
        paddingHorizontal: 29,
        paddingVertical: 19,
        borderColor: "#137B91",
        borderWidth: 1,
        borderRadius: 4,
      }}
    >
      {children}
    </DefaultView>
  );
};

export const Layout = ({ children }: any) => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <Header isLoggedIn={isLoggedIn} />
      {children}
    </ScrollView>
  );
};
