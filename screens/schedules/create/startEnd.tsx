import React from "react";
import { Platform, View, ViewProps } from "react-native";
import SplitRow from "@components/splitRow";
import Colors from "../../../constants/Colors";
import { DataType } from ".";
import DatePicker from "@components/dateTimePicker";

type PropsType = {
  data: DataType;
  checkForInvalidDate: boolean;
  updateData: (
    e: Date,
    value: string,
    position?: "custom" | "customDays"
  ) => void;
};

export const StartEnd = ({
  data,
  checkForInvalidDate,
  updateData,
}: PropsType) => {
  return (
    <View
      style={{
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 4,
        backgroundColor: Colors.primary,
      }}
    >
      {["startDate", "endDate"].map((dateType) => {
        const isStart = dateType === "startDate";

        const dateProps = {
          style: {
            paddingVertical: 13,
            paddingHorizontal: Platform.OS === "ios" ? 0 : 16,
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
            alignItems: "flex-start",
          },
          textStyle: {
            color: checkForInvalidDate && isStart ? "#FA4F4F" : "#fff",
          },
          format: {
            day: "2-digit",
            month: "short",
            year: "numeric",
            weekday: "short",
          },
          value: isStart ? data.startDate.getTime() : data.endDate.getTime(),
        } as {
          style: ViewProps["style"];
          value: number;
        };

        const onUpdate = (e: number) => updateData(new Date(e), dateType);

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
            gap={0}
            elements={[
              <DatePicker {...dateProps} mode="date" setValue={onUpdate} />,
              !data.allDay && (
                <DatePicker
                  {...dateProps}
                  mode="time"
                  format={{
                    minute: "2-digit",
                    hour: "2-digit",
                    hourCycle: "h12",
                  }}
                  style={[
                    dateProps.style,
                    {
                      alignItems: "flex-end",
                      paddingHorizontal: Platform.OS === "ios" ? 8 : 16,
                    },
                  ]}
                  setValue={onUpdate}
                />
              ),
            ]}
          />
        );
      })}
    </View>
  );
};
