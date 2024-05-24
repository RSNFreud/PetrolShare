import {Text} from '@components/text';
import {TouchableWithoutFeedback, View} from 'react-native';
import {DateData} from 'react-native-calendars';
import {DayProps} from 'react-native-calendars/src/calendar/day';

import Colors from '../../../constants/Colors';

export default ({
    state,
    marking,
    date,
}: DayProps & {
    date?: DateData;
}) => {
    const getDayString = (day: number) => {
        switch (day) {
            case 0:
                return 'Sun';
            case 1:
                return 'Mon';
            case 2:
                return 'Tue';
            case 3:
                return 'Wed';
            case 4:
                return 'Thu';
            case 5:
                return 'Fri';
            case 6:
                return 'Sat';
        }
    };
    return (
        <View>
            <View
                style={{
                    gap: 2,
                    justifyContent: 'center',
                    opacity: state !== 'disabled' ? 1 : 0.5,
                    width: 32,
                }}
            >
                <View
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 100,
                        backgroundColor: state === 'selected' ? Colors.tertiary : 'transparent',
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            textAlign: 'center',
                        }}
                    >
                        {new Date(date?.timestamp || '').getDate()}
                    </Text>
                </View>
            </View>
        </View>
    );
};
