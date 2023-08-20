import React from "react"
import { View, ViewProps } from "react-native"
import SplitRow from "../../../components/splitRow"
import Colors from "../../../constants/Colors"
import { DataType } from "."
import DatePicker from "../../../components/dateTimePicker"

type PropsType = {
    data: DataType
    checkForInvalidDate: boolean
    updateData: (e: boolean | string | number, value: string | number | boolean, position?: 'custom' | 'customDays') => void
}

export const StartEnd = ({ data, checkForInvalidDate, updateData }: PropsType) => {
    return <View
        style={{
            borderColor: Colors.border,
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 4,
            backgroundColor: Colors.primary,
        }}
    >
        {['startDate', 'endDate'].map(dateType => {
            const isStart = dateType === 'startDate'

            const dateProps = {
                style: {
                    paddingVertical: 13,
                    paddingHorizontal: 16,
                    width: "100%",
                    alignItems: "flex-start",
                },
                textStyle: {
                    color: checkForInvalidDate && isStart ? "#FA4F4F" : '#fff'
                },
                format: {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    weekday: "short",
                },
                value: isStart ? data.startDate : data.endDate
            } as {
                style: ViewProps["style"], value: number
            }

            const onUpdate = (e: number) => updateData(e, dateType)

            return <SplitRow
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
                    <DatePicker
                        {...dateProps}
                        mode="date"
                        setValue={onUpdate}
                    />, !data.allDay && <DatePicker
                        {...dateProps}
                        mode="time"
                        format={{ minute: '2-digit', hour: '2-digit', hourCycle: 'h12' }}
                        style={[dateProps.style, { alignItems: 'flex-end' }]}
                        setValue={onUpdate}
                    />
                ]}
            />
        })}
    </View>
}