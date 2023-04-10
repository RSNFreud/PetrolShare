import React, { useCallback, useContext, useEffect, useState } from "react";

import Input from "../../components/Input";
import { Button, Seperator, Text } from "../../components/Themed";
import Popup from "../../components/Popup";
import { Pressable, TouchableWithoutFeedback, View } from "react-native";
import { AuthContext } from "../../hooks/context";
import axios from "axios";
import Layout from "../../components/Layout";
import config from "../../config";
import testID from "../../hooks/testID";
import ForgotPassword from "./forgotPassword";

export default ({ navigation }: any) => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    emailAddress: "",
    password: "",
    verification: "",
  });

  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  const { signIn } = useContext(AuthContext);

  const handleSubmit = (
    formData: {},
    setFormErrors: React.SetStateAction<any>,
    submitAction: () => void
  ) => {
    let errors = {
      emailAddress: "",
      password: "",
    };

    Object.keys(formData).map((e) => {
      const value = (formData as any)[e];
      (errors as any)[e] = value ? "" : "Please fill out this field!";

      if (
        e === "emailAddress" &&
        value &&
        !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
      ) {
        (errors as any)[e] = "Please enter a valid email!";
      }
    });
    setFormErrors(errors);

    if (Object.values(errors).filter((e) => e.length).length === 0) {
      submitAction();
    }
  };

  const handleLogin = () => {
    if (!signIn) return;
    setVerificationEmailSent(false);
    setFormErrors({ emailAddress: "", password: "", verification: "" });
    setLoading(true);
    signIn({ ...formData }).catch((err: string) => {
      console.log(err);

      setLoading(false);
      setFormErrors({ emailAddress: "", password: "", verification: err });
    });
  };

  const resendVerification = () => {
    axios
      .post(config.REACT_APP_EMAIL_API_ADDRESS + "/resend", {
        emailAddress: formData.emailAddress,
      })
      .then(async () => {
        setVerificationEmailSent(true);
      })
      .catch(({ response }) => { });
  };

  return (
    <Layout>
      <Input
        testID={testID("emailaddress")}
        nativeID="emailaddress"
        keyboardType="email-address"
        handleInput={(e) => setFormData({ ...formData, emailAddress: e })}
        placeholder="Enter email address"
        label="Email:"
        value={formData.emailAddress}
        errorMessage={formErrors.emailAddress}
        style={{ marginBottom: 20 }}
      />
      <Input
        password={true}
        testID={testID("password")}
        value={formData.password}
        nativeID="password"
        placeholder="Enter password"
        label="Password:"
        errorMessage={formErrors.password}
        style={{ marginBottom: 15 }}
        handleInput={(e) => setFormData({ ...formData, password: e })}
      />
      {!!formErrors.verification && (
        <View
          style={{
            marginTop: 5,
            marginBottom: 15,
            backgroundColor: verificationEmailSent ? "#484848" : "#EECFCF",
            borderRadius: 4,
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          {verificationEmailSent ? (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "400" }}>
              Successfully resent the verification email to the address
              provided! Click{" "}
              <TouchableWithoutFeedback onPress={resendVerification}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "400",
                    textDecorationStyle: "solid",
                    textDecorationLine: "underline",
                  }}
                >
                  here
                </Text>
              </TouchableWithoutFeedback>{" "}
              to send it again{" "}
            </Text>
          ) : (
            <Text style={{ color: "#7B1D1D", fontSize: 16, fontWeight: "400" }}>
              {formErrors.verification === "Please verify your account!" ? (
                <>
                  Please verify your account by clicking the link in the email
                  we sent! Click{" "}
                  <TouchableWithoutFeedback onPress={resendVerification}>
                    <Text
                      style={{
                        color: "#7B1D1D",
                        fontSize: 16,
                        textDecorationStyle: "solid",
                        textDecorationLine: "underline",
                        fontWeight: "400",
                      }}
                    >
                      here
                    </Text>
                  </TouchableWithoutFeedback>{" "}
                  to resend your verification email.
                </>
              ) : (
                formErrors.verification
              )}
            </Text>
          )}
        </View>
      )}
      <Pressable
        onPress={() => setVisible(true)}
        style={{ paddingBottom: 30 }}
        android_disableSound={true}
      >
        <Text
          style={{
            fontSize: 16,
            textDecorationLine: "underline",
          }}
        >
          Forgot my password...
        </Text>
      </Pressable>
      <Button
        loading={loading}
        handleClick={() =>
          handleSubmit(formData, setFormErrors, () => handleLogin())
        }
      >
        Submit
      </Button>
      <Seperator style={{ marginVertical: 30 }} />
      <Button handleClick={() => navigation.navigate("Register")} style="ghost">
        Register
      </Button>
      <ForgotPassword visible={visible} setVisible={e => setVisible(e)} handleSubmit={handleSubmit} />
    </Layout>
  );
};
