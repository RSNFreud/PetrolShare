import {z} from 'zod';
import {StyleSheet} from 'react-native';
import {Colors} from '@constants/colors';
import {MISSING_VALUE} from '@constants/common';

export const styles = StyleSheet.create({
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

export const validation = z
    .object({
        email: z.string().trim().min(1, MISSING_VALUE).email('Please enter a valid email!'),
        password: z.string().trim().min(1, MISSING_VALUE),
    })
    .required();
