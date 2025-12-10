import {StyleSheet, View} from 'react-native';
import {Text} from './text';
import {Colors} from '@constants/colors';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export const DescriptionBox = ({content}: {content: string}) => (
    <View style={styles.container}>
        <Text style={styles.text}>{content}</Text>
    </View>
);
