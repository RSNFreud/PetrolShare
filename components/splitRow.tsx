import { ReactNode, useState } from "react";
import { Animated, View } from "react-native";
import { calculateWidth } from "../screens/invoices/invoice";

type PropsType = {
  elements: ReactNode[];
  gap?: number;
  style?: View["props"]["style"];
  seperator?: ReactNode;
  withoutFade?: boolean;
};

export default ({
  elements,
  gap,
  style,
  withoutFade,
  seperator,
}: PropsType) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      {elements.map((e, count) => (
        <>
          <View
            style={{
              flex: 1,
            }}
          >
            {e}
          </View>
          {count !== elements.length - 1 && seperator && seperator}
        </>
      ))}
    </View>
  );
};
