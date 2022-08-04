/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useEffect, useState } from "react";
import {
  Pressable,
  Text as DefaultText,
  View as DefaultView,
} from "react-native";

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
};

export const Button = ({
  children,
  handleClick,
  size,
  style,
  color,
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
        style={{
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
        }}
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
