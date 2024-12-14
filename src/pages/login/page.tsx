import {useRouter} from 'expo-router';
import {FC, useContext, useEffect, useRef, useState} from 'react';
import {NativeSyntheticEvent, TextInput, TextInputChangeEventData, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RegisterComplete} from './components/registerComplete';
import {Header} from '@components/layout/baseHeader';
import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {Text} from '@components/layout/text';
import {ForgotPassword} from '@pages/forgotPassword/page';
import {styles, validation} from 'src/pages/login/helpers';
import {login, resetError} from '@pages/login/reducers/auth';
import {getInitialEmail, getLoginData, getRegisterSuccess} from '@pages/login/selectors/user';
import {FormValues, defaultValues} from '@constants/common';
import {useAppDispatch} from 'src/store';
import {resetSuccessPopup} from '@pages/register/reducers/register';
import {AppContext} from '@components/appContext/context';

export const LoginPage: FC = () => {
    const [data, setData] = useState<{email: FormValues; password: FormValues}>({
        email: defaultValues,
        password: defaultValues,
    });

    const {isLoading, error} = useSelector(getLoginData);
    const shouldShowRegister = useSelector(getRegisterSuccess);
    const {setPopupData} = useContext(AppContext);
    const initialEmail = useSelector(getInitialEmail);
    const dispatch = useAppDispatch();

    const {push} = useRouter();
    const password = useRef<TextInput>(null);

    useEffect(() => {
        if (data.email.value) return;
        setData(originalState => ({
            ...originalState,
            email: {...defaultValues, value: initialEmail},
        }));
    }, [initialEmail]);

    useEffect(() => {
        if (!shouldShowRegister) return;
        setPopupData({
            title: 'Thank you!',
            isVisible: true,
            content: <RegisterComplete />,
        });
        dispatch(resetSuccessPopup());
    }, [shouldShowRegister]);

    const handleInput = (e: NativeSyntheticEvent<TextInputChangeEventData>, id: string) => {
        const value = e.nativeEvent.text;
        setData(prevState => ({
            ...prevState,
            [id]: {value, error: ''},
        }));
        if (error) dispatch(resetError());
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
        dispatch(login({emailAddress: email.value, password: password.value}));
    };

    return (
        <>
            <Header />
            <View style={styles.container}>
                <View style={styles.inputGroup}>
                    <Input
                        label="Email:"
                        placeholder="Enter email"
                        keyboardType="email-address"
                        onChange={e => handleInput(e, 'email')}
                        value={data.email.value}
                        error={data.email.error}
                        id={'email'}
                        onSubmitEditing={() => password.current?.focus()}
                        returnKeyType="next"
                    />
                    <Input
                        label="Password:"
                        placeholder="Enter password"
                        onChange={e => handleInput(e, 'password')}
                        value={data.password.value}
                        error={data.password.error}
                        id={'password'}
                        ref={password}
                        secureTextEntry
                        onSubmitEditing={handleSubmit}
                    />
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
