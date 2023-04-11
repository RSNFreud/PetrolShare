import {
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Pressable,
} from "react-native";
import { Text } from "./Themed";
import Svg, { Path } from "react-native-svg";
import { useEffect, useRef, useState } from "react";
import { Picker } from '@react-native-picker/picker';
import Colors from "../constants/Colors";

type item = { name: string; value: string; symbol?: string };

type PropsType = {
  data: Array<item>;
  value?: string;
  handleSelected: (e: string) => void;
  errorMessage?: string;
  placeholder: string
  height?: number
  hiddenValue?: boolean
  label?: string
};

export default ({ data, value, handleSelected, errorMessage, placeholder, hiddenValue, label }: PropsType) => {
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<any>("")

  const selectOption = (e: string) => {
    setSelected(e);
    handleSelected(e);
  };

  useEffect(() => {
    if (!data || selected) return;
    setSelected(data.filter((e) => e.value === value || e.name === value)[0]?.value);
  }, [data, value, selected]);

  return (<TouchableWithoutFeedback onPress={() => dropdownRef.current.focus()} >
    <View style={{
      marginBottom: 25,
    }}>
      {!!label &&
        <Text
          style={{
            fontWeight: '700',
            fontSize: 16,
            lineHeight: 16,
            marginBottom: 6,
            color: 'white',
          }}
        >
          {label}
        </Text>}
      <View
        style={{
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
        }}
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
          {data
            .sort((a, b) => a["name"].localeCompare(b["name"]))
            .map((e) => {
              return (
                <Picker.Item
                  color="black" key={e.name}
                  value={e.value}
                  label={`${e.name} ${!hiddenValue && e.value ? `(${e.value})` : ''}`}
                />
              );
            })}
        </Picker>
        <Text style={{ zIndex: 3 }}>{selected || "Choose a currency"}</Text>
        <Svg
          width="11"
          height="13"
          fill="none"
          viewBox="0 0 11 13"
        >
          <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.333 11.833V1.167m-4.666 6l4.666 4.666L10 7.166"
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
