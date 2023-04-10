import { View, TouchableWithoutFeedback } from "react-native";
import { Text } from '../../components/Themed'

type PropsType = {
    icon: JSX.Element,
    text: string,
    active: string
    handleClick: (tab: string) => void
}

export default ({ icon, text, active, handleClick }: PropsType) => (
    <TouchableWithoutFeedback onPress={() => handleClick(text)}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', opacity: active === text ? 1 : 0.5 }}>
            {icon}
            <Text style={{ fontSize: 14, fontWeight: "700" }}>{text}</Text>
        </View>
    </TouchableWithoutFeedback>
)