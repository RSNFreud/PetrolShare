import React, { useCallback, useContext, useState } from "react";

import Input from "../components/Input";
import { Button, Layout, Seperator, Text } from "../components/Themed";
import Popup from "../components/Popup";
import { Pressable, View } from "react-native";
import { AuthContext } from "../navigation";

export default ({ navigation }: any) => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useContext(AuthContext);

  const handleSubmit = (
    formData: {},
    setFormErrors: React.SetStateAction<any>,
    submitAction: () => void
  ) => {
    let errors = {
      email: "",
      password: "",
    };

    Object.keys(formData).map((e) => {
      const value = (formData as any)[e];
      (errors as any)[e] = value ? "" : "Please fill out this field!";

      if (
        e === "email" &&
        value &&
        !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
      ) {
        (errors as any)[e] = "Please enter a valid email!";
      }
    });
    setFormErrors(errors);

    if (Object.values(errors).filter((e) => e.length).length === 0)
      submitAction();
  };

  const ForgotPassword = useCallback(() => {
    const [formData, setFormData] = useState({
      email: "",
    });
    const [formErrors, setFormErrors] = useState({
      email: "",
    });
    const [isEmailSent, setIsEmailSent] = useState(false);

    return (
      <Popup
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
              handleInput={(e) => setFormData({ email: e })}
              style={{ marginBottom: 20 }}
              errorMessage={formErrors.email}
            />
            <Button
              handleClick={() =>
                handleSubmit(formData, setFormErrors, () =>
                  setIsEmailSent(true)
                )
              }
            >
              Send Recovery Email
            </Button>
          </>
        )}
      </Popup>
    );
  }, [visible]);

  return (
    <Layout>
      <Input
        keyboardType="email-address"
        handleInput={(e) => setFormData({ ...formData, email: e })}
        placeholder="Enter email address"
        label="Email:"
        errorMessage={formErrors.email}
        style={{ marginBottom: 20 }}
      />
      <Input
        password={true}
        placeholder="Enter password"
        label="Password:"
        errorMessage={formErrors.password}
        style={{ marginBottom: 15 }}
        handleInput={(e) => setFormData({ ...formData, password: e })}
      />
      <Pressable
        onPress={() => setVisible(true)}
        style={{ marginBottom: 28 }}
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
        handleClick={() =>
          handleSubmit(formData, setFormErrors, () => signIn({ ...formData }))
        }
      >
        Submit
      </Button>
      <Seperator style={{ marginVertical: 30 }} />
      <Button handleClick={() => navigation.navigate("Register")} style="ghost">
        Register
      </Button>
      <ForgotPassword />
    </Layout>
  );
};
