import { Text } from "@components/text";
import { TouchableWithoutFeedback, View } from "react-native";

import Colors from "../../../constants/Colors";

type DayProps = {
  label: string;
  value: string;
  handleClick: (value: string) => void;
  active: boolean;
};

export const Day = ({ label, value, active, handleClick }: DayProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(value)}>
      <View
        style={{
          borderRadius: 100,
          width: 40,
          height: 40,
          backgroundColor: active ? Colors.tertiary : Colors.primary,
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        <Text style={{ textAlign: "center" }}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
