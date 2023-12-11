import React, { useContext } from "react";
import { ViewProps, View, ScrollView } from "react-native";
import { AuthContext } from "../hooks/context";
import Dropdown from "./Dropdown";

export type GroupType = {
  currency: string;
  distance: string;
  groupID: string;
  petrol: string;
  premium: boolean;
};

export default ({
  children,
  style,
  homepage,
  noScrollView,
  noBottomPadding,
  ...rest
}: {
  children: any;
  style?: ViewProps["style"];
  onLayout?: any;
  noScrollView?: boolean;
  noBottomPadding?: boolean;
  homepage?: boolean;
}) => {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) return <></>;

  return (
    <>
      <View
        style={[
          style,
          {
            width: "100%",
            position: "relative",
            display: "flex",
            flex: 1,
            overflow: "hidden",
          },
        ]}
        {...rest}
      >
        {homepage || noScrollView ? (
          <View
            style={{
              paddingBottom: homepage || noBottomPadding ? 0 : 55,
              paddingHorizontal: homepage ? 0 : 25,
              flex: 1,
              display: "flex",
            }}
          >
            <>{children}</>
          </View>
        ) : (
          <ScrollView
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={{
              paddingBottom: noBottomPadding ? 0 : 55,
              paddingHorizontal: homepage ? 0 : 25,
            }}
            style={{ flex: 1, display: "flex" }}
          >
            <>{children}</>
          </ScrollView>
        )}
      </View>
    </>
  );
};
