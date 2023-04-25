import { useEffect, useState } from "react"
import { Dimensions, LayoutChangeEvent, Modal, Pressable, TouchableWithoutFeedback, View } from "react-native"
import Colors from "../constants/Colors"
import { Button, Text } from "./Themed"
import { EventRegister } from "react-native-event-listeners"

export type ButtonType = {
    text: string;
    onPress?: ((value?: string) => void) | undefined;
    style?: 'default' | 'cancel' | undefined;
}

type AlertDataType = {
    title?: string, message?: string, buttons?: ButtonType[]
}

export default () => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<AlertDataType>()

    const close = () => {
        setVisible(false)
    }

    useEffect(() => {
        EventRegister.addEventListener('openAlert', (e: AlertDataType) => {
            setData(e)
            setVisible(true)
        })
        return () => { EventRegister.removeEventListener('openAlert') }
    }, [])

    const handleButtonClick = (button: ButtonType) => {
        setVisible(false)
        button.onPress && button.onPress()
    }

    return <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        accessibilityLabel={"alertBox"}
        style={{ width: '100%', zIndex: 1000 }}
    >
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, alignContent: 'center' }}
        >
            <Pressable
                onPress={close}
                android_disableSound={true}
                style={{
                    backgroundColor: "rgba(35, 35, 35, 0.8)",
                    zIndex: 2,
                    width: '100%',
                    height: Dimensions.get("window").height, position: 'absolute',
                }}
            />
            <View style={{ paddingHorizontal: 25, width: '100%', zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                <View style={{
                    backgroundColor: Colors.secondary,
                    borderRadius: 8,
                    borderStyle: "solid",
                    padding: 20,
                    borderWidth: 1,
                    borderColor: Colors.border,
                    zIndex: 4
                }}>
                    {!!data?.title && <Text style={{ fontWeight: 'bold', lineHeight: 24 }}>{data.title}</Text>}
                    {!!data?.message && <Text style={{ lineHeight: 24, marginTop: data?.title ? 10 : 0, width: '100%' }}>{data?.message}</Text>}
                    <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', gap: 30, justifyContent: 'flex-end' }}>
                        {data?.buttons?.map(button => (
                            <TouchableWithoutFeedback key={button.text} onPress={() => handleButtonClick(button)}>
                                <Text style={{ color: Colors.tertiary, fontWeight: 'bold', textTransform: 'uppercase' }}>{button.text}</Text>
                            </TouchableWithoutFeedback>
                        ))}
                        {!data?.buttons && <TouchableWithoutFeedback onPress={close}>
                            <Text style={{ color: Colors.tertiary, fontWeight: 'bold', textTransform: 'uppercase' }}>Close</Text>
                        </TouchableWithoutFeedback>}
                    </View>
                </View>
            </View>
        </View>
    </Modal>

}