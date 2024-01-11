import {
  View,
  ViewProps,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
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
  search?: boolean;
};

export default ({
  data,
  value,
  search,
  handleSelected,
  errorMessage,
  placeholder,
  hiddenValue,
  label,
  style,
  hasBottomMargin = true,
  inputStyle,
}: PropsType) => {
  const [selected, setSelected] = useState<{
    label: string;
    value: string;
    index?: number;
  }>({ label: "", value: "" });
  const [visible, setVisible] = useState(false);
  const ref = useRef<ScrollView>(null);
  const selectedIndex = useRef<number>();

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
    setVisible(false);
  };

  const scrollIntoView = () => {
    if (ref.current) {
      ref.current.scrollTo({
        x: 0,
        y: 30 + (selectedIndex.current || 0) * 39,
        animated: false,
      });
    }
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
        {visible && (
          <Modal transparent>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 25,
                flex: 1,
                height:
                  (Dimensions.get("window").height -
                    Constants.statusBarHeight) *
                  0.8,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  height: Dimensions.get("window").height,
                  width: Dimensions.get("window").width,
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
              <View
                style={{
                  backgroundColor: Colors.primary,
                  width: "100%",
                  borderWidth: 0,
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  borderRadius: 8,
                  flex: 1,
                  maxHeight:
                    (Dimensions.get("window").height -
                      Constants.statusBarHeight) *
                    0.9,
                }}
              >
                <ScrollView
                  ref={ref}
                  style={{
                    flex: 1,
                  }}
                >
                  {data.map(({ name, value }, count) => {
                    if (selected.value === value) {
                      selectedIndex.current = count;
                    }
                    return (
                      <View
                        style={{ backgroundColor: Colors.primary }}
                        key={value}
                        onLayout={scrollIntoView}
                      >
                        <TouchableWithoutFeedback
                          onPress={() => click({ label: name, value: value })}
                        >
                          <View
                            style={{
                              padding: 10,
                              borderRadius: 4,
                              overflow: "hidden",
                              borderColor:
                                selected.value === value
                                  ? Colors.tertiary
                                  : Colors.primary,
                              borderWidth: 1,
                              borderStyle: "solid",
                              backgroundColor:
                                selected.value === value
                                  ? Colors.tertiary
                                  : Colors.primary,
                            }}
                          >
                            <Text>
                              {name} {!hiddenValue && value ? `(${value})` : ""}
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
        <TouchableWithoutFeedback onPress={() => setVisible(true)}>
          <View
            style={[
              {
                height: 53,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
                borderRadius: 4,
                backgroundColor: Colors.primary,
                paddingVertical: 16,
                paddingHorizontal: 13,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: Colors.border,
              },
              inputStyle,
            ]}
          >
            <Text>{selected.label || "Choose a currency"}</Text>
            <ChevronRight />
          </View>
        </TouchableWithoutFeedback>
        {/* <Dropdown
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
            },
            inputStyle,
          ]}
          placeholderStyle={{ color: "white" }}
          containerStyle={{
            backgroundColor: Colors.primary,
            marginVertical: 15,
            height:
              Dimensions.get("window").height - Constants.statusBarHeight * 0.8,
            maxWidth: "90%",
            width: Dimensions.get("window").width,
            borderWidth: 0,
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderRadius: 8,
          }}
          selectedTextStyle={{ color: "white" }}
          inputSearchStyle={{
            backgroundColor: Colors.tertiary,
            width: "100%",
            margin: 0,
          }}
          itemTextStyle={{ color: "white" }}
          data={data.map((e) => ({
            label: e.name,
            value: e.value,
            key: e.name,
          }))}
          search={search}
          backgroundColor="rgba(0,0,0,0.8)"
          mode="modal"
          onChange={click}
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
                backgroundColor: Colors.secondary,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderWidth: 0,
                marginBottom: 10,
              }}
            />
          )}
          renderItem={({ value, label }, selected) => (
            <View style={{ backgroundColor: Colors.primary }}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 4,
                  overflow: "hidden",
                  borderColor: selected ? Colors.tertiary : Colors.primary,
                  borderWidth: 1,
                  borderStyle: "solid",
                  backgroundColor: selected ? Colors.tertiary : Colors.primary,
                }}
              >
                <Text>
                  {label} {!hiddenValue && value ? `(${value})` : ""}
                </Text>
              </View>
            </View>
          )}
        /> */}
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
