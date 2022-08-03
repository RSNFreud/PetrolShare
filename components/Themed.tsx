/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text as DefaultText,
  View as DefaultView,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <DefaultText
      style={[{ color }, { fontFamily: "Roboto", color: "white" }, style]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return (
    <DefaultView style={[{ paddingHorizontal: 20 }, style]} {...otherProps} />
  );
}

type ButtonType = {
  children: JSX.Element | Array<JSX.Element> | string;
  color?: "blue" | "red";
  style?: "regular" | "ghost";
  handleClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const Button = ({
  children,
  style = "regular",
  type,
  handleClick,
}: ButtonType) => {
  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <DefaultView
        style={{
          borderStyle: "solid",
          borderColor: "#58D3EC",
          borderRadius: 4,
          padding: 16,
          width: "100%",
          height: 51,
          backgroundColor: "#1196B0",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {children}
        </Text>
      </DefaultView>
    </TouchableWithoutFeedback>
  );
};
