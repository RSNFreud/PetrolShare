/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text as DefaultText,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View as DefaultView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Toast from "react-native-toast-message";
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
  styles?: TouchableOpacity["props"]["style"];
  noText?: boolean;
  loading?: boolean;
};

export const Button = ({
  children,
  handleClick,
  noText,
  size,
  style,
  color,
  loading,
  styles,
}: ButtonType) => {
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
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
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
          minHeight: variableProperties.height,
          backgroundColor: variableProperties.backgroundColor,
        },
        styles,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : noText ? (
        children
      ) : (
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
      )}
    </TouchableOpacity>
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

export const Box = ({
  children,
  style,
}: {
  children: JSX.Element;
  style?: ViewProps["style"];
}) => {
  return (
    <DefaultView
      style={[
        {
          backgroundColor: "rgba(7, 95, 113, 0.2)",
          paddingHorizontal: 29,
          paddingVertical: 19,
          borderColor: "#137B91",
          borderWidth: 1,
          borderRadius: 4,
        },
        style,
      ]}
    >
      {children}
    </DefaultView>
  );
};

import * as SecureStore from "expo-secure-store";

export const Layout = ({
  children,
  style,
}: {
  children: any;
  style?: ViewProps["style"];
}) => {
  const navigation = useNavigation();
  const { isLoggedIn } = useContext(AuthContext);
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (navigation) {
      navigation.addListener("state", async (e: any) => {
        try {
          if (await SecureStore.getItemAsync("firstLoad")) {
            await SecureStore.deleteItemAsync("firstLoad");
            return opacity.setValue(1);
          }
        } catch {
          return opacity.setValue(1);
        }

        opacity.setValue(0);
        fadeIn();
      });
    } else {
      fadeIn();
    }
  }, []);

  const ToastConfig = {
    default: ({ text1 }: { text1?: string }) => (
      <DefaultView
        style={{
          backgroundColor: "#0B404A",
          borderColor: "#1196B0",
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 4,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "white",
            fontWeight: "700",
            lineHeight: 24,
          }}
        >
          {text1}
        </Text>
      </DefaultView>
    ),
  };

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={[{ paddingHorizontal: 20 }, style]}>
      <Header isLoggedIn={isLoggedIn} />
      <Animated.View style={{ opacity: opacity }}>{children}</Animated.View>
      <Toast config={ToastConfig} />
    </ScrollView>
  );
};

export const Breadcrumbs = ({
  links,
}: {
  links: Array<{ name: string; screenName?: string }>;
}) => {
  const navigation = useNavigation();

  return (
    <DefaultView
      style={{
        display: "flex",
        marginBottom: 30,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {links.map((e, c) => {
        return (
          <DefaultView
            key={e.name}
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
                  onPress={
                    // @ts-ignore
                    () => navigation.navigate(e.screenName || e.name)
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
                <Svg
                  width="7"
                  height="7"
                  fill="none"
                  viewBox="0 0 7 7"
                  style={{ marginHorizontal: 5 }}
                >
                  <Path
                    fill="#fff"
                    d="M5.036 3.68L.176 1.786V.48l5.837 2.584v.8l-.977-.184zM.176 5.348L5.05 3.413l.963-.143v.792L.176 6.654V5.348z"
                  ></Path>
                </Svg>
              </>
            )}
          </DefaultView>
        );
      })}
    </DefaultView>
  );
};
