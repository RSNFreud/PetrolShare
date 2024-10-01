import {Input} from '@components/layout/input';
import {StyleSheet, TextInput, View} from 'react-native';
import {Text} from '@components/layout/text';
import {commonStyles} from './commonStyles';
import {Button} from '@components/layout/button';
import {FormValues, MISSING_VALUE} from '@constants/common';
import {FC, useEffect, useRef} from 'react';
import {z} from 'zod';
import {useAppDispatch} from 'src/store';
import {register} from '../reducers/register';
import {useSelector} from 'react-redux';
import {getRegisterData} from '../selectors';

type PropsType = {
    data: {
        password: FormValues;
        email: FormValues;
        name: FormValues;
        confirmPassword: FormValues;
    };
    setData: (data: {[key: string]: FormValues}) => void;
    setStep: (step: number) => void;
};

const validation = z
    .object({
        password: z.string().min(1, MISSING_VALUE),
        confirmPassword: z.string().min(1, MISSING_VALUE),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Your passwords do not match. Please ensure both passwords are identical.',
        path: ['confirmPassword'],
    });

const styles = StyleSheet.create({
    errorBox: {
        borderRadius: 4,
        marginTop: 20,
        backgroundColor: '#EECFCF',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    error: {
        color: '#7B1D1D',
    },
});

export const StepTwo: FC<PropsType> = ({data, setData, setStep}) => {
    const password = useRef<TextInput>(null);
    const confirmPassword = useRef<TextInput>(null);

    const {isLoading, error} = useSelector(getRegisterData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        password.current?.focus();
    }, [password]);

    const updateData = (key: string, value: string) => {
        setData({[key]: {value, error: ''}});
    };

    const handleSubmit = () => {
        const {
            password: {value: password},
            confirmPassword: {value: confirmPassword},
            email: {value: emailAddress},
            name: {value: fullName},
        } = data;
        const validate = validation.safeParse({password, confirmPassword});

        const errors = validate.error?.format();

        setData({
            password: {value: password, error: errors?.password?._errors[0]},
            confirmPassword: {value: confirmPassword, error: errors?.confirmPassword?._errors[0]},
        });

        if (!validate.success) return;
        dispatch(register({password, emailAddress, fullName}));
    };

    return (
        <>
            <View style={commonStyles.box}>
                <View>
                    <Text bold>Now, please create your password.</Text>
                    <Text style={commonStyles.description}>
                        Make sure to choose a strong password that you'll easily remember.
                    </Text>
                </View>
                <View style={commonStyles.horizontalLine} />
                <Input
                    label="Password:"
                    secureTextEntry
                    ref={password}
                    placeholder="••••••••••"
                    onChangeText={value => updateData('password', value)}
                    onSubmitEditing={() => confirmPassword.current?.focus()}
                    enterKeyHint="next"
                    value={data.password.value}
                    error={data.password.error}
                />
                <Input
                    label="Confirm Password:"
                    ref={confirmPassword}
                    secureTextEntry
                    placeholder="••••••••••"
                    onChangeText={value => updateData('confirmPassword', value)}
                    value={data.confirmPassword.value}
                    error={data.confirmPassword.error}
                    onSubmitEditing={handleSubmit}
                />
            </View>
            {error && (
                <View style={styles.errorBox}>
                    <Text style={styles.error}>{error}</Text>
                </View>
            )}
            <View style={commonStyles.buttons}>
                <Button
                    disabled={!data.password.value || !data.confirmPassword.value}
                    loading={isLoading}
                    onPress={handleSubmit}
                >
                    Continue
                </Button>
                <Button variant="ghost" onPress={() => setStep(0)}>
                    Back
                </Button>
            </View>
        </>
    );
};
