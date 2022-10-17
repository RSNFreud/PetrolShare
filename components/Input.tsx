import { View, TextInput, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { Text } from "./Themed";
import Svg, { Path } from "react-native-svg";

type PropsType = {
  label: string;
  password?: boolean;
  value?: string;
  placeholder: string;
  style?: any;
  handleInput?: (e: string) => void;
  handleBlur?: (e: any) => void;
  errorMessage?: string;
  keyboardType?: TextInput["props"]["keyboardType"];
};

export default ({
  label,
  password,
  value,
  placeholder,
  style,
  keyboardType,
  handleInput,
  handleBlur,
  errorMessage,
}: PropsType) => {
  const [passwordShown, setPasswordShown] = useState(password);

  const handlePassword = () => {
    setPasswordShown((showPassword) => !showPassword);
  };

  return (
    <View style={{ ...style }}>
      <>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 16,
            lineHeight: 16,
            marginBottom: 6,
            color: "white",
          }}
        >
          {label}
        </Text>
        <View style={{ position: "relative" }}>
          <TextInput
            onChangeText={handleInput}
            onEndEditing={(e) => handleBlur && handleBlur(e)}
            placeholder={placeholder}
            secureTextEntry={password ? passwordShown : false}
            keyboardType={keyboardType}
            placeholderTextColor="rgba(255,255,255,0.8)"
            style={{
              borderColor: "#137B91",
              borderWidth: 1,
              borderStyle: "solid",
              backgroundColor: "#0B404A",
              borderRadius: 4,
              color: "white",
              fontWeight: "400",
              height: 53,
              fontSize: 18,
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
            value={value}
          />
          {password && (
            <TouchableWithoutFeedback onPress={() => handlePassword()}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  paddingHorizontal: 10,
                  display: "flex",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {passwordShown ? (
                  <Svg width="25" height="25" fill="none" viewBox="0 0 36 36">
                    <Path
                      fill="#fff"
                      d="M25.19 20.4c.287-.767.433-1.58.43-2.4a6.86 6.86 0 00-6.86-6.86 6.79 6.79 0 00-2.37.43L18 13.23A4.87 4.87 0 0123.62 18c0 .248-.02.495-.06.74l1.63 1.66z"
                    ></Path>
                    <Path
                      fill="#fff"
                      d="M34.29 17.53c-3.37-6.23-9.28-10-15.82-10a16.82 16.82 0 00-5.24.85L14.84 10a14.78 14.78 0 013.63-.47c5.63 0 10.75 3.14 13.8 8.43a17.751 17.751 0 01-4.37 5.1l1.42 1.42a19.931 19.931 0 005-6l.26-.48-.29-.47zM4.87 5.78l4.46 4.46a19.52 19.52 0 00-6.69 7.29l-.26.47.26.48c3.37 6.23 9.28 10 15.82 10a16.93 16.93 0 007.37-1.69l5 5 1.75-1.5-26-26-1.71 1.49zm9.75 9.75l6.65 6.65a4.81 4.81 0 01-2.5.72A4.868 4.868 0 0113.9 18a4.81 4.81 0 01.72-2.47zm-1.45-1.45a6.85 6.85 0 009.55 9.55l1.6 1.6a14.912 14.912 0 01-5.86 1.2c-5.63 0-10.75-3.14-13.8-8.43a17.29 17.29 0 016.12-6.3l2.39 2.38z"
                    ></Path>
                  </Svg>
                ) : (
                  <Svg width="25" height="25" fill="none" viewBox="0 0 36 36">
                    <Path
                      fill="#fff"
                      d="M33.62 17.53c-3.37-6.23-9.28-10-15.82-10-6.54 0-12.46 3.77-15.8 10l-.28.47.26.48c3.37 6.23 9.28 10 15.82 10 6.54 0 12.46-3.72 15.82-10l.26-.48-.26-.47zm-15.82 8.9C12.17 26.43 7 23.29 4 18c3-5.29 8.17-8.43 13.8-8.43 5.63 0 10.74 3.15 13.79 8.43-3.05 5.29-8.17 8.43-13.79 8.43z"
                    ></Path>
                    <Path
                      fill="#fff"
                      d="M18.09 11.17a6.86 6.86 0 10.1 13.72 6.86 6.86 0 00-.1-13.72zm0 11.72A4.86 4.86 0 1123 18a4.869 4.869 0 01-4.91 4.89z"
                    ></Path>
                  </Svg>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        {!!errorMessage && (
          <Text
            style={{
              marginTop: 6,
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
