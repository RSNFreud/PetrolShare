import { sendPostRequest } from "hooks/sendFetchRequest";
import React, { useState, useContext } from "react";

import { PropsType } from "./default";
import { API_ADDRESS } from "../../constants";
import { setItem } from "../../hooks";
import { AuthContext } from "../../hooks/context";
import Button from "../button";
import Input from "../input";

export default ({ handleClose, handleChange, handleUpdate }: PropsType) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ emailAddress: "", validation: "" });
  const { retrieveData } = useContext(AuthContext);

  const validateForm = async () => {
    if (!emailAddress || !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailAddress))
      return setErrors({
        emailAddress: "Please enter a valid email address",
        validation: "",
      });
    // Send email with link to confirm email change
    setLoading(true);
    const res = await sendPostRequest(API_ADDRESS + `/user/change-email`, {
      authenticationKey: retrieveData?.authenticationKey,
      newEmail: emailAddress,
    });

    if (res?.ok) {
      setLoading(false);
      handleUpdate && handleUpdate();
      handleClose();
      setItem(
        "delayedAlert",
        "A confirmation email has been sent to your inbox to change your address",
      );
    }
  };

  return (
    <>
      <Input
        label="Email address"
        handleInput={(e) => setEmailAddress(e)}
        value={emailAddress}
        errorMessage={errors.emailAddress}
        placeholder="Enter a new email address"
        style={{ marginBottom: 20 }}
      />
      <Button
        handleClick={validateForm}
        loading={loading}
        style={{ marginBottom: 15 }}
        text="Change email"
      />

      <Button
        handleClick={() => handleChange("Settings")}
        variant="ghost"
        text="Back"
      />
    </>
  );
};
