import {Colors} from '@constants/colors';
import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
    box: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
        gap: 20,
    },
    description: {
        marginTop: 10,
        lineHeight: 24,
    },
    horizontalLine: {
        height: 1,
        backgroundColor: Colors.border,
    },
    buttons: {
        marginTop: 20,
        gap: 18,
    },
});
