/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useNavigation } from "@react-navigation/native";
import {
  Text as DefaultText,
  TouchableWithoutFeedback,
  View as DefaultView,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import Colors from "../constants/Colors";
import Button, { ButtonType } from "./button";
import ChevronRight from "../assets/icons/chevronRight";

export type TextProps = DefaultText["props"];
export type ViewProps = DefaultView["props"];

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
      style={[{ fontFamily: fontFamily, color: "white", fontSize: 16 }, style]}
      {...otherProps}
    />
  );
}

export const Seperator = ({ style }: ViewProps) => {
  return (
    <DefaultView
      style={[
        {
          height: 1,
          width: "100%",
          backgroundColor: Colors.border,
        },
        style,
      ]}
    />
  );
};

export const Box = ({
  children,
  style,
  ...rest
}: {
  children: JSX.Element | JSX.Element[];
  style?: ViewProps["style"];
  onLayout?: (event: LayoutChangeEvent) => void;
}) => {
  return (
    <DefaultView
      style={[
        {
          backgroundColor: Colors.secondary,
          paddingHorizontal: 29,
          paddingVertical: 19,
          borderColor: Colors.border,
          borderWidth: 1,
          borderRadius: 4,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </DefaultView>
  );
};

export const Breadcrumbs = ({
  links,
  style,
}: {
  links: Array<{ name: string; screenName?: string }>;
  style?: ViewProps["style"];
}) => {
  const navigation = useNavigation() as any;

  return (
    <DefaultView
      style={[
        {
          display: "flex",
          marginBottom: 30,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {links.map((e, c) => {
        return (
          <DefaultView
            key={`${e.name}-c`}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {c + 1 === links.length ? (
              <Text style={{ fontWeight: "400", fontSize: 16 }}>{e.name}</Text>
            ) : (
              <>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate(e.screenName || e.name, {
                      showToast: undefined,
                    })
                  }
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {e.name}
                  </Text>
                </TouchableWithoutFeedback>
                <ChevronRight
                  width="10"
                  height="10"
                  fill="none"
                  style={{ marginHorizontal: 5 }}
                />
              </>
            )}
          </DefaultView>
        );
      })}
    </DefaultView>
  );
};

export const FlexFull = ({
  children,
  additionalHeight,
}: {
  children: JSX.Element | JSX.Element[];
  additionalHeight?: number;
}) => {
  return (
    <DefaultView
      style={{
        position: "relative",
        flex: 1,
        minHeight:
          Dimensions.get("window").height - 108 - 95 - (additionalHeight || 0),
        paddingBottom: 55,
      }}
    >
      <DefaultView
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </DefaultView>
    </DefaultView>
  );
};

export const LongButton = ({
  last,
  text,
  marginBottom,
  style,
  ...rest
}: ButtonType & {
  marginBottom?: number;
  text: string;
  last?: boolean;
}) => {
  return (
    <Button
      style={[
        {
          marginBottom: last ? 0 : marginBottom || 20,
          justifyContent: "flex-start",
          gap: 15,
          paddingHorizontal: 20,
          paddingVertical: 15,
          minHeight: 0,
        },
        style,
      ]}
      textStyle={{ fontSize: 16 }}
      children={text}
      {...rest}
    />
  );
};
