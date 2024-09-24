import {Colors} from '@constants/colors';
import {Text} from '@components/layout/text';
import {z} from 'zod';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    logo: {marginTop: 100, fontSize: 26, textAlign: 'center', marginBottom: 20},
    inputGroup: {gap: 20},
    container: {
        gap: 25,
    },
    errorBox: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#EECFCF',
        borderRadius: 4,
    },
    error: {
        color: '#7B1D1D',
    },
    seperator: {
        height: 1,
        backgroundColor: Colors.border,
    },
});
export const MISSING_VALUE = 'Please fill out this required field!';

export const validation = z
    .object({
        email: z.string().trim().min(1, MISSING_VALUE).email('Please enter a valid email!'),
        password: z.string().trim().min(1, MISSING_VALUE),
    })
    .required();

export const Header = () => (
    <Text style={styles.logo} bold>
        PetrolShare
    </Text>
);
