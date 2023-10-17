import { View, TextInput, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { Text } from "./text";
import Colors from "../constants/Colors";
import EyeOpen from "../assets/icons/eyeOpen";
import EyeClosed from "../assets/icons/eyeClosed";

type PropsType = {
  label?: string;
  password?: boolean;
  value?: string;
  placeholder: string;
  style?: TextInput["props"]["style"];
  inputStyle?: TextInput["props"]["style"];
  handleInput?: (e: string) => void;
  nativeID?: string;
  handleBlur?: (e: any) => void;
  errorMessage?: string;
  keyboardType?: TextInput["props"]["keyboardType"];
  testID?: string;
};

export default ({
  label,
  password,
  value,
  placeholder,
  testID,
  style,
  keyboardType,
  handleInput,
  handleBlur,
  nativeID,
  errorMessage,
  inputStyle,
}: PropsType) => {
  const [passwordShown, setPasswordShown] = useState(password);

  const handlePassword = () => {
    setPasswordShown((showPassword) => !showPassword);
  };

  return (
    <View style={style}>
      <>
        {!!label && (
          <Text
            style={{
              fontWeight: "700",
              fontSize: 16,
              lineHeight: 16,
              marginBottom: 10,
              color: "white",
            }}
          >
            {label}
          </Text>
        )}
        <View style={{ position: "relative" }}>
          <TextInput
            testID={testID}
            nativeID={nativeID}
            autoCapitalize="none"
            onChangeText={handleInput}
            onEndEditing={(e) => handleBlur && handleBlur(e)}
            placeholder={placeholder}
            secureTextEntry={password ? passwordShown : false}
            keyboardType={keyboardType}
            placeholderTextColor="rgba(255,255,255,0.8)"
            style={[
              {
                borderColor: Colors.border,
                borderWidth: 1,
                borderStyle: "solid",
                backgroundColor: Colors.primary,
                borderRadius: 4,
                color: "white",
                fontWeight: "400",
                height: 53,
                fontSize: 16,
                paddingHorizontal: 16,
                paddingVertical: 13,
                paddingRight: 50,
              },
              inputStyle,
            ]}
            value={value}
          />
          {password && (
            <TouchableWithoutFeedback onPress={() => handlePassword()}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 48,
                  paddingHorizontal: 10,
                  display: "flex",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {passwordShown ? <EyeOpen /> : <EyeClosed />}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        {!!errorMessage && (
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              fontWeight: "400",
              color: "#FA4F4F",
            }}
          >
            {errorMessage}
          </Text>
        )}
      </>
    </View>
  );
};
