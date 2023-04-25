import { useEffect, useState } from "react"
import { Dimensions, LayoutChangeEvent, Modal, Pressable, View } from "react-native"
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
    const [buttonWidth, setButtonWidth] = useState(0)

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


    const handleButtons = (e: LayoutChangeEvent) => {
        if (!data?.buttons) return
        setButtonWidth(data?.buttons?.length === 1 ? e.nativeEvent.layout.width - 50 : ((e.nativeEvent.layout.width - 25) / data?.buttons?.length) - 25)
    }

    const handleButtonClick = (button: ButtonType) => {
        setVisible(false)
        button.onPress && button.onPress()
    }

    return <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        accessibilityLabel={"popup"}
    >
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, alignContent: 'center', paddingHorizontal: 25 }}
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
            <View style={{
                backgroundColor: Colors.secondary,
                borderRadius: 8,
                borderStyle: "solid",
                width: '100%',
                padding: 25,
                borderWidth: 1,
                borderColor: Colors.border,
                zIndex: 4
            }} onLayout={handleButtons}>
                {!!data?.title && <Text style={{ fontWeight: 'bold', lineHeight: 24 }}>{data.title}</Text>}
                {!!data?.message && <Text style={{ lineHeight: 24, marginTop: data?.title ? 10 : 0, }}>{data?.message}</Text>}
                {!!data?.buttons && <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', gap: 25 }}>
                    {data?.buttons.map(button => (<Button size="medium" handleClick={() => handleButtonClick(button)} children={button.text} styles={{ width: buttonWidth }} style={button.style !== 'cancel' ? 'regular' : 'ghost'} />))}
                </View>}
            </View>
        </View>
    </Modal>

}