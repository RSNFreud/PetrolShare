import React, { useContext, useEffect, useState } from "react";
import {
  Switch,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import DatePicker from "@components/dateTimePicker";
import { Seperator, ViewProps } from "@components/Themed";
import { Text } from "@components/text";
import Colors from "../../../constants/Colors";
import Input from "@components/input";
import Dropdown from "@components/Dropdown";
import AnimateHeight from "@components/animateHeight";
import Button from "@components/button";
import axios from "axios";
import config from "../../../config";
import { AuthContext } from "../../../hooks/context";
import { Alert, convertHexToRGBA, sendCustomEvent } from "../../../hooks";

import { StartEnd } from "./startEnd";
import { Custom } from "./custom";
import { EndRepeating } from "./endRepeating";

export type DataType = {
  allDay: boolean;
  startDate: Date;
  endDate: Date;
  summary?: string;
  repeating?: string;
  repeatingEndDate?: number;
  custom?: {
    number?: string;
    repeatingFormat?: string;
    repeatingDays?: string[];
  };
};

export default ({
  onClose,
  currentDate,
  previousData,
}: {
  onClose: () => void;
  currentDate: number;
  previousData?: DataType;
}) => {
  const [data, setData] = useState<DataType>({
    allDay: false,
    startDate: new Date(),
    endDate: new Date(),
    summary: "",
    repeating: "notRepeating",
    repeatingEndDate: 0,
    custom: {
      number: "1",
      repeatingFormat: "daily",
      repeatingDays: [] as string[],
    },
  });
  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const [errors, setErrors] = useState("");
  const [hasError, setHasError] = useState(false);
  const [maxRepeatingDate, setMaxRepeatingDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  );

  useEffect(() => {
    // if (data.startDate && data.endDate) return;
    let time = new Date(currentDate);
    time = new Date(
      `${time.getFullYear()}-${
        time.getMonth() + 1
      }-${time.getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:00`
    );

    setData({
      ...data,
      startDate: new Date(time.setMinutes(time.getMinutes() + 15)),
      endDate: new Date(time.setHours(time.getHours() + 1)),
      repeatingEndDate: maxRepeatingDate.getTime(),
    });
  }, [currentDate]);

  useEffect(() => {
    if (previousData) setData({ ...previousData });
  }, [previousData]);

  const dismissError = () => {
    setHasError(false);
    setTimeout(() => {
      setErrors("");
    }, 500);
  };

  const updateDate = (e: Date, value: string) => {
    updateData(e, value);
  };

  const updateData = (
    e: boolean | string | number | Date,
    value: string | number | boolean,
    position?: "custom" | "customDays"
  ) => {
    dismissError();
    let newData = data;

    if (!position && typeof value === "string")
      newData = { ...data, [value]: e };
    else if (position === "custom" && typeof value === "string")
      newData = { ...data, custom: { ...data.custom, [value]: e } };
    else if (position === "customDays" && typeof value === "string") {
      let repeatingDays = data.custom?.repeatingDays;
      if (data.custom?.repeatingDays?.includes(value))
        repeatingDays = repeatingDays?.filter((e) => e !== value);
      else repeatingDays?.push(value);
      newData = {
        ...data,
        custom: { ...data.custom, repeatingDays: repeatingDays || [] },
      };
    }
    setData(newData);
  };

  useEffect(() => {
    if (data.allDay && data.startDate?.getTime() > data.endDate?.getTime()) {
      setData((data) => ({ ...data, endDate: data.startDate }));
    }
  }, [data]);

  useEffect(() => {
    let maxDate = maxRepeatingDate;
    if (!data.startDate) return;
    let tempDate = new Date(data.startDate);
    if (data.repeating === "custom")
      switch (data.custom?.repeatingFormat) {
        case "weekly":
          maxDate = new Date(tempDate.setDate(tempDate.getDate() + 52 * 2 * 7));
          setMaxRepeatingDate(maxDate);
          setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
          break;
        case "daily":
          maxDate = new Date(tempDate.setDate(tempDate.getDate() + 365));
          setMaxRepeatingDate(maxDate);
          setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
          break;

        case "monthly":
          maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 24));
          setMaxRepeatingDate(maxDate);
          setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
          break;

        default:
          break;
      }
    switch (data.repeating) {
      case "weekly":
        maxDate = new Date(tempDate.setDate(tempDate.getDate() + 52 * 2 * 7));
        setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
        break;
      case "daily":
        maxDate = new Date(tempDate.setDate(tempDate.getDate() + 365));
        setMaxRepeatingDate(maxDate);
        setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
        break;

      case "monthly":
        maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 24));
        setMaxRepeatingDate(maxDate);
        setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
        break;

      default:
        break;
    }
  }, [data.custom?.repeatingFormat, data.repeating, data.startDate]);

  const handleSubmit = () => {
    setHasError(false);
    if (loading) return;
    let newData = data;
    if (data.allDay && data.endDate < data.startDate) {
      setHasError(true);
      return setErrors("Please choose a valid date time combination!");
    }
    if (
      data.custom?.repeatingFormat === "weekly" &&
      !data.custom?.repeatingDays?.length
    ) {
      setHasError(true);
      return setErrors(
        "Please select the days for which to repeat the schedule!"
      );
    }

    if (data.repeating === "custom" && !data.custom?.number) {
      setHasError(true);
      return setErrors("Please select how often the schedule repeats!");
    }
    if (data.allDay) {
      const start = new Date(data.startDate);
      start.setHours(0, 1, 0, 0);
      const end = new Date(data.endDate);
      end.setHours(23, 59, 0, 0);
      setData((data) => ({
        ...data,
        startDate: start,
        endDate: end,
      }));
      newData = { ...data, startDate: start, endDate: end };
    }
    setLoading(true);
    console.log("====================================");
    console.log(newData);
    console.log("====================================");
    return;
    axios
      .post(config.REACT_APP_API_ADDRESS + "/schedules/add", {
        authenticationKey: retrieveData?.authenticationKey,
        ...newData,
      })
      .then(() => {
        setErrors("");
        onClose();
        sendCustomEvent("sendAlert", "Added new schedule successfully!");
        setLoading(false);
      })
      .catch(({ response }) => {
        setLoading(false);
        setHasError(true);
        if (typeof response?.data === "string") setErrors(response?.data);
        else {
          onClose();
          setTimeout(() => {
            Alert(
              "Schedule",
              `The following dates are not available and have been skipped being added:\n\n${response?.data
                .map((date: string) => new Date(date).toLocaleDateString())
                .join("\n")}`
            );
          }, 500);
        }
      });
  };

  const checkForInvalidDate =
    (data?.startDate?.getTime() >= data?.endDate?.getTime() ||
      (!previousData && data.startDate.getTime() < new Date().getTime())) &&
    !data.allDay;
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
          width: "100%",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>All day?</Text>
        <Switch
          trackColor={{
            false: convertHexToRGBA("#fff", 0.6),
            true: convertHexToRGBA("#fff", 0.6),
          }}
          value={data.allDay}
          thumbColor={data.allDay ? Colors.tertiary : "white"}
          onChange={(e) => updateData(e.nativeEvent.value, "allDay")}
          ios_backgroundColor={Colors.primary}
        />
      </View>
      <StartEnd
        data={data}
        checkForInvalidDate={checkForInvalidDate}
        updateData={updateDate}
      />
      <AnimateHeight open={!errors && checkForInvalidDate}>
        <View
          style={{
            marginTop: 15,
            backgroundColor: "#EECFCF",
            borderRadius: 4,
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text style={{ color: "#7B1D1D", fontSize: 16, fontWeight: "400" }}>
            Please enter a start date/time combination before the end date/time
            and after the current selected date!
          </Text>
        </View>
      </AnimateHeight>
      <Input
        placeholder="Enter a summary"
        label="Summary (Optional)"
        value={data.summary || ""}
        handleInput={(e) => updateData(e, "summary")}
        style={{ marginTop: 25 }}
      ></Input>
      <Seperator style={{ marginVertical: 25 }} />
      <Dropdown
        sort={false}
        hiddenValue
        value={data.repeating}
        data={[
          { name: "Does not repeat", value: "notRepeating" },
          { name: "Every day", value: "daily" },
          { name: "Every week", value: "weekly" },
          { name: "Every month", value: "monthly" },
          { name: "Custom...", value: "custom" },
        ]}
        placeholder="Does not repeat"
        label="Repeating?"
        handleSelected={(e) => updateData(e, "repeating")}
        hasBottomMargin={false}
      />
      <AnimateHeight open={data.repeating === "custom"}>
        <Custom data={data} updateData={updateData} />
      </AnimateHeight>
      <AnimateHeight
        open={Boolean(data.repeating && data.repeating !== "notRepeating")}
      >
        <EndRepeating
          data={data}
          updateData={updateData}
          maxRepeatingDate={maxRepeatingDate}
        />
      </AnimateHeight>
      <View style={{ marginTop: 25 }}>
        <AnimateHeight open={hasError}>
          <View
            style={{
              marginBottom: 15,
              backgroundColor: "#EECFCF",
              borderRadius: 4,
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}
          >
            <Text style={{ color: "#7B1D1D", fontSize: 16, fontWeight: "400" }}>
              {errors}
            </Text>
          </View>
        </AnimateHeight>
        <Button
          loading={loading}
          handleClick={handleSubmit}
          text={previousData ? "Update Schedule" : "Create Schedule"}
        />
      </View>
    </>
  );
};
