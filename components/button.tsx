import {
  TouchableOpacity,
  TextProps,
  ActivityIndicator,
  View,
} from "react-native";
import { Text } from "./text";
import analytics from "@react-native-firebase/analytics";
import Colors from "../constants/Colors";

export type VariantType = "regular" | "ghost";
export type ColorType = "blue" | "red";
export type SizeType = "regular" | "small" | "medium";

export type ButtonType = {
  children?: JSX.Element | Array<JSX.Element> | string;
  icon?: JSX.Element;
  text?: string;
  color?: ColorType;
  variant?: VariantType;
  size?: SizeType;
  handleClick?: () => void;
  style?: TouchableOpacity["props"]["style"];
  noText?: boolean;
  textStyle?: TextProps["style"];
  disabled?: boolean;
  loading?: boolean;
  analyticsLabel?: string;
};

type BaseType = {
  children: React.ReactNode;
  style?: TouchableOpacity["props"]["style"];
  disabled?: boolean;
  handleClick?: () => void;
  analyticsLabel?: string;
};

export const TouchableBase = ({
  children,
  style,
  disabled,
  handleClick,
  analyticsLabel,
}: BaseType) => {
  const onClick = () => {
    if (analyticsLabel)
      try {
        analytics().logSelectContent({
          content_type: "button",
          item_id: analyticsLabel,
        });
      } catch {}
    if (handleClick) handleClick();
  };
  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.8}
      touchSoundDisabled
      disabled={disabled}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

export default ({
  children,
  handleClick,
  noText,
  size,
  disabled,
  style,
  color,
  icon,
  loading,
  text,
  variant,
  textStyle,
}: ButtonType) => {
  let variableProperties = {
    height: 51,
    fontSize: 18,
    backgroundColor: Colors.tertiary,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    textColor: "white",
  };

  switch (size) {
    case "small":
      variableProperties.height = 35;
      variableProperties.paddingVertical = 6;
      variableProperties.paddingHorizontal = 12;
      variableProperties.fontSize = 14;
      break;
    case "medium":
      variableProperties.height = 40;
      variableProperties.paddingVertical = 0;
      variableProperties.paddingHorizontal = 0;
      variableProperties.fontSize = 14;
      break;

    default:
      break;
  }

  switch (color) {
    case "red":
      variableProperties.borderColor = "#BA3737";
      variableProperties.backgroundColor = "#FA4F4F";
      variant === "ghost" && (variableProperties.textColor = "#FA4F4F");
      break;
    default:
      variant === "ghost" && (variableProperties.textColor = "#15CEF3");
      break;
  }

  switch (variant) {
    case "ghost":
      if (color !== "red") {
        variableProperties.borderColor = Colors.tertiary;
        variableProperties.textColor = Colors.tertiary;
      }
      variableProperties.backgroundColor = "transparent";
      break;
    default:
      break;
  }

  return (
    <TouchableBase
      handleClick={handleClick}
      disabled={disabled}
      analyticsLabel={text}
      style={[
        {
          borderStyle: "solid",
          borderRadius: 4,
          flexDirection: "row",
          gap: 10,
          display: "flex",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: variableProperties.borderColor,
          paddingHorizontal: variableProperties.paddingHorizontal,
          paddingVertical: variableProperties.paddingVertical,
          width: "100%",
          alignContent: "center",
          alignItems: "center",
          opacity: disabled ? 0.6 : 1,
          minHeight: variableProperties.height,
          backgroundColor: variableProperties.backgroundColor,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : noText ? (
        children
      ) : (
        <>
          {icon}
          <Text
            style={[
              {
                color: variableProperties.textColor,
                fontSize: variableProperties.fontSize,
                fontWeight: "700",
                textAlign: "center",
              },
              textStyle,
            ]}
          >
            {text || children}
          </Text>
        </>
      )}
    </TouchableBase>
  );
};
