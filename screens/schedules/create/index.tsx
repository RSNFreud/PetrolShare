import React, { useContext, useEffect, useState } from "react";
import {

    Switch,
    TouchableWithoutFeedback,
    View,
    ScrollView,
} from "react-native";
import DatePicker from "../../../components/dateTimePicker";
import { Seperator, Text, ViewProps } from "../../../components/Themed";
import Colors from "../../../constants/Colors";
import Input from "../../../components/Input";
import Dropdown from "../../../components/Dropdown";
import AnimateHeight from "../../../components/animateHeight";
import Button from "../../../components/button";
import axios from "axios";
import config from "../../../config";
import { AuthContext } from "../../../hooks/context";
import { Alert, convertHexToRGBA, sendCustomEvent } from "../../../hooks";
import SplitRow from "../../../components/splitRow";
import { Day } from "./day";
import { StartEnd } from "./startEnd";
import { Custom } from "./custom";
import { EndRepeating } from "./endRepeating";

export type DataType = {
    allDay: boolean;
    startDate: number;
    endDate: number;
    summary: string;
    repeating: string;
    repeatingEndDate: number;
    custom: {
        number: string;
        repeatingFormat: string;
        repeatingDays: string[];
    };
}

export default ({
    onClose,
    currentDate,
}: {
    onClose: () => void;
    currentDate: number;
}) => {
    const [data, setData] = useState({
        allDay: false,
        startDate: 0,
        endDate: 0,
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
    const [maxRepeatingDate, setMaxRepeatingDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))

    useEffect(() => {
        if (data.startDate !== 0 && data.endDate !== 0) return
        let time = new Date(currentDate);
        time = new Date(
            `${time.getFullYear()}-${time.getMonth() + 1
            }-${time.getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:00`
        );

        setData({
            ...data,
            startDate: time.setMinutes(time.getMinutes() + 15),
            endDate: time.setHours(time.getHours() + 1),
            repeatingEndDate: maxRepeatingDate.getTime(),
        });
    }, [currentDate]);

    const dismissError = () => {
        setHasError(false);
        setTimeout(() => {
            setErrors("");
        }, 500);
    };

    const updateData = (e: boolean | string | number, value: string | number | boolean, position?: 'custom' | 'customDays') => {
        dismissError();
        let newData = data

        if (!position && typeof value === 'string') newData = { ...data, [value]: e }
        else if (position === 'custom' && typeof value === 'string') newData = { ...data, custom: { ...data.custom, [value]: e } }
        else if (position === 'customDays' && typeof value === 'string') {
            let repeatingDays = data.custom.repeatingDays;
            if (data.custom.repeatingDays.includes(value))
                repeatingDays = repeatingDays.filter((e) => e !== value);
            else repeatingDays.push(value);
            newData = { ...data, custom: { ...data.custom, repeatingDays: repeatingDays } }
        }
        setData(newData);
    };

    useEffect(() => {
        if (data.allDay && data.startDate > data.endDate) {
            setData((data) => ({ ...data, endDate: data.startDate }));
        }
    }, [data]);

    useEffect(() => {
        let maxDate = maxRepeatingDate
        let tempDate = new Date(data.startDate)
        if (data.repeating === "custom")
            switch (data.custom.repeatingFormat) {
                case 'weekly':
                    maxDate = new Date(tempDate.setDate(tempDate.getDate() + ((52 * 2) * 7)))
                    setMaxRepeatingDate(maxDate)
                    setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
                    break;
                case 'daily':
                    maxDate = new Date(tempDate.setDate(tempDate.getDate() + 365))
                    setMaxRepeatingDate(maxDate)
                    setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
                    break;

                case 'monthly':
                    maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 24))
                    setMaxRepeatingDate(maxDate)
                    setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
                    break;

                default:
                    break;
            }
        switch (data.repeating) {
            case 'weekly':
                maxDate = new Date(tempDate.setDate(tempDate.getDate() + ((52 * 2) * 7)))
                setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
                break;
            case 'daily':
                maxDate = new Date(tempDate.setDate(tempDate.getDate() + 365))
                setMaxRepeatingDate(maxDate)
                setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
                break;

            case 'monthly':
                maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 24))
                setMaxRepeatingDate(maxDate)
                setData((data) => ({ ...data, repeatingEndDate: maxDate.getTime() }));
                break;

            default:
                break;
        }
    }, [data.custom.repeatingFormat, data.repeating, data.startDate]);


    const handleSubmit = () => {
        setHasError(false);
        if (loading) return
        let newData = data;
        if (data.allDay && data.endDate < data.startDate) {
            setHasError(true);
            return setErrors("Please choose a valid date time combination!");
        }
        if (data.custom.repeatingFormat === 'weekly' && !data.custom.repeatingDays.length) {
            setHasError(true);
            return setErrors("Please select the days for which to repeat the schedule!");
        }

        if (data.repeating === 'custom' && !data.custom.number) {
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
                startDate: start.getTime(),
                endDate: end.getTime(),
            }));
            newData = { ...data, startDate: start.getTime(), endDate: end.getTime() };
        }
        setLoading(true);

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
                if (typeof response?.data === "string")
                    setErrors(response?.data);
                else {
                    onClose()
                    setTimeout(() => {
                        Alert('Schedule', `The following dates are not available and have been skipped being added:\n\n${response?.data.map((date: string) => new Date(date).toLocaleDateString()).join('\n')}`)
                    }, 500);
                }
            });
    };

    const checkForInvalidDate =
        (data.startDate >= data.endDate || data.startDate < new Date().getTime()) &&
        !data.allDay

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
            <StartEnd data={data} checkForInvalidDate={checkForInvalidDate} updateData={updateData} />
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
                        Please enter a start date after the end time!
                    </Text>
                </View>
            </AnimateHeight>
            <Input
                placeholder="Enter a summary"
                label="Summary (Optional)"
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
            <AnimateHeight open={data.repeating !== 'notRepeating'}>
                <EndRepeating data={data} updateData={updateData} maxRepeatingDate={maxRepeatingDate} />
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
                    text="Create Schedule"
                />
            </View>
        </>
    );
};
