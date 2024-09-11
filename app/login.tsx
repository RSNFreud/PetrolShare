import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {Text} from '@components/layout/text';
import {useRouter} from 'expo-router';
import {FC, useState} from 'react';
import {NativeSyntheticEvent, TextInputChangeEventData, View} from 'react-native';
import {connect} from 'react-redux';
import {ForgotPassword} from 'src/pages/forgotPassword/forgotPassword';
import {formFields, Header, styles, validation} from 'src/pages/login/helpers';
import {ApplicationStoreType} from 'src/reducers';
import {login as loginAction, resetError as resetErrorAction} from 'src/reducers/auth';
import {getLoginData} from 'src/selectors/user';

type FormValues = {
    error?: string;
    value: string;
};

type PropsType = {
    login: (data: {emailAddress: string; password: string}) => void;
    isLoading: boolean;
    error: string;
    resetError: () => void;
};

const defaultValues = {
    error: '',
    value: '',
};

const LoginPage: FC<PropsType> = ({login, isLoading, error, resetError}) => {
    const [data, setData] = useState<{email: FormValues; password: FormValues}>({
        email: defaultValues,
        password: defaultValues,
    });

    const {push} = useRouter();

    const handleInput = (e: NativeSyntheticEvent<TextInputChangeEventData>, id: string) => {
        const value = e.nativeEvent.text;
        setData(prevState => ({
            ...prevState,
            [id]: {value, error: ''},
        }));
        resetError();
    };

    const handleSubmit = async () => {
        const {email, password} = data;

        const validate = validation.safeParse({email: email.value, password: password.value});
        const errors = validate.error?.format();

        setData(prevState => ({
            email: {...prevState.email, error: errors?.email?._errors[0]},
            password: {...prevState.password, error: errors?.password?._errors[0]},
        }));
        if (!validate.success) return;
        login({emailAddress: email.value, password: password.value});
    };

    return (
        <>
            <Header />
            <View style={styles.container}>
                <View style={styles.inputGroup}>
                    {formFields.map(field => (
                        <Input
                            {...field}
                            onChange={e => handleInput(e, field.key)}
                            key={field.key}
                            value={data[field.key].value}
                            error={data[field.key].error}
                            id={field.key}
                        />
                    ))}
                </View>
                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.error}>{error}</Text>
                    </View>
                )}
                <ForgotPassword emailAddress={data.email.value} handleInput={handleInput} />
                <Button onPress={handleSubmit} loading={isLoading}>
                    Login
                </Button>
                <View style={styles.seperator} />
                <Button variant="ghost" onPress={() => push('/register')}>
                    Register
                </Button>
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
