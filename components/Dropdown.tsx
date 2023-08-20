import {
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Pressable,
  ViewProps,
} from "react-native";
import { Text } from "./Themed";
import Svg, { Path } from "react-native-svg";
import { useEffect, useRef, useState } from "react";
import { Picker } from '@react-native-picker/picker';
import Colors from "../constants/Colors";

export type item = { name: string; value: string; symbol?: string };

type PropsType = {
  data: Array<item>;
  value?: string;
  handleSelected: (e: string) => void;
  errorMessage?: string;
  placeholder: string
  inputStyle?: ViewProps["style"]
  style?: ViewProps["style"]
  height?: number
  hiddenValue?: boolean
  hasBottomMargin?: boolean
  label?: string
  sort?: boolean
};

export default ({ data, value, handleSelected, errorMessage, placeholder, hiddenValue, label, sort = true, style, hasBottomMargin = true, inputStyle }: PropsType) => {
  const [selected, setSelected] = useState("");
  const [displayText, setDisplayText] = useState(selected)
  const dropdownRef = useRef<any>("")

  const selectOption = (e: string) => {
    setSelected(e);
    handleSelected(e);
    setDisplayText(data.filter((q) => q.value.toString() === e?.toString() || q.name.toString() === e?.toString())[0]?.name);
  };

  useEffect(() => {
    setDisplayText(data.filter((q) => q.value.toString() === value?.toString() || q.name.toString() === value?.toString())[0]?.name);
  }, [selected])

  useEffect(() => {
    if (!data || selected) return;
    setSelected(data.filter((e) => e.value.toString() === value || e.name.toString() === value)[0]?.name);
  }, [data, value, selected]);

  return (<TouchableWithoutFeedback onPress={() => dropdownRef.current.focus()} >
    <View style={[{
      marginBottom: hasBottomMargin ? 25 : 0
    }, style]}>
      {!!label &&
        <Text
          style={{
            fontWeight: '700',
            fontSize: 16,
            lineHeight: 16,
            marginBottom: 10,
            color: 'white',
          }}
        >
          {label}
        </Text>}
      <View
        style={[{
          position: "relative",
          zIndex: 1,
          borderRadius: 4,
          width: "100%",
          backgroundColor: Colors.primary,
          borderStyle: "solid",
          borderWidth: 1,
          height: 51,
          overflow: 'hidden',
          borderColor: Colors.border,
          paddingHorizontal: 15,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center'
        }, inputStyle]}
      >
        <Picker
          ref={dropdownRef}
          selectedValue={selected}
          onValueChange={(itemValue) => selectOption(itemValue)}
          mode="dialog"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            height: '100%',
            width: "100%",
          }}
          itemStyle={{
            color: 'black'
          }}
        >
          {value !== undefined && !Boolean(selected) &&
            <Picker.Item
              color="black" key={"blank"}
              value={""}
              label={placeholder}
            />}
          {sort ? data
            .sort((a, b) => a["name"].localeCompare(b["name"]))
            .map((e, c) => {
              return (
                <Picker.Item
                  color="black" key={`sorted${c}`}
                  value={e.value}
                  label={`${e.name} ${!hiddenValue && e.value ? `(${e.value})` : ''}`}
                />
              );
            }) : data
              .map((e, c) => {
                return (
                  <Picker.Item
                    color="black" key={`unsorted${c}`}
                    value={e.value}
                    label={`${e.name} ${!hiddenValue && e.value ? `(${e.value})` : ''}`}
                  />
                );
              })}
        </Picker>
        <Text style={{ zIndex: 3, fontSize: 16 }}>{displayText || placeholder}</Text>
        <Svg
          width="8"
          height="14"
          fill="none"
          viewBox="0 0 8 14"
        >
          <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1l6 6-6 6"
          ></Path>
        </Svg>
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
    </View>
  </TouchableWithoutFeedback >
  );
};
