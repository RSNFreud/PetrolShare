import axios from "axios";
import { useState, useEffect } from "react";
import { View } from "react-native";
import Input from "@components/input";
import Popup from "@components/Popup";
import { Text } from "@components/text";
import config from "../../config";
import Button from "@components/button";

type PropTypes = {
  visible: boolean;
  setVisible: (e: boolean) => void;
  handleSubmit: (
    formData: {},
    setFormErrors: React.SetStateAction<any>,
    submitAction: () => void
  ) => void;
};

export default ({ visible, setVisible, handleSubmit }: PropTypes) => {
  const [formData, setFormData] = useState({
    emailAddress: "",
  });
  const [formErrors, setFormErrors] = useState({
    emailAddress: "",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmail = () => {
    setLoading(true);
    axios
      .post(config.REACT_APP_API_ADDRESS + `/user/forgot-password`, {
        emailAddress: formData.emailAddress,
      })
      .then(() => {
        setLoading(false);
        setIsEmailSent(true);
      })
      .catch(() => {
        setLoading(false);
        setIsEmailSent(true);
      });
  };

  useEffect(() => {
    if (isEmailSent) {
    }
  }, [isEmailSent]);

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
              database you will recieve an email within the next few minutes
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
            handleInput={(e) => setFormData({ emailAddress: e })}
            style={{ marginBottom: 25 }}
            errorMessage={formErrors.emailAddress}
          />
          <Button
            loading={loading}
            handleClick={() =>
              handleSubmit(formData, setFormErrors, () => sendEmail())
            }
            text="Send Recovery Email"
          />
        </>
      )}
    </Popup>
  );
};
