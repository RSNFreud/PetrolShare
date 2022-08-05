import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import Input from "../components/Input";
import { Button } from "../components/Themed";

const StepCircle = ({
  active,
  width,
  withBar = true,
  barHighlight = true,
}: {
  active?: boolean;
  width: string | number;
  withBar?: boolean;
  barHighlight?: boolean;
}) => {
  const styles = StyleSheet.create({
    circle: {
      height: 30,
      width: 30,
      display: "flex",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      backgroundColor: active ? "#1196B0" : "#0B404A",
    },
    bar: {
      height: 4,
      backgroundColor: active && barHighlight ? "#1196B0" : "#0B404A",
      width: width,
    },
    wrapper: {
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <View style={styles.wrapper}>
      {withBar && <View style={styles.bar} />}
      <View style={styles.circle}>
        {active && (
          <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <Path
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.75 8.75l3.5 3.5 7-7.5"
            ></Path>
          </Svg>
        )}
      </View>
    </View>
  );
};

const StepBar = ({ stage }: { stage: number }) => {
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
      <StepCircle width={width} active={stage >= 2} />
      <StepCircle width={width} active={stage >= 3} />
    </View>
  );
};

type StageProps = {
  pageNumber: number;
  first?: boolean;
  children: JSX.Element;
  stage: number;
  direction: "left" | "right";
  isLoading: boolean;
  previousStage: number;
};

const Stage = ({
  pageNumber,
  first,
  stage,
  direction,
  children,
  isLoading,
  previousStage,
}: StageProps) => {
  const windowWidth = Dimensions.get("window").width;
  const position = new Animated.Value(
    direction === "left" ? -windowWidth : windowWidth
  );
  const [active, setActive] = useState(false);
  const [previouslyActive, setPreviouslyActive] = useState(false);

  useEffect(() => {
    if (first && active && isLoading) return position.setValue(0);
    if (isLoading || (!active && !previouslyActive)) return;
    if (previouslyActive) position.setValue(0);

    Animated.sequence([
      Animated.timing(position, {
        toValue: active ? 0 : direction === "left" ? windowWidth : -windowWidth,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [position]);

  useEffect(() => {
    if (stage === pageNumber) setActive(true);
    else setActive(false);
    if (previousStage === pageNumber) setPreviouslyActive(true);
    else setPreviouslyActive(false);
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
};

export default ({ navigation }: any) => {
  const [stage, setStage] = useState(1);
  const [previousStage, setPreviousStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState("left" as "left" | "right");

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
  } as any);
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    emailAddress: "",
  });

  const changePage = (page: number) => {
    if (isLoading) setIsLoading(false);
    setStage(page);

    if (page > stage) {
      setDirection("right");
      setPreviousStage(page - 1);
    } else {
      setDirection("left");
      setPreviousStage(page + 1);
    }
  };

  const validateStage = (elements: Array<any>, submitAction: () => any) => {
    submitAction();
    let errors: any = {};
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      if (!(e in formData)) return;
      const value = formData[e];
      if (!value) errors[e] = "Please complete this field!";
      if (
        e === "emailAddress" &&
        value &&
        !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
      ) {
        errors[e] = "Please enter a valid email!";
      }
    }

    setFormErrors({ ...errors });
    if (Object.values(errors).filter((e) => (e as string).length).length === 0)
      submitAction();
  };

  const stageProps = {
    stage: stage,
    direction: direction,
    isLoading: isLoading,
    previousStage: previousStage,
  };

  return (
    <>
      <StepBar stage={stage} />
      <View style={{ position: "relative", height: "100%", flex: 1 }}>
        <Stage {...stageProps} first pageNumber={1}>
          <>
            <View>
              <Input
                handleInput={(e) => setFormData({ ...formData, fullName: e })}
                placeholder="Enter your name"
                label="Full Name:"
                style={{ marginBottom: 20 }}
                value={formData["fullName"]}
                errorMessage={formErrors["fullName"]}
              />
              <Input
                handleInput={(e) =>
                  setFormData({ ...formData, emailAddress: e })
                }
                placeholder="Enter email address"
                label="Email:"
                style={{ marginBottom: 20 }}
                value={formData["emailAddress"]}
                errorMessage={formErrors["emailAddress"]}
              />
            </View>
            <View>
              <Button
                styles={{ marginBottom: 20 }}
                handleClick={() => {
                  validateStage(["fullName", "emailAddress"], () =>
                    changePage(2)
                  );
                }}
              >
                Continue
              </Button>
              <Button
                style="ghost"
                handleClick={() => navigation.navigate("Login")}
              >
                Back
              </Button>
            </View>
          </>
        </Stage>
        <Stage {...stageProps} pageNumber={2}>
          <>
            <View>
              <Input
                placeholder="Enter your name"
                label="Full Name:"
                style={{ marginBottom: 20 }}
              />
              <Input
                placeholder="Enter email address"
                label="Email:"
                style={{ marginBottom: 20 }}
              />
            </View>
            <View>
              <Button
                styles={{ marginBottom: 20 }}
                handleClick={() => changePage(3)}
              >
                Testing 1
              </Button>
              <Button style="ghost" handleClick={() => changePage(1)}>
                Back
              </Button>
            </View>
          </>
        </Stage>
        <Stage {...stageProps} pageNumber={3}>
          <>
            <View>
              <Input
                placeholder="Enter your name"
                label="Full Name:"
                style={{ marginBottom: 20 }}
              />
              <Input
                placeholder="Enter email address"
                label="Email:"
                style={{ marginBottom: 20 }}
              />
            </View>
            <View>
              <Button
                styles={{ marginBottom: 20 }}
                handleClick={() => changePage(3)}
              >
                Test
              </Button>
              <Button style="ghost" handleClick={() => changePage(2)}>
                Back
              </Button>
            </View>
          </>
        </Stage>
      </View>
    </>
  );
};
