import {Input} from '@components/layout/input';
import {TextInput, View} from 'react-native';
import {Text} from '@components/layout/text';
import {commonStyles} from './commonStyles';
import {Button} from '@components/layout/button';
import {FormValues} from '@constants/common';
import {FC, useEffect, useRef} from 'react';

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

export const StepTwo: FC<PropsType> = ({data, setData, setStep}) => {
    const password = useRef<TextInput>(null);
    const confirmPassword = useRef<TextInput>(null);

    useEffect(() => {
        password.current?.focus();
    }, [password]);

    const updateData = (key: string, value: string) => {
        setData({[key]: {value, error: ''}});
    };

    return (
        <>
            <View style={commonStyles.box}>
                <View>
                    <Text bold>Now, please create your password.</Text>
                    <Text style={commonStyles.description}>
                        Make sure to choose a strong password that includes at least 8 characters
                        and that you'll easily remember.
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
                />
            </View>
            <View style={commonStyles.buttons}>
                <Button disabled={!data.email.value || !data.name.value}>Continue</Button>
                <Button variant="ghost" onPress={() => setStep(0)}>
                    Back
                </Button>
            </View>
        </>
    );
};
