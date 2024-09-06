import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {FC, useState} from 'react';
import {NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View} from 'react-native';
import {connect} from 'react-redux';
import {ForgotPassword} from 'src/pages/login/forgotPassword/forgotPassword';
import {ApplicationStoreType} from 'src/reducers';
import {login as loginAction, resetError as resetErrorAction} from 'src/reducers/auth';
import {getLoginData} from 'src/selectors/user';

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

const MISSING_VALUE = 'Please fill out this required field!';

type PropsType = {
    login: (data: {emailAddress: string; password: string}) => void;
    isLoading: boolean;
    error: string;
    resetError: () => void;
};

const LoginPage: FC<PropsType> = ({login, isLoading, error, resetError}) => {
    const [values, setValues] = useState<FormValues>({email: '', password: ''});
    const [errors, setErrors] = useState<FormValues>({email: '', password: ''});

    const handleInput = (e: NativeSyntheticEvent<TextInputChangeEventData>, id: string) => {
        const value = e.nativeEvent.text;
        setValues(values => ({...values, [id]: value}));
        setErrors(errors => ({...errors, [id]: ''}));
        resetError();
    };

    const handleSubmit = async () => {
        let parsedErrors: FormValues = {email: '', password: ''};
        Object.entries(values).map(([key, value]) => {
            if (!value) parsedErrors[key as keyof FormValues] = MISSING_VALUE;
            if (key === 'email' && !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
                parsedErrors[key as keyof FormValues] = 'Please enter a valid email!';
        });
        setErrors(parsedErrors);
        if (Boolean(Object.values(parsedErrors).filter(e => e).length)) return;
        login({emailAddress: values.email, password: values.password});
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
                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.error}>{error}</Text>
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

const mapStateToProps = (store: ApplicationStoreType) => ({
    isLoading: getLoginData(store).isLoading,
    error: getLoginData(store).error,
});

const LoginConnected = connect(mapStateToProps, {
    login: loginAction,
    resetError: resetErrorAction,
})(LoginPage);

export default LoginConnected;
