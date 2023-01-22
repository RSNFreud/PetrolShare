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
      marginBottom: 20,
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
          backgroundColor: "#0B404A",
          borderStyle: "solid",
          borderWidth: 1,
          height: 51,
          overflow: 'hidden',
          borderColor: "#1196B0",
          paddingLeft: 10,
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center'
        }}
      >
        <Picker
          ref={dropdownRef}
          selectedValue={selected}
          onValueChange={(itemValue) => selectOption(itemValue)}
          dropdownIconColor="white"
          mode="dialog"
          style={{
            width: "100%",
            backgroundColor: 'transparent',
            fontSize: 16,
            marginRight: 10,
            borderColor: 'transparent',
            fontWeight: "400",
            color: "#fff",
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
    </View>
  </TouchableWithoutFeedback>
  );
};
