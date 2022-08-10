import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { View, Dimensions, TouchableWithoutFeedback } from "react-native";
import Input from "../../components/Input";
import { Box, Button, Layout, Text } from "../../components/Themed";
import generateGroupID from "../../hooks/generateGroupID";
import Stage from "./stage";
import StepBar from "./stepBar";
import * as Clipboard from "expo-clipboard";
import Svg, { Path } from "react-native-svg";
import { AuthContext } from "../../navigation";

const groupID = generateGroupID();

export default React.memo(({ navigation }: any) => {
  const { signIn } = useContext(AuthContext);

  const [stage, setStage] = useState(0);
  const [previousStage, setPreviousStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState("left" as "left" | "right");

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  } as any);
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const validateStage = (elements: Array<any>, submitAction: () => any) => {
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

      if (e === "password" && value.length < 6) {
        errors[e] = "Please enter a password longer than 6 characters";
      }
      if (e === "confirmPassword" && value != formData["password"]) {
        errors[e] = "The password you entered does not match";
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

  const nextPage = () => {
    if (isLoading) setIsLoading(false);

    const currentPage = stage;
    setStage(currentPage + 1);

    setDirection("right");
    setPreviousStage(currentPage);

    setTimeout(() => {
      setIsLoading(true);
    }, 400);
  };

  const previousPage = () => {
    if (isLoading) setIsLoading(false);

    const currentPage = stage;
    setStage(currentPage - 1);

    setDirection("left");
    setPreviousStage(currentPage);

    setTimeout(() => {
      setIsLoading(true);
    }, 400);
  };

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(groupID || "test");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  const login = () => {
    signIn &&
      signIn({
        fullName: formData["fullName"],
        emailAddress: formData["emailAddress"],
      });
    navigation.popToTop();
  };

  const Steps = [
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
          handleInput={(e) => setFormData({ ...formData, emailAddress: e })}
          placeholder="Enter email address"
          label="Email:"
          keyboardType="email-address"
          style={{ marginBottom: 20 }}
          value={formData["emailAddress"]}
          errorMessage={formErrors["emailAddress"]}
        />
      </View>
      <View>
        <Button
          styles={{ marginBottom: 20 }}
          handleClick={() => {
            validateStage(["fullName", "emailAddress"], () => nextPage());
          }}
        >
          Continue
        </Button>
        <Button style="ghost" handleClick={() => navigation.navigate("Login")}>
          Cancel
        </Button>
      </View>
    </>,
    <>
      <View>
        <Input
          handleInput={(e) => setFormData({ ...formData, password: e })}
          value={formData["password"]}
          errorMessage={formErrors["password"]}
          placeholder="Enter your password"
          label="Password:"
          password
          style={{ marginBottom: 20 }}
        />
        <Input
          handleInput={(e) => setFormData({ ...formData, confirmPassword: e })}
          value={formData["confirmPassword"]}
          errorMessage={formErrors["confirmPassword"]}
          placeholder="Confirm your password"
          label="Confirm Password:"
          password
        />
      </View>
      <View>
        <Button
          styles={{ marginBottom: 20 }}
          handleClick={() =>
            validateStage(["password", "confirmPassword"], () => nextPage())
          }
        >
          Submit
        </Button>
        <Button style="ghost" handleClick={() => previousPage()}>
          Back
        </Button>
      </View>
    </>,
    <>
      <Box>
        <Text style={{ fontSize: 16, lineHeight: 25 }}>
          Thank you for registering for PetrolShare{" "}
          <Text style={{ fontWeight: "bold" }}>
            {formData["fullName"] || "Username"}
          </Text>
          .{"\n"}
          {"\n"}
          Your Group ID number is:
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 32, marginVertical: 21 }}
          >
            {groupID}
          </Text>
          <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
            {copied ? (
              <Svg width="26" height="26" fill="none" viewBox="0 0 26 26">
                <Path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4.469 14.219l5.687 5.687L21.531 7.72"
                ></Path>
              </Svg>
            ) : (
              <Svg width="26" height="26" fill="none" viewBox="0 0 26 26">
                <Path
                  fill="#fff"
                  d="M21.306 5.056H7.583A1.083 1.083 0 006.5 6.139v17.333a1.084 1.084 0 001.083 1.084h13.723a1.084 1.084 0 001.083-1.084V6.14a1.083 1.083 0 00-1.083-1.083zm-.362 18.055h-13V6.5h13v16.611z"
                ></Path>
                <Path
                  fill="#fff"
                  d="M18.778 2.528a1.083 1.083 0 00-1.083-1.084H3.972A1.083 1.083 0 002.89 2.528V19.86a1.083 1.083 0 001.083 1.083h.361V2.89h14.445v-.361z"
                ></Path>
              </Svg>
            )}
          </TouchableWithoutFeedback>
        </View>
        <Text style={{ fontSize: 16, lineHeight: 25 }}>
          Share this with other members in your group to add them to your
          account. You can access this ID number at any time from your
          dashboard.
        </Text>
      </Box>
      <Button handleClick={() => login()} styles={{ marginTop: 25 }}>
        Continue to Dashboard
      </Button>
    </>,
  ];

  return (
    <Layout>
      <StepBar stage={stage} />
      <View
        style={{
          position: "relative",
          flex: 1,
          minHeight: Dimensions.get("window").height - 108 - 87,
        }}
      >
        {Steps.map((children, count) => (
          <Stage {...stageProps} pageNumber={count} key={"stage " + count}>
            {children}
          </Stage>
        ))}
      </View>
    </Layout>
  );
});
