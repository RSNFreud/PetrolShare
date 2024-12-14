import {StyleSheet} from 'react-native';
import {Text} from '@components/layout/text';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        lineHeight: 24,
    },
});

export const ThankYou = () => (
    <>
        <Text bold style={styles.title}>
            Thank you for your request
        </Text>
        <Text style={styles.text}>
            Your request has been received. If the email is in our database, you will receive
            password reset instructions within a few minutes.
        </Text>
    </>
);
