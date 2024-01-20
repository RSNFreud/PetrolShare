import { Text as DefaultText } from "react-native";

import { TextProps } from "./Themed";

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;

  let fontFamily = "Roboto-Regular";

  if (style) {
    switch ((style as any)["fontWeight"]) {
      case "bold":
      case "700":
        fontFamily = "Roboto-Bold";
        break;
      case "400":
        fontFamily = "Roboto-Medium";
        break;
      case "300":
        fontFamily = "Roboto-Light";
        break;
      default:
        break;
    }
  }

  return (
    <DefaultText
      style={[{ fontFamily, color: "white", fontSize: 16 }, style]}
      {...otherProps}
    />
  );
}
