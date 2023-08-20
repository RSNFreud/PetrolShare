import { View, ScrollView } from "react-native"
import Dropdown from "../../../components/Dropdown"
import Input from "../../../components/Input"
import AnimateHeight from "../../../components/animateHeight"
import { Day } from "./day"
import { DataType } from "."
import { Text } from "../../../components/Themed"

type PropsType = {
    data: DataType
    updateData: (e: boolean | string | number, value: string | number | boolean, position?: 'custom' | 'customDays') => void
}

export const Custom = ({ data, updateData }: PropsType) => {
    return <>
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                marginTop: 15,
            }}
        >
            <Text>Repeat every</Text>
            <Input
                value={data.custom.number}
                handleInput={(e) => updateData(e, "number", 'custom')}
                placeholder=""
                inputStyle={{
                    width: 45,
                    height: 40,
                    paddingRight: 0,
                    paddingVertical: 10,
                    textAlign: "center",
                    paddingHorizontal: 0,
                    overflow: "hidden",
                }}
            />
            <Dropdown
                sort={false}
                hiddenValue
                value={data.custom.repeatingFormat}
                data={[
                    { name: "Day", value: "daily" },
                    { name: "Week", value: "weekly" },
                    { name: "Month", value: "monthly" },
                ]}
                placeholder="Day"
                handleSelected={(e) => updateData(e, "repeatingFormat", 'custom')}
                inputStyle={{ height: 40 }}
                style={{ flex: 1 }}
                hasBottomMargin={false}
            />
        </View>
        <AnimateHeight open={data.custom.repeatingFormat === "weekly"}>
            <Text style={{ marginTop: 25, fontWeight: "bold" }}>Repeat on</Text>
            <ScrollView
                horizontal
                contentContainerStyle={{ gap: 15, marginTop: 15, marginBottom: 10 }}
            >
                {[
                    { value: "0", label: "Su" },
                    { value: "1", label: "Mo" },
                    { value: "2", label: "Tu" },
                    { value: "3", label: "We" },
                    { value: "4", label: "Th" },
                    { value: "5", label: "F" },
                    { value: "6", label: "Sa" },
                ].map(({ label, value }) => (
                    <Day
                        key={label}
                        handleClick={() => updateData('', value, 'customDays')}
                        value={value}
                        label={label}
                        active={data.custom.repeatingDays.includes(value)}
                    />
                ))}
            </ScrollView>
        </AnimateHeight>
    </>
}