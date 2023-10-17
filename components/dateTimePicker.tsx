import { TextProps, ViewProps } from "./Themed";
import { Text } from "./text";
import { TouchableWithoutFeedback, View } from "react-native";
import { useState } from "react";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
type PropsType = {
  label?: string;
  style?: ViewProps["style"];
  value?: Date | number;
  mode: "date" | "time";
  setValue: (e: number) => void;
  disabled?: boolean;
  format?: Intl.DateTimeFormatOptions;
  textStyle?: TextProps["style"];
  maxDate?: Date;
};

export default ({
  label,
  style,
  value = new Date(),
  setValue,
  mode,
  disabled,
  format,
  textStyle,
  maxDate,
}: PropsType) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dateValue = typeof value === "number" ? new Date(value) : value;

  const handleChange = (e: DateTimePickerEvent) => {
    setModalOpen(false);
    if (e.nativeEvent.timestamp) setValue(e.nativeEvent.timestamp);
  };

  return (
    <View>
      {!!label && (
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
      )}
      <TouchableWithoutFeedback
        onPress={() => (disabled ? null : setModalOpen(true))}
      >
        <View style={[{ display: "flex", alignItems: "center" }, style]}>
          <Text
            style={[
              {
                fontWeight: "400",
                fontSize: 16,
              },
              textStyle,
            ]}
          >
            {mode === "date"
              ? dateValue.toLocaleDateString("en-gb", format)
              : dateValue.toLocaleTimeString(
                  undefined,
                  format || {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {modalOpen && (
        <RNDateTimePicker
          mode={mode}
          value={dateValue}
          minimumDate={new Date()}
          onChange={handleChange}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
};
