import axios from "axios";
import React, { useState, useContext } from "react";
import Toast from "react-native-toast-message";
import Input from "../../components/Input";
import { Button } from "../../components/Themed";
import { AuthContext } from "../../hooks/context";

export default ({ handleClose }: { handleClose: any }) => {
  const [emailAddress, setEmailAddress] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ emailAddress: "", validation: "" });
  const { retrieveData } = useContext(AuthContext);

  const validateForm = () => {
    if (!emailAddress || !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailAddress))
      return setErrors({
        emailAddress: "Please enter a valid email address",
        validation: "",
      });
    // Send email with link to confirm email change
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_ADDRESS + `/user/change-email`, {
        authenticationKey: retrieveData().authenticationKey,
        newEmail: emailAddress,
      })
      .then(() => {
        setLoading(false);
        handleClose();
        Toast.show({
          type: "default",
          text1:
            "A confirmation email has been sent to your inbox to change your address",
        });
      })
      .catch((err) => {});
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
      <Button handleClick={validateForm} loading={loading}>
        Change email
      </Button>
    </>
  );
};
