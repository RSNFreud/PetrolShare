import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {Text} from '@components/layout/text';
import {ENDPOINTS} from '@constants/api-routes';
import {Colors} from '@constants/colors';
import {useContext, useState} from 'react';
import {NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View} from 'react-native';
import {RootContext} from 'src/context/rootContext';
import {sendCustomEvent} from 'src/hooks/common';
import {registerForPushNotificationsAsync} from 'src/hooks/notifications';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ForgotPassword} from 'src/pages/login/forgotPassword/forgotPassword';

const styles = StyleSheet.create({
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

type FormValues = {
    email: string;
    password: string;
};

type FormErrors = {
    email: string;
    password: string;
    formError?: string;
};

const MISSING_VALUE = 'Please fill out this required field!';

export const LoginPage = () => {
    const [values, setValues] = useState<FormValues>({email: '', password: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({email: '', password: '', formError: ''});

    const {setUserData, setIsLoggedIn} = useContext(RootContext);

    const handleInput = (e: NativeSyntheticEvent<TextInputChangeEventData>, id: string) => {
        const value = e.nativeEvent.text;
        setValues(values => ({...values, [id]: value}));
        setErrors(errors => ({...errors, [id]: '', formError: ''}));
    };

    const handleSubmit = async () => {
        let parsedErrors: FormErrors = {email: '', password: '', formError: ''};
        Object.entries(values).map(([key, value]) => {
            if (key === 'formError') return;
            if (!value) parsedErrors[key as keyof FormValues] = MISSING_VALUE;
            if (key === 'email' && !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
                parsedErrors[key as keyof FormValues] = 'Please enter a valid email!';
        });
        setErrors(parsedErrors);
        if (Boolean(Object.values(parsedErrors).filter(e => e).length)) return;
        setIsLoading(true);

        const res = await sendPostRequest(ENDPOINTS.LOGIN, {
            emailAddress: values.email,
            password: values.password,
        });

        if (res) {
            if (res.ok && res.status === 200) {
                const data = await res.json();
                await registerForPushNotificationsAsync(values.email);
                sendCustomEvent('openSplash');
                setTimeout(() => {
                    sendCustomEvent('closeSplash');
                }, 500);
                setIsLoading(false);
                setUserData(data);
                setIsLoggedIn(true);
            } else {
                const text = await res.text();
                setErrors(rest => ({
                    ...rest,
                    formError: text,
                }));
                setIsLoading(false);
            }
            return;
        }
        setIsLoading(false);
        setErrors(rest => ({
            ...rest,
            formError:
                'We are having trouble connecting to our authentication servers. Please try again later...',
        }));
    };

    return (
        <>
            <Text style={styles.logo} bold>
                PetrolShare
            </Text>
            <View style={styles.container}>
                <View style={styles.inputGroup}>
                    <Input
                        placeholder="Enter email"
                        label="Email:"
                        onChange={e => handleInput(e, 'email')}
                        value={values.email}
                        error={errors.email}
                        id="email"
                        keyboardType="email-address"
                    />
                    <Input
                        placeholder="Enter password"
                        label="Password:"
                        onChange={e => handleInput(e, 'password')}
                        value={values.password}
                        error={errors.password}
                        id="password"
                        secureTextEntry
                    />
                </View>
                {errors.formError && (
                    <View style={styles.errorBox}>
                        <Text style={styles.error}>{errors.formError}</Text>
                    </View>
                )}
                <ForgotPassword emailAddress={values.email} handleInput={handleInput} />
                <Button onPress={handleSubmit} loading={isLoading}>
                    Login
                </Button>
                <View style={styles.seperator} />
                <Button variant="ghost">Register</Button>
            </View>
        </>
    );
};

export default LoginPage;
