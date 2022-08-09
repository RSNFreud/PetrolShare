import React from "react";
import { useEffect, useState } from "react";
import { Animated, Dimensions } from "react-native";

type PropTypes = {
  pageNumber: number;
  first?: boolean;
  children: JSX.Element;
  stage: number;
  direction: "left" | "right";
  isLoading: boolean;
  previousStage: number;
};

export default React.memo(
  ({
    pageNumber,
    first,
    stage,
    direction,
    children,
    isLoading,
    previousStage,
  }: PropTypes) => {
    const windowWidth = Dimensions.get("window").width;

    const position = new Animated.Value(
      direction === "left" ? -windowWidth : windowWidth
    );
    const [active, setActive] = useState(false);
    const [previouslyActive, setPreviouslyActive] = useState(false);

    useEffect(() => {
      if (isLoading && active) return position.setValue(0);
      if (isLoading || (!active && !previouslyActive))
        return position.setValue(-windowWidth);
      if (previouslyActive) position.setValue(0);

      Animated.sequence([
        Animated.timing(position, {
          toValue: active
            ? 0
            : direction === "left"
            ? windowWidth
            : -windowWidth,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [position]);

    useEffect(() => {
      setActive(stage === pageNumber);
      setPreviouslyActive(previousStage === pageNumber);
    }, [stage]);

    return (
      <Animated.View
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          position: "absolute",
          width: "100%",
          transform: [{ translateX: position }],
          paddingBottom: 55,
        }}
      >
        {children}
      </Animated.View>
    );
  }
);
