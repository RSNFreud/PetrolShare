import {Text} from '@components/text';
import {View} from 'react-native';

import Colors from '../../../constants/Colors';

export type UserColourType = {userID: string; colour: string};

type PropsType = {
    currentDate: number;
};

export default ({currentDate}: PropsType) => {
    return (
        <View
            style={{
                backgroundColor: Colors.secondary,
                paddingVertical: 20,
                paddingBottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 15,
            }}
        >
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    paddingHorizontal: 20,
                }}
            >
                <Text
                    style={{
                        fontWeight: '400',
                        fontSize: 16,
                    }}
                >
                    {new Date(currentDate).toLocaleDateString('en-gb', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </Text>
            </View>
        </View>
    );
};
