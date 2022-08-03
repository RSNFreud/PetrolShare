import { Text, View, TextInput } from "react-native";
import React from "react";

type PropsType = {
  label: string;
  password?: boolean;
  value?: string;
  placeholder: string;
  style?: any;
  handleInput?: (e: string) => void;
  errorMessage?: string;
};

export default ({
  label,
  password,
  value,
  placeholder,
  style,
  handleInput,
  errorMessage,
}: PropsType) => {
  return (
    <View style={{ ...style }}>
      <>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 14,
            lineHeight: 16,
            marginBottom: 6,
            color: "white",
          }}
        >
          {label}
        </Text>
        <TextInput
          onChangeText={handleInput}
          placeholder={placeholder}
          secureTextEntry={password}
          placeholderTextColor="rgba(255,255,255,0.8)"
          style={{
            borderColor: "#137B91",
            borderWidth: 1,
            borderStyle: "solid",
            backgroundColor: "#0B404A",
            borderRadius: 4,
            color: "white",
            fontWeight: "400",
            height: 48,
            fontSize: 14,
            paddingHorizontal: 16,
            paddingVertical: 13,
          }}
          value={value}
        />
        {errorMessage && (
          <Text
            style={{
              marginTop: 3,
              fontSize: 12,
              minHeight: 12,
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
