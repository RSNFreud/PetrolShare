import React, { useContext, useEffect, useState } from "react"
import { ColorValue, Switch, TouchableWithoutFeedback, View } from "react-native"
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
import { convertHexToRGBA, sendCustomEvent } from "../../hooks"
import { ScrollView } from "react-native-gesture-handler"
import SplitRow from "../../components/splitRow"

type DayProps = {
    label: string,
    value: string
    handleClick: (value: string) => void
    active: boolean
}

const Day = ({ label, value, active, handleClick }: DayProps) => {
    return <TouchableWithoutFeedback onPress={() => handleClick(value)}><View style={{ borderRadius: 100, width: 40, height: 40, backgroundColor: active ? Colors.tertiary : Colors.primary, justifyContent: 'center', alignContent: 'center', display: 'flex', borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border }}><Text style={{ textAlign: 'center' }}>{label}</Text></View></TouchableWithoutFeedback>
}


const DateWrapper = ({ elements, start, invalidDateColour }: { start?: boolean, elements: React.ReactNode[], invalidDateColour: ColorValue }) => <SplitRow withoutFade style={{
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: start ? 15 : 0, backgroundColor: start ? invalidDateColour : Colors.primary, borderColor: Colors.border,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    height: 53,
}} elements={elements} gap={0} />

export default ({ onClose, currentDate }: {
    onClose: () => void, currentDate: number,
}) => {
    const [data, setData] = useState({
        allDay: false,
        startDate: 0,
        endDate: 0,
        summary: "",
        repeating: "notRepeating",
        custom: {
            number: "1", repeatingFormat: "day", repeatingDays: [] as string[], ends: { option: "never", endDate: 0 }
        }
    })
    const [loading, setLoading] = useState(false)
    const { retrieveData } = useContext(AuthContext)
    const [errors, setErrors] = useState("")
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        let time = new Date(currentDate)
        time = new Date(`${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${new Date().getHours()}:${new Date().getMinutes() + 5}:00`)

        setData({
            ...data,
            startDate: time.getTime(),
            endDate: time.setHours(time.getHours() + 1),
        })
    }, [currentDate])

    const dismissError = () => {
        setHasError(false)
        setTimeout(() => {
            setErrors("")
        }, 500);
    }

    const updateData = (e: boolean | string | number, value: string) => {
        dismissError()
        setData({ ...data, [value]: e })
    }

    useEffect(() => {
        if (data.allDay && data.startDate > data.endDate) {
            setData(data => ({ ...data, endDate: data.startDate }))
        }
    }, [data])

    const updateCustomData = (e: any, value: string) => {
        dismissError()
        setData({ ...data, custom: { ...data.custom, [value]: e } })
    }

    const updateCustomDays = (value: string) => {
        let repeatingDays = data.custom.repeatingDays
        dismissError()
        if (data.custom.repeatingDays.includes(value)) repeatingDays = repeatingDays.filter(e => e !== value)
        else repeatingDays.push(value)
        setData({ ...data, custom: { ...data.custom, repeatingDays: repeatingDays } })
    }
    const updateCustomEndDate = (key: any, value: any) => {
        let repeatingDays = data.custom.repeatingDays
        dismissError()
        if (data.custom.repeatingDays.includes(value)) repeatingDays = repeatingDays.filter(e => e !== value)
        else repeatingDays.push(value)
        setData({ ...data, custom: { ...data.custom, ends: { ...data.custom.ends, [key]: value } } })
    }

    const handleSubmit = () => {
        setHasError(false)
        let newData = data
        if (data.allDay && (data.endDate < data.startDate)) {
            setHasError(true)
            return setErrors("Please choose a valid date time combination!")
        }
        if (data.allDay) {
            const start = new Date(data.startDate)
            start.setHours(0, 1, 0, 0)
            const end = new Date(data.endDate)
            end.setHours(23, 59, 0, 0)
            setData(data => ({ ...data, startDate: start.getTime(), endDate: end.getTime() }))
            newData = { ...data, startDate: start.getTime(), endDate: end.getTime() }
        }
        setLoading(true)

        axios.post(config.REACT_APP_API_ADDRESS + '/schedules/add', {
            authenticationKey: retrieveData?.authenticationKey,
            ...newData
        })
            .then(() => {
                setErrors("")
                onClose()
                sendCustomEvent('sendAlert', 'Added new schedule successfully!')
                setLoading(false)
            })
            .catch(({ response }) => {
                setLoading(false)
                console.log(response.data);
                setHasError(true)
                setErrors(response?.data)
            })
    }

    const checkForInvalidDate = (data.startDate >= data.endDate || data.startDate < new Date().getTime()) && !data.allDay ? convertHexToRGBA('#FA4F4F', 0.5) : Colors.primary

    return <>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Add a new schedule</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, width: '100%' }}>
            <Text style={{ fontWeight: "bold" }}>All day?</Text>
            <Switch trackColor={{ false: Colors.primary, true: Colors.primary }} value={data.allDay} thumbColor={data.allDay ? Colors.tertiary : 'white'} onChange={e => updateData(e.nativeEvent.value, 'allDay')} ios_backgroundColor={Colors.primary} />
        </View>
        {data.allDay ? <>
            <DateWrapper invalidDateColour={checkForInvalidDate} start elements={[<DatePicker style={{ paddingVertical: 13, paddingHorizontal: 16, width: '100%', alignItems: 'flex-start' }} mode="date" setValue={e => updateData(e, 'startDate')} value={data.startDate} />]} />
            <DateWrapper invalidDateColour={checkForInvalidDate} elements={[<DatePicker style={{ paddingVertical: 13, paddingHorizontal: 16, width: '100%', alignItems: 'flex-start' }} mode="date" setValue={e => updateData(e, 'startDate')} value={data.endDate} />]} />
        </>
            : <>
                <DateWrapper invalidDateColour={checkForInvalidDate} start elements={[<DatePicker style={{ paddingVertical: 13, paddingHorizontal: 16, alignSelf: 'flex-start' }} mode="date" setValue={e => updateData(e, 'startDate')} value={data.startDate} />, <DatePicker style={{ paddingVertical: 13, paddingHorizontal: 16, alignSelf: 'flex-end' }} mode="time" setValue={e => updateData(e, 'startDate')} value={data.startDate} />]} />
                <DateWrapper invalidDateColour={checkForInvalidDate} elements={[<DatePicker style={{ paddingVertical: 13, paddingHorizontal: 16, alignSelf: 'flex-start' }} mode="date" setValue={e => updateData(e, 'endDate')} value={data.endDate} />,
                <DatePicker style={{ paddingVertical: 13, paddingHorizontal: 16, alignSelf: 'flex-end' }} mode="time" setValue={e => updateData(e, 'endDate')} value={data.endDate} />]} />
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
                <ScrollView horizontal contentContainerStyle={{ gap: 15, marginTop: 15, marginBottom: 10 }} >
                    {[{ value: 'sunday', label: 'Su' }, { value: 'monday', label: 'Mo' }, { value: 'tuesday', label: 'Tu' }, { value: 'wednesday', label: 'We' }, { value: 'thursday', label: 'Th' }, { value: 'Friday', label: 'F' }, { value: 'saturday', label: 'Sa' }].map(({ label, value }) => <Day key={label} handleClick={updateCustomDays} value={value} label={label} active={data.custom.repeatingDays.includes(value)} />)
                    }
                </ScrollView>
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
            <Button loading={loading} handleClick={handleSubmit} text="Create Schedule" />
        </View>
    </>
}