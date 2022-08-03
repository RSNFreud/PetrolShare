import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { HTMLInputTypeAttribute } from "react";

type PropsType = {
  label: string;
  password?: boolean;
  value?: string;
  placeholder: string;
  style?: any;
};

export default ({ label, password, value, placeholder, style }: PropsType) => {
  return (
    <View>
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
          ...style,
        }}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    color: "white",
  },
});
