import {TextInput, View} from 'react-native';
import {z} from 'zod';
import {FC, useRef} from 'react';
import {useRouter} from 'expo-router';
import {commonStyles} from './commonStyles';
import {Input} from '@components/layout/input';
import {Text} from '@components/layout/text';
import {Button} from '@components/layout/button';
import {FormValues, MISSING_VALUE} from '@constants/common';

const stepOneValidation = z.object({
    name: z.string().min(1, MISSING_VALUE).trim(),
    email: z.string().min(1, MISSING_VALUE).trim().email('Please enter a valid email!'),
});

type PropsType = {
    data: {
        email: FormValues;
        name: FormValues;
    };
    setData: (data: {[key: string]: FormValues}) => void;
    setStep: (step: number) => void;
};

export const StepOne: FC<PropsType> = ({data, setData, setStep}) => {
    const {push} = useRouter();

    const validateStepOne = () => {
        const {
            email: {value: email},
            name: {value: name},
        } = data;

        const validate = stepOneValidation.safeParse({name, email});

        const errors = validate.error?.format();

        setData({
            email: {value: email, error: errors?.email?._errors[0]},
            name: {value: name, error: errors?.name?._errors[0]},
        });

        if (validate.success) setStep(1);
    };

    const updateData = (key: string, value: string) => {
        setData({[key]: {value, error: ''}});
    };

    // Refs
    const email = useRef<TextInput>(null);

    return (
        <>
            <View style={commonStyles.box}>
                <View>
                    <Text bold>Welcome to PetrolShare!</Text>
                    <Text style={commonStyles.description}>
                        Please enter your name and email address. Your email address will be used as
                        your login for future access to your account.
                    </Text>
                </View>
                <View style={commonStyles.horizontalLine} />
                <Input
                    onChangeText={value => updateData('name', value)}
                    label="Name:"
                    placeholder="Enter name"
                    value={data.name.value}
                    error={data.name.error}
                    enterKeyHint="next"
                    onSubmitEditing={() => email.current?.focus()}
                />
                <Input
                    onChangeText={value => updateData('email', value)}
                    label="Email:"
                    ref={email}
                    autoComplete="email"
                    keyboardType="email-address"
                    inputMode="email"
                    placeholder="Enter email"
                    value={data.email.value}
                    error={data.email.error}
                    onSubmitEditing={validateStepOne}
                />
            </View>
            <View style={commonStyles.buttons}>
                <Button onPress={validateStepOne} disabled={!data.email.value || !data.name.value}>
                    Continue
                </Button>
                <Button variant="ghost" onPress={() => push('/')}>
                    Back
                </Button>
            </View>
        </>
    );
};
