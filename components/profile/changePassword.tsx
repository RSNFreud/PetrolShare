import { sendPostRequest } from "hooks/sendFetchRequest";
import React, { useState, useContext } from "react";
import { ErrorType } from "types";

import { PropsType } from "./default";
import { API_ADDRESS } from "../../constants";
import { setItem } from "../../hooks";
import { AuthContext } from "../../hooks/context";
import { Seperator } from "../Themed";
import Button from "../button";
import Input from "../input";

export default ({ handleClose, handleChange }: PropsType) => {
  const [data, setData] = useState<{
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const { retrieveData, signOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    validation: "",
  });

  const validateForm = async () => {
    const errors: ErrorType = {};

    for (let i = 0; i < Object.entries(data).length; i++) {
      const [key, value] = Object.entries(data)[i];
      if (!value) errors[key] = "Please complete this field!";

      if (value && key === "password" && value.length < 6) {
        errors[key] = "Please enter a password longer than 6 characters";
      }
      if (key === "confirmPassword" && value !== data["password"]) {
        errors[key] = "The password you entered does not match";
      }
    }

    setErrors({ ...errors });
    if (Object.values(errors).filter((e) => (e as string).length).length)
      return;
    setLoading(true);
    const res = await sendPostRequest(API_ADDRESS + `/user/change-password`, {
      authenticationKey: retrieveData?.authenticationKey,
      newPassword: data.password,
    });

    if (res?.ok) {
      setLoading(false);
      handleClose();
      setItem(
        "delayedAlert",
        "Your password has successfully been changed! Please relogin to the application.",
      );

      setTimeout(() => {
        if (signOut) signOut();
      }, 1200);
    }
  };

  return (
    <>
      <Input
        label="Current Password"
        handleInput={(e) => setData({ ...data, currentPassword: e })}
        value={data.currentPassword}
        errorMessage={errors.currentPassword}
        placeholder="Enter your current password"
        password
        style={{ marginBottom: 20 }}
      />
      <Input
        label="New Password"
        handleInput={(e) => setData({ ...data, password: e })}
        value={data.password}
        errorMessage={errors.password}
        password
        placeholder="Enter your new password"
        style={{ marginBottom: 20 }}
      />
      <Input
        label="Confirm New Password"
        handleInput={(e) => setData({ ...data, confirmPassword: e })}
        value={data.confirmPassword}
        password
        errorMessage={errors.confirmPassword}
        placeholder="Confirm your new password"
      />
      <Seperator style={{ marginVertical: 30 }} />
      <Button
        handleClick={validateForm}
        loading={loading}
        style={{ marginBottom: 15 }}
        text="Change password"
      />
      <Button
        handleClick={() => handleChange("Settings")}
        variant="ghost"
        text="Back"
      />
    </>
  );
};
