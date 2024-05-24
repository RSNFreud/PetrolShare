import {Text} from '@components/text';
import analytics from '@react-native-firebase/analytics';
import {View, TouchableWithoutFeedback} from 'react-native';

type PropsType = {
    icon: React.ReactNode;
    text: string;
    active: boolean;
    handleClick: (tab: string) => void;
};

export default ({icon, text, active, handleClick}: PropsType) => {
    const onClick = () => {
        try {
            analytics().logSelectContent({
                content_type: 'button',
                item_id: text,
            });
        } catch {}
        handleClick(text);
    };
    return (
        <TouchableWithoutFeedback onPress={onClick}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    opacity: active ? 1 : 0.5,
                    paddingVertical: 15,
                }}
            >
                {icon}
                <Text style={{fontSize: 14, fontWeight: '700'}}>{text}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};
