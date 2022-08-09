import React from "react";
import { useState } from "react";
import { View, Dimensions } from "react-native";
import Input from "../../components/Input";
import { Box, Button, Layout, Text } from "../../components/Themed";
import Stage from "./stage";
import StepBar from "./stepBar";

export default React.memo(({ navigation }: any) => {
  const [stage, setStage] = useState(1);
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

    setTimeout(() => {
      setIsLoading(true);
    }, 400);
  };

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
                Cancel
              </Button>
            </View>
          </>
        </Stage>
        <Stage {...stageProps} pageNumber={2}>
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
                handleInput={(e) =>
                  setFormData({ ...formData, confirmPassword: e })
                }
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
                  validateStage(["password", "confirmPassword"], () =>
                    changePage(3)
                  )
                }
              >
                Submit
              </Button>
              <Button style="ghost" handleClick={() => changePage(1)}>
                Back
              </Button>
            </View>
          </>
        </Stage>
        <Stage {...stageProps} pageNumber={3}>
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
              <Text
                style={{ fontWeight: "bold", fontSize: 32, marginVertical: 21 }}
              >
                243546457575
              </Text>
              <Text style={{ fontSize: 16, lineHeight: 25 }}>
                Share this with other members in your group to add them to your
                account. You can access this ID number at any time from your
                dashboard.
              </Text>
            </Box>
            <Button
              handleClick={() => navigation.navigate("")}
              styles={{ marginTop: 25 }}
            >
              Continue to Dashboard
            </Button>
          </>
        </Stage>
      </View>
    </Layout>
  );
});
