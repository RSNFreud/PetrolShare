import React, { useContext } from "react";
import { useState } from "react";
import { View, Dimensions } from "react-native";
import Input from "../../components/Input";
import { Box, Button, Text } from "../../components/Themed";
import Layout from "../../components/layout";
import Stage from "./stage";
import StepBar from "./stepBar";
import { AuthContext } from "../../hooks/context";
import axios from "axios";
import config from "../../config";

export default React.memo(({ navigation }: any) => {
  const { register } = useContext(AuthContext);

  const [stage, setStage] = useState(0);
  const [previousStage, setPreviousStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleRegister = async () => {
    if (register) {
      axios
        .post(config.REACT_APP_API_ADDRESS + "/user/register", {
          fullName: formData["fullName"],
          emailAddress: formData["emailAddress"],
          password: formData["password"],
        })
        .then(async ({ data }) => {
          setFormData({ ...formData, key: data });
          nextPage();
        })
        .catch((err) => {
          previousPage();
          setFormErrors({
            ...formErrors,
            emailAddress: "This email address already exists!",
          });
        });
    }
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
          style={{ marginBottom: 20 }}
          label="Confirm Password:"
          password
        />
      </View>
      <View>
        <Button
          styles={{ marginBottom: 20 }}
          handleClick={() =>
            validateStage(["password", "confirmPassword"], () =>
              handleRegister()
            )
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
        <>
          <Text style={{ fontSize: 16, lineHeight: 25 }}>
            Thank you for registering for PetrolShare{" "}
            <Text style={{ fontWeight: "bold" }}>
              {formData["fullName"] || "Username"}
            </Text>
            .{"\n\n"}Please check your email for a confirmation email to
            activate your account.
          </Text>
        </>
      </Box>
      <Button
        handleClick={() => navigation.navigate("Login")}
        styles={{ marginTop: 25 }}
      >
        Back to Login
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
          minHeight: Dimensions.get("screen").height - 108 - 87,
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
