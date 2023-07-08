import { Text, ViewProps } from "./Themed"
import { TouchableWithoutFeedback, View } from 'react-native'
import { useState } from "react"
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
type PropsType = {
    label?: string
    style?: ViewProps['style']
    value?: Date
    mode: 'date' | 'time'
    setValue: (e: Date) => void
    disabled?: boolean
}

export default ({ label, style, value = new Date(), setValue, mode, disabled }: PropsType) => {
    const [modalOpen, setModalOpen] = useState(false)

    const handleChange = (e: DateTimePickerEvent) => {
        setModalOpen(false)
        if (e.nativeEvent.timestamp)
            setValue(new Date(e.nativeEvent.timestamp))
    }

    return <View style={style}>
        {!!label &&
            <Text
                style={{
                    fontWeight: '700',
                    fontSize: 16,
                    lineHeight: 16,
                    marginBottom: 6,
                    color: 'white',
                }}
            >
                {label}
            </Text>}
        <TouchableWithoutFeedback onPress={() => disabled ? null : setModalOpen(true)}>
            <View style={{ display: 'flex', alignItems: 'center' }}>
                <Text style={{
                    fontWeight: '400',
                    fontSize: 16,
                }}>{mode === 'date' ? new Date(value).toLocaleDateString('en-gb') : new Date(value).toLocaleTimeString(undefined, {
                    hour: '2-digit', minute: '2-digit'
                })}</Text>
            </View>
        </TouchableWithoutFeedback>
        {modalOpen &&
            <RNDateTimePicker mode={mode} value={value} minimumDate={new Date()} onChange={handleChange} />}
    </View>
}