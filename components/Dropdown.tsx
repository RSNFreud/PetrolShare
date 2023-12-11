import {
  TouchableWithoutFeedback,
  View,
  ViewProps,
  StyleSheet,
} from "react-native";
import { Text } from "./text";
import { useEffect, useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Colors from "../constants/Colors";
import ChevronRight from "../assets/icons/chevronRight";
import { Dropdown } from "react-native-element-dropdown";

export type item = { name: string; value: string; symbol?: string };

type PropsType = {
  data: Array<item>;
  value?: string;
  handleSelected: (e: string) => void;
  errorMessage?: string;
  placeholder: string;
  inputStyle?: ViewProps["style"];
  style?: ViewProps["style"];
  height?: number;
  hiddenValue?: boolean;
  hasBottomMargin?: boolean;
  label?: string;
  sort?: boolean;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    // padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    // paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default ({
  data,
  value,
  handleSelected,
  errorMessage,
  placeholder,
  hiddenValue,
  label,
  sort = true,
  style,
  hasBottomMargin = true,
  inputStyle,
}: PropsType) => {
  const [selected, setSelected] = useState("");
  const [displayText, setDisplayText] = useState(selected);
  const dropdownRef = useRef<any>("");

  const selectOption = (e: string) => {
    setSelected(e);
    handleSelected(e);
    setDisplayText(
      data.filter(
        (q) =>
          q.value.toString() === e?.toString() ||
          q.name.toString() === e?.toString()
      )[0]?.name
    );
  };

  // useEffect(() => {
  //   setDisplayText(
  //     data.filter(
  //       (q) =>
  //         q.value.toString() === value?.toString() ||
  //         q.name.toString() === value?.toString()
  //     )[0]?.name
  //   );
  // }, [selected]);

  // useEffect(() => {
  //   if (!data || selected) return;
  //   setSelected(
  //     data.filter(
  //       (e) => e.value.toString() === value || e.name.toString() === value
  //     )[0]?.name
  //   );
  // }, [data, value, selected]);

  const click = ({ label, value }: { label: string; value: string }) => {
    console.log(label, value);
    setSelected({ label: label, value: value });
  };

  if (!data.length) return;
  return (
    <>
      <View
        style={[
          {
            marginBottom: hasBottomMargin ? 25 : 0,
          },
          style,
        ]}
      >
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
        {/* <View>
          <Dropdown
            data={data.map((e) => ({ label: e.name, value: e.value }))}
            style={[
              {
                position: "relative",
                zIndex: 1,
                borderRadius: 4,
                width: "100%",
                backgroundColor: Colors.primary,
                borderStyle: "solid",
                borderWidth: 1,
                height: 51,
                overflow: "hidden",
                borderColor: Colors.border,
                paddingHorizontal: 15,
                // display: "flex",
                // justifyContent: "space-between",
                // flexDirection: "row",
                // alignContent: "center",
                // alignItems: "center",
              },
              inputStyle,
            ]}
            placeholder="Test..."
            maxHeight={150}
            minHeight={150}
            containerStyle={{
              backgroundColor: Colors.secondary,
              maxHeight: 150,
            }}
            itemTextStyle={{ color: "white" }}
            selectedTextStyle={{ color: "white" }}
            mode="modal"
            value={selected}
            labelField={"label"}
            valueField="value"
            onChange={click}
          />
        </View> */}

        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          containerStyle={{ padding: 0, margin: 0, flex: 1 }}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data.map((e) => ({ label: e.name, value: e.value }))}
          search
          backgroundColor="red"
          mode="modal"
          onChange={click}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Select Item"}
          searchPlaceholder="Search..."
          value={selected}
        />
        <View
          style={[
            {
              position: "relative",
              zIndex: 1,
              borderRadius: 4,
              width: "100%",
              backgroundColor: Colors.primary,
              borderStyle: "solid",
              borderWidth: 1,
              height: 51,
              overflow: "hidden",
              borderColor: Colors.border,
              paddingHorizontal: 15,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            },
            inputStyle,
          ]}
        >
          <Text style={{ zIndex: 3, fontSize: 16 }}>
            {displayText || placeholder}
          </Text>
          <ChevronRight />
        </View>
        {/* <Picker
            ref={dropdownRef}
            selectedValue={selected}
            onValueChange={(itemValue) => selectOption(itemValue)}
            mode="dialog"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
              height: "100%",
              width: "100%",
            }}
            itemStyle={{
              color: "black",
            }}
          >
            {value !== undefined && !Boolean(selected) && (
              <Picker.Item
                color="black"
                key={"blank"}
                value={""}
                label={placeholder}
              />
            )}
            {sort
              ? data
                  .sort((a, b) => a["name"].localeCompare(b["name"]))
                  .map((e, c) => {
                    return (
                      <Picker.Item
                        color="black"
                        key={`sorted${c}`}
                        value={e.value}
                        label={`${e.name} ${
                          !hiddenValue && e.value ? `(${e.value})` : ""
                        }`}
                      />
                    );
                  })
              : data.map((e, c) => {
                  return (
                    <Picker.Item
                      color="black"
                      key={`unsorted${c}`}
                      value={e.value}
                      label={`${e.name} ${
                        !hiddenValue && e.value ? `(${e.value})` : ""
                      }`}
                    />
                  );
                })}
          </Picker> */}

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
    </>
  );
};
