import { useCallback, useContext, useState } from "react";

import Input from "../components/Input";
import { Button, Seperator, Text } from "../components/Themed";
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

  // const login = useContext(isLoggedIn);

  const handleSubmit = () => {
    let errors = {
      email: "",
      password: "",
    };

    Object.keys(formData).map((e) => {
      const value = (formData as any)[e];
      (errors as any)[e] = value ? "" : "Please fill out this field!";
    });
    setFormErrors(errors);

    if (Object.values(errors).filter((e) => e.length).length === 0)
      signIn({ ...formData });
  };

  const ForgotPassword = useCallback(() => {
    const [formData, setFormData] = useState({
      email: "",
    });
    const [formErrors, setFormErrors] = useState({
      email: "",
    });
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = () => {
      let errors = {
        email: "",
      };
      Object.keys(formData).map((e) => {
        const value = (formData as any)[e];
        (errors as any)[e] = value ? "" : "Please fill out this field!";
      });
      setFormErrors(errors);
      if (Object.values(errors).filter((e) => e.length).length === 0) {
        setIsEmailSent(true);
      }
    };

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
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Thank you for your request
              </Text>
              <Text style={{ lineHeight: 21, fontSize: 14 }}>
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
              handleInput={(e) => setFormData({ email: e })}
              style={{ marginBottom: 15 }}
              errorMessage={formErrors.email}
            />
            <Button handleClick={handleSubmit}>Send Recovery Email</Button>
          </>
        )}
      </Popup>
    );
  }, [visible]);

  return (
    <View>
      <Input
        handleInput={(e) => setFormData({ ...formData, email: e })}
        placeholder="Enter username"
        label="Username"
        errorMessage={formErrors.email}
        style={{ marginBottom: 15 }}
      />
      <Input
        password={true}
        placeholder="Enter password"
        label="Enter password"
        errorMessage={formErrors.password}
        style={{ marginBottom: 15 }}
        handleInput={(e) => setFormData({ ...formData, password: e })}
      />
      <Pressable onPress={() => setVisible(true)} android_disableSound={true}>
        <Text
          style={{
            fontSize: 14,
            textDecorationLine: "underline",
            marginBottom: 28,
          }}
        >
          Forgot my password...
        </Text>
      </Pressable>
      <Button handleClick={handleSubmit}>Submit</Button>
      <Seperator style={{ marginVertical: 25 }} />
      <Button handleClick={() => navigation.navigate("Register")} style="ghost">
        Register
      </Button>
      <ForgotPassword />
    </View>
  );
};
