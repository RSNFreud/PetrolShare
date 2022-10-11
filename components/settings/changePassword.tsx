import axios from "axios";
import React, { useState, useContext } from "react";
import Toast from "react-native-toast-message";
import Input from "../Input";
import { Button, Seperator } from "../Themed";
import { AuthContext } from "../../hooks/context";

export default ({
  handleClose,
  handleBack,
}: {
  handleClose: () => void;
  handleBack: () => void;
}) => {
  const [data, setData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const { retrieveData, signOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    validation: "",
  });

  const validateForm = () => {
    let errors: any = {};

    for (let i = 0; i < Object.keys(data).length; i++) {
      const key = Object.keys(data)[i];
      const value = data[key];
      if (!value) errors[key] = "Please complete this field!";

      if (value && key === "password" && value.length < 6) {
        errors[key] = "Please enter a password longer than 6 characters";
      }
      if (key === "confirmPassword" && value != data["password"]) {
        errors[key] = "The password you entered does not match";
      }
    }

    setErrors({ ...errors });
    if (
      Object.values(errors).filter((e) => (e as string).length).length === 0
    ) {
      setLoading(true);
      axios
        .post(
          (process.env as any).REACT_APP_API_ADDRESS + `/user/change-password`,
          {
            authenticationKey: retrieveData().authenticationKey,
            newPassword: data.password,
          }
        )
        .then(() => {
          setLoading(false);
          handleClose();
          Toast.show({
            type: "default",
            text1:
              "Your password has successfully been changed! Please relogin to the application.",
          });
          setTimeout(() => {
            signOut();
          }, 1200);
        })
        .catch((err) => {});
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
        styles={{ marginBottom: 15 }}
      >
        Change password
      </Button>
      <Button handleClick={handleBack} style={"ghost"}>
        Back
      </Button>
    </>
  );
};
