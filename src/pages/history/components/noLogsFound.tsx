import {Text} from '@components/layout/text';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export const NoLogsFound = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                No records found for the selected date range.{'\n'}Log your distance in the
                dashboard to see it here.
            </Text>
        </View>
    );
};
