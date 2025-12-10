import {StyleSheet, View} from 'react-native';
import {Text} from './text';

const styles = StyleSheet.create({
    errorBox: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#EECFCF',
        borderRadius: 4,
        borderColor: '#7B1D1D',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    error: {
        color: '#7B1D1D',
    },
});

export const ErrorBox = ({content}: {content: string}) => (
    <View style={styles.errorBox}>
        <Text style={styles.error}>{content}</Text>
    </View>
);
