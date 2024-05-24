import {Text} from '@components/text';
import {StyleSheet, View} from 'react-native';

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                This app is not available on desktop devices. Please use a mobile device to view the
                application
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
    },
});
