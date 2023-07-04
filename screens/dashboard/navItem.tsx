import { View, TouchableWithoutFeedback } from "react-native";
import { Text } from '../../components/Themed'
import analytics from '@react-native-firebase/analytics'

type PropsType = {
    icon: JSX.Element,
    text: string,
    active: string
    handleClick: (tab: string) => void
}

export default ({ icon, text, active, handleClick }: PropsType) => {

    const onClick = () => {
        try {
            analytics().logSelectContent({
                content_type: 'button',
                item_id: text
            })
        } catch { }
        handleClick(text)
    }
    return <TouchableWithoutFeedback onPress={onClick}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', opacity: active === text ? 1 : 0.5, paddingVertical: 15, paddingHorizontal: 5 }}>
            {icon}
            <Text style={{ fontSize: 14, fontWeight: "700" }}>{text}</Text>
        </View>
    </TouchableWithoutFeedback>
}