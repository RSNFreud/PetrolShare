import Popup from "@components/Popup";
import Button from "@components/button";
import Input from "@components/input";
import { Text } from "@components/text";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { ErrorType } from "types";

import { APP_ADDRESS } from "../../constants";

type PropTypes = {
  visible: boolean;
  emailAddress?: string;
  setVisible: (e: boolean) => void;
};

export default ({ visible, setVisible, emailAddress }: PropTypes) => {
  const [formData, setFormData] = useState({
    emailAddress: emailAddress || "",
  });
  const [formErrors, setFormErrors] = useState<ErrorType>({
    emailAddress: "",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) setFormData({ emailAddress: emailAddress || "" });
  }, [emailAddress]);

  const sendEmail = async () => {
    const errors: ErrorType = {};

    Object.entries(formData).map(([key, value]) => {
      errors[key] = value ? "" : "Please fill out this field!";

      if (
        key === "emailAddress" &&
        value &&
        !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
      ) {
        errors[key] = "Please enter a valid email!";
      }
    });
    setFormErrors(errors);

    if (Object.values(errors).filter((e) => e.length).length) return;
    setFormErrors(errors);
    setLoading(true);
    try {
      const res = await fetch(`${APP_ADDRESS}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: formData.emailAddress,
        }),
      });
      if (res.ok) {
        setLoading(false);
        setIsEmailSent(true);
      } else {
        setFormErrors({ emailAddress: await res.text() });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setIsEmailSent(true);
      console.log("====================================");
      console.log("Error found:", err);
      console.log("====================================");
    }
  };

  return (
    <Popup
      title="Forgot Your Password"
      visible={visible}
      handleClose={() => {
        setVisible(false);
        setIsEmailSent(false);
      }}
    >
      {isEmailSent ? (
        <View>
          <>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Thank you for your request
            </Text>
            <Text style={{ lineHeight: 21, fontSize: 16 }}>
              Your request has been received and if the email exists in our
              database you will receive an email within the next few minutes
              with password reset instructions.
            </Text>
          </>
        </View>
      ) : (
        <>
          <Input
            placeholder="Enter email address"
            label="Enter email address"
            keyboardType="email-address"
            value={formData.emailAddress}
            handleInput={(e) => setFormData({ emailAddress: e })}
            style={{ marginBottom: 25 }}
            errorMessage={formErrors.emailAddress}
          />
          <Button
            loading={loading}
            handleClick={sendEmail}
            text="Send Recovery Email"
          />
        </>
      )}
    </Popup>
  );
};
