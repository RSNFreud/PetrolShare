import { View, ViewProps, Dimensions } from "react-native";
import { Text } from "./text";
import { useEffect, useRef, useState } from "react";
import Colors from "../constants/Colors";
import ChevronRight from "../assets/icons/chevronRight";
import { Dropdown } from "react-native-element-dropdown";
import Input from "./input";
import Constants from "expo-constants";

export type item = { name: string; value: string; symbol?: string };

type PropsType = {
  data: Array<item>;
  value?: string;
  handleSelected: (e: { label: string; value: string }) => void;
  errorMessage?: string;
  placeholder: string;
  inputStyle?: ViewProps["style"];
  style?: ViewProps["style"];
  hiddenValue?: boolean;
  hasBottomMargin?: boolean;
  label?: string;
};

export default ({
  data,
  value,
  handleSelected,
  errorMessage,
  placeholder,
  hiddenValue,
  label,
  style,
  hasBottomMargin = true,
  inputStyle,
}: PropsType) => {
  const [selected, setSelected] = useState({ label: "", value: "" });

  useEffect(() => {
    if (!data || !value) return;
    const current = data.filter(
      (e) => e.value.toString() === value || e.name.toString() === value
    )[0];
    if (!current) return;
    setSelected({ label: current?.name || "", value: current.value });
  }, [data, value]);

  const click = ({ label, value }: { label: string; value: string }) => {
    handleSelected({ label: label, value: value });
    setSelected({ label: label, value: value });
  };

  return (
    <>
      <View
        style={[
          {
            position: "relative",
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
        <Dropdown
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
          placeholderStyle={{ color: "white" }}
          containerStyle={{
            backgroundColor: Colors.background,
            marginVertical: 15,
            marginHorizontal: 15,
            minHeight:
              (Dimensions.get("window").height - Constants.statusBarHeight) *
              0.8,
            maxWidth: "90%",
            position: "absolute",
            top: Constants.statusBarHeight,
            borderWidth: 0,
            padding: 0,
            borderRadius: 8,
          }}
          minHeight={Dimensions.get("window").height}
          selectedTextStyle={{ color: "white" }}
          inputSearchStyle={{
            backgroundColor: Colors.tertiary,
            width: "100%",
            margin: 0,
          }}
          itemTextStyle={{ color: "white" }}
          data={data.map((e) => ({ label: e.name, value: e.value }))}
          search
          backgroundColor="rgba(0,0,0,0.8)"
          mode="modal"
          onChange={click}
          flatListProps={{
            style: {
              maxHeight:
                (Dimensions.get("window").height - Constants.statusBarHeight) *
                0.8,
            },
          }}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          searchPlaceholder="Search..."
          value={selected}
          renderRightIcon={() => <ChevronRight />}
          renderInputSearch={(onSearch) => (
            <Input
              handleInput={onSearch}
              placeholder="Search..."
              inputStyle={{
                backgroundColor: Colors.tertiary,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderWidth: 0,
              }}
            />
          )}
          renderItem={({ value, label }, selected) => (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 13,
                backgroundColor: selected
                  ? Colors.secondary
                  : Colors.background,
              }}
            >
              <Text>
                {label} {!hiddenValue && value ? `(${value})` : ""}
              </Text>
            </View>
          )}
        />
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
