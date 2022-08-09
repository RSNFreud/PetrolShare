import React from "react";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import StepCircle from "./stepCircle";

type PropTypes = {
  stage: number;
};

export default ({ stage }: PropTypes) => {
  const bar = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!bar.current) return;
  }, []);
  const handleWidth = ({ nativeEvent }: any) => {
    const { width } = nativeEvent.layout;
    setWidth(width / 2 - 45);
  };

  return (
    <View
      onLayout={handleWidth}
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        maxWidth: "100%",
        marginBottom: 57,
      }}
    >
      <StepCircle active withBar={false} width={30} />
      <StepCircle width={width} active={stage >= 1} />
      <StepCircle width={width} active={stage >= 2} />
    </View>
  );
};
