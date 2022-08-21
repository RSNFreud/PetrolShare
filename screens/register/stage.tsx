import React from "react";
import { useEffect, useState } from "react";
import { Animated, Dimensions } from "react-native";

type PropTypes = {
  pageNumber: number;
  children: JSX.Element;
  stage: number;
  direction: "left" | "right";
  isLoading: boolean;
  previousStage: number;
};

export default React.memo(
  ({
    pageNumber,
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
    const active = pageNumber === stage;
    const previouslyActive = previousStage === pageNumber;

    useEffect(() => {
      if (isLoading && active) return position.setValue(0);
      if (previouslyActive) position.setValue(0);
      if (isLoading || (!active && !previouslyActive))
        return position.setValue(-windowWidth);

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