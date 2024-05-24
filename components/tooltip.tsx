import {Platform, TouchableWithoutFeedback, View} from 'react-native';

import {Text} from './text';
import Colors from '../constants/Colors';
import {Alert} from '../hooks';

type PropsType = {
    style?: View['props']['style'];
    title: string;
    message: string;
};

export default ({style, title, message}: PropsType) => {
    const openTooltip = () => {
        Alert(title, message);
    };

    return (
        <TouchableWithoutFeedback onPress={openTooltip}>
            <View
                style={[
                    {
                        borderRadius: 100,
                        width: 17,
                        height: 17,
                        backgroundColor: Colors.tertiary,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    style,
                ]}
            >
                <Text style={{fontSize: 14, marginTop: Platform.OS !== 'web' ? -2 : 0}}>?</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};
