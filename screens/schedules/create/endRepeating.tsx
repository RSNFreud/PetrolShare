import DatePicker from "@components/dateTimePicker";
import SplitRow from "@components/splitRow";
import { Text } from "@components/text";
import React from "react";
import { View, ViewProps } from "react-native";

import { DataType } from ".";
import Colors from "../../../constants/Colors";

type PropsType = {
  data: DataType;
  updateData: (
    e: boolean | string | number,
    value: string | number | boolean,
    position?: "custom" | "customDays",
  ) => void;
  maxRepeatingDate: Date;
};

export const EndRepeating = ({
  data,
  updateData,
  maxRepeatingDate,
}: PropsType) => (
  <>
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        width: "100%",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>Repeat until:</Text>
    </View>
    <View
      style={{
        marginTop: 10,
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 4,
        backgroundColor: Colors.primary,
      }}
    >
      {[""].map(() => {
        const dateProps = {
          style: {
            paddingVertical: 13,
            paddingHorizontal: 16,
            width: "100%",
            alignItems: "flex-start",
          },
          format: {
            day: "2-digit",
            month: "short",
            year: "numeric",
            weekday: "short",
          },
          value: data.repeatingEndDate,
        } as {
          style: ViewProps["style"];
          value: number;
        };

        const onUpdate = (e: number) => updateData(e, "repeatingEndDate");

        return (
          <SplitRow
            withoutFade
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              height: 53,
            }}
            key="date"
            gap={0}
            elements={[
              <DatePicker
                {...dateProps}
                maxDate={maxRepeatingDate}
                mode="date"
                setValue={onUpdate}
              />,
            ]}
          />
        );
      })}
    </View>
  </>
);
