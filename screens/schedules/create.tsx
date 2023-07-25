import React, { useContext, useState } from "react"
import { Switch, TouchableWithoutFeedback, View } from "react-native"
import DatePicker from "../../components/dateTimePicker"
import { Text } from "../../components/Themed"
import Colors from "../../constants/Colors"
import Input from "../../components/Input"
import Dropdown from "../../components/Dropdown"
import AnimateHeight from "../../components/animateHeight"
import RadioButton from "../../components/RadioButton"
import Button from "../../components/button"
import axios from "axios"
import config from "../../config"
import { AuthContext } from "../../hooks/context"
import { sendCustomEvent } from "../../hooks"

type DayProps = {
    label: string,
    value: string
    handleClick: (value: string) => void
    active: boolean
}

const Day = ({ label, value, active, handleClick }: DayProps) => {
    return <TouchableWithoutFeedback onPress={() => handleClick(value)}><View style={{ borderRadius: 100, width: 40, height: 40, backgroundColor: active ? Colors.tertiary : Colors.primary, justifyContent: 'center', alignContent: 'center', display: 'flex', borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border }}><Text style={{ textAlign: 'center' }}>{label}</Text></View></TouchableWithoutFeedback>
}

export default ({ onClose, currentDate }: {
    onClose: () => void, currentDate: number,
}) => {
    const date = new Date(currentDate)
    const [data, setData] = useState({
        allDay: false,
        startDate: date.getTime(),
        startTime: new Date().getTime(),
        endDate: date.getTime(),
        endTime: new Date().getTime(),
        summary: "",
        repeating: "notRepeating",
        custom: {
            number: "1", repeatingFormat: "day", repeatingDays: [] as string[], ends: { option: "never", endDate: date }
        }
    })
    const [loading, setLoading] = useState(false)
    const { retrieveData } = useContext(AuthContext)
    const [errors, setErrors] = useState("")

    const updateData = (e: Date | boolean | string | number, value: string) => {
        setErrors("")
        setData({ ...data, [value]: e })
    }

    const updateCustomData = (e: any, value: string) => {
        setErrors("")
        setData({ ...data, custom: { ...data.custom, [value]: e } })
    }

    const updateCustomDays = (value: string) => {
        let repeatingDays = data.custom.repeatingDays
        setErrors("")
        if (data.custom.repeatingDays.includes(value)) repeatingDays = repeatingDays.filter(e => e !== value)
        else repeatingDays.push(value)
        setData({ ...data, custom: { ...data.custom, repeatingDays: repeatingDays } })
    }
    const updateCustomEndDate = (key: any, value: any) => {
        let repeatingDays = data.custom.repeatingDays
        setErrors("")
        if (data.custom.repeatingDays.includes(value)) repeatingDays = repeatingDays.filter(e => e !== value)
        else repeatingDays.push(value)
        setData({ ...data, custom: { ...data.custom, ends: { ...data.custom.ends, [key]: value } } })
    }

    const handleSubmit = () => {
        setErrors("")
        if (data.allDay && (data.endDate < data.startDate)) {
            return setErrors("Please choose a valid date time combination!")
        }

        setLoading(true)
        axios.post(config.REACT_APP_API_ADDRESS + '/schedules/add', {
            authenticationKey: retrieveData?.authenticationKey,
            ...data
        })
            .then(() => {
                onClose()
                sendCustomEvent('sendAlert', 'Added new schedule successfully!')
                setLoading(false)
            })
            .catch(({ response }) => {
                setLoading(false)
                setErrors(response.data)
            })
    }

    return <>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Add a new schedule</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, width: '100%' }}>
            <Text style={{ fontWeight: "bold" }}>All day?</Text>
            <Switch trackColor={{ false: Colors.primary, true: Colors.primary }} value={data.allDay} thumbColor={data.allDay ? Colors.tertiary : 'white'} onChange={e => updateData(e.nativeEvent.value, 'allDay')} ios_backgroundColor={Colors.primary} />
        </View>
        {data.allDay ? <>
            <View style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15, backgroundColor: Colors.primary, borderColor: Colors.border,
                alignItems: 'center',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 4,
                height: 53,
                paddingHorizontal: 16,
                paddingVertical: 13,
            }}>
                <DatePicker mode="date" setValue={e => updateData(e, 'startDate')} value={data.startDate} />
            </View>
            <View style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', backgroundColor: Colors.primary, borderColor: Colors.border,
                borderWidth: 1,
                alignItems: 'center',
                borderStyle: 'solid',
                borderRadius: 4,
                height: 53,
                paddingHorizontal: 16,
                paddingVertical: 13,
            }}>
                <DatePicker mode="date" setValue={e => updateData(e, 'endDate')} value={data.endDate} />
            </View>
        </>
            : <>
                <View style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15, backgroundColor: Colors.primary, borderColor: Colors.border,
                    borderWidth: 1,
                    alignItems: 'center',
                    borderStyle: 'solid',
                    borderRadius: 4,
                    height: 53,
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                }}>
                    <DatePicker mode="date" setValue={e => updateData(e, 'startDate')} value={data.startDate} />
                    <DatePicker mode="time" setValue={e => updateData(e, 'startTime')} value={data.startTime} />
                </View>
                <View style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', backgroundColor: Colors.primary, borderColor: Colors.border,
                    borderWidth: 1,
                    alignItems: 'center',
                    borderStyle: 'solid',
                    borderRadius: 4,
                    height: 53,
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                }}>
                    <DatePicker mode="date" setValue={e => updateData(e, 'endDate')} value={data.endDate} />
                    <DatePicker mode="time" setValue={e => updateData(e, 'endTime')} value={data.endTime} />
                </View>
            </>
        }
        <Input placeholder="Enter a summary of the schedule" label="Enter an optional summary" handleInput={e => updateData(e, 'summary')} style={{ marginVertical: 25, }}></Input>
        <Dropdown sort={false} hiddenValue value={data.repeating} data={[{ name: 'Does not repeat', value: 'notRepeating' }, { name: 'Every day', value: 'daily' }, { name: 'Every week', value: 'weekly' }, { name: 'Every month', value: 'monthly' }, { name: 'Custom...', value: 'custom' }]} placeholder="Does not repeat" label="Repeating?" handleSelected={e => updateData(e, 'repeating')} hasBottomMargin={false} />
        <AnimateHeight open={data.repeating === 'custom'}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 15 }}>
                <Text>Repeat every</Text>
                <Input value={data.custom.number} handleInput={e => updateCustomData(e, 'number')} placeholder="1" inputStyle={{ width: 45, height: 40, paddingRight: 0, paddingVertical: 10, textAlign: 'center', paddingHorizontal: 0, overflow: 'hidden' }} />
                <Dropdown sort={false} hiddenValue value={data.custom.repeatingFormat} data={[{ name: 'Day', value: 'daily' }, { name: 'Week', value: 'weekly' }, { name: 'Month', value: 'monthly' }]} placeholder="Day" handleSelected={e => updateCustomData(e, 'repeatingFormat')} inputStyle={{ height: 40 }} style={{ flex: 1 }} hasBottomMargin={false} />
            </View>
            <AnimateHeight open={data.custom.repeatingFormat === 'weekly'}>
                <Text style={{ marginTop: 25, fontWeight: 'bold' }}>Repeat on</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 15 }}>
                    {[{ value: 'sunday', label: 'S' }, { value: 'monday', label: 'M' }, { value: 'tuesday', label: 'T' }].map(({ label, value }) => <Day key={label} handleClick={updateCustomDays} value={value} label={label} active={data.custom.repeatingDays.includes(value)} />)
                    }
                </View>
            </AnimateHeight>
            <Text style={{ marginTop: 25, marginBottom: 15, fontWeight: 'bold' }}>Ends</Text>
            <RadioButton buttons={[{ value: 'never', name: "Never" }, {
                value: 'On', name: "On", rightSideElement: <View style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 15, backgroundColor: Colors.primary, borderColor: Colors.border,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    opacity: data.custom.ends.option === "never" ? 0.5 : 1
                }}>
                    <DatePicker disabled={data.custom.ends.option === "never"} mode="date" setValue={e => updateCustomEndDate('endDate', e)} value={data.custom.ends.endDate} />
                </View>
            }]} value={data.custom.ends.option} handleChange={(e) => updateCustomEndDate('option', e)} />
        </AnimateHeight>
        <View style={{ marginTop: 25 }} >
            <AnimateHeight open={Boolean(errors)}>
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
            <Button loading={loading} handleClick={handleSubmit} text="Create Schedule" />
        </View>
    </>
}