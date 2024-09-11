import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {useRouter} from 'expo-router';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Header} from 'src/pages/login/helpers';
import {z} from 'zod';

const styles = StyleSheet.create({
    box: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
        gap: 20,
    },
    description: {
        marginTop: 10,
        lineHeight: 24,
    },
    horizontalLine: {
        height: 1,
        backgroundColor: Colors.border,
    },
    buttons: {
        marginTop: 20,
        gap: 18,
    },
});

type FormValues = {
    error?: string;
    value: string;
};
const defaultValues = {
    error: '',
    value: '',
};

const MISSING_VALUE = 'Please fill out this required field!';

const stepOneValidation = z.object({
    name: z.string().min(1, MISSING_VALUE).trim(),
    email: z.string().min(1, MISSING_VALUE).trim().email('Please enter a valid email!'),
});

const Register = () => {
    const [step, setStep] = useState<number>(0);
    const [data, setData] = useState<{
        name: FormValues;
        email: FormValues;
        password: FormValues;
        confirmPassword: FormValues;
    }>({
        name: defaultValues,
        email: defaultValues,
        password: defaultValues,
        confirmPassword: defaultValues,
    });
    const {push} = useRouter();

    const updateData = (key: string, value: string) => {
        setData(prevState => ({...prevState, [key]: {value, error: ''}}));
    };

    const validateStepOne = () => {
        const {
            email: {value: email},
            name: {value: name},
        } = data;

        const validate = stepOneValidation.safeParse({name, email});

        const errors = validate.error?.format();

        setData(prevState => ({
            ...prevState,
            email: {value: email, error: errors?.email?._errors[0]},
            name: {value: name, error: errors?.name?._errors[0]},
        }));

        if (validate.success) setStep(1);
    };

    const STEPS: {[key: number]: React.ReactNode} = {
        [0]: (
            <>
                <View style={styles.box}>
                    <View>
                        <Text bold>Welcome to PetrolShare!</Text>
                        <Text style={styles.description}>
                            Please enter your name and email address. Your email address will be
                            used as your login for future access to your account.
                        </Text>
                    </View>
                    <View style={styles.horizontalLine} />
                    <Input
                        onChangeText={value => updateData('name', value)}
                        label="Name:"
                        placeholder="Enter name"
                        value={data.name.value}
                        error={data.name.error}
                    />
                    <Input
                        onChangeText={value => updateData('email', value)}
                        label="Email:"
                        keyboardType="email-address"
                        placeholder="Enter email"
                        value={data.email.value}
                        error={data.email.error}
                    />
                </View>
                <View style={styles.buttons}>
                    <Button
                        onPress={validateStepOne}
                        disabled={!data.email.value || !data.name.value}
                    >
                        Continue
                    </Button>
                    <Button variant="ghost" onPress={() => push('/')}>
                        Back
                    </Button>
                </View>
            </>
        ),
        [1]: (
            <>
                <View style={styles.box}>
                    <View>
                        <Text bold>Now, please create your password.</Text>
                        <Text style={styles.description}>
                            Make sure to choose a strong password that includes at least 8
                            characters and that you'll easily remember.
                        </Text>
                    </View>
                    <View style={styles.horizontalLine} />
                    <Input
                        label="Password:"
                        secureTextEntry
                        placeholder="••••••••••"
                        onChangeText={value => updateData('password', value)}
                        value={data.password.value}
                        error={data.password.error}
                    />
                    <Input
                        label="Confirm Password:"
                        secureTextEntry
                        placeholder="••••••••••"
                        onChangeText={value => updateData('confirmPassword', value)}
                        value={data.confirmPassword.value}
                        error={data.confirmPassword.error}
                    />
                </View>
                <View style={styles.buttons}>
                    <Button disabled={!data.email.value || !data.name.value}>Continue</Button>
                    <Button variant="ghost" onPress={() => setStep(0)}>
                        Back
                    </Button>
                </View>
            </>
        ),
    };

    return (
        <>
            <Header />
            {STEPS[step]}
        </>
    );
};

export default Register;
