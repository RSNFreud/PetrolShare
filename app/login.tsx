import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {Text} from '@components/layout/text';
import {FC, useState} from 'react';
import {NativeSyntheticEvent, TextInputChangeEventData, View} from 'react-native';
import {connect} from 'react-redux';
import {ForgotPassword} from 'src/pages/login/forgotPassword/forgotPassword';
import {formFields, styles, validation} from 'src/pages/login/helpers';
import {ApplicationStoreType} from 'src/reducers';
import {login as loginAction, resetError as resetErrorAction} from 'src/reducers/auth';
import {getLoginData} from 'src/selectors/user';

type FormValues = {
    email: string;
    password: string;
};

type FormErrors = Partial<FormValues>;
type PropsType = {
    login: (data: {emailAddress: string; password: string}) => void;
    isLoading: boolean;
    error: string;
    resetError: () => void;
};

const LoginPage: FC<PropsType> = ({login, isLoading, error, resetError}) => {
    const [formState, setFormState] = useState<{values: FormValues; errors: FormErrors}>({
        values: {email: '', password: ''},
        errors: {},
    });

    const handleInput = (e: NativeSyntheticEvent<TextInputChangeEventData>, id: string) => {
        const value = e.nativeEvent.text;
        setFormState(prevState => ({
            values: {...prevState.values, [id]: value},
            errors: {...prevState.errors, [id]: ''},
        }));
        resetError();
    };

    const handleSubmit = async () => {
        const validate = validation.safeParse(formState.values);
        const errors = validate.error?.format();

        setFormState(prevState => ({
            ...prevState,
            errors: {
                email: errors?.email?._errors[0],
                password: errors?.password?._errors[0],
            },
        }));
        if (!validate.success) return;
        const {email, password} = formState.values;
        login({emailAddress: email, password});
    };

    return (
        <>
            <Text style={styles.logo} bold>
                PetrolShare
            </Text>
            <View style={styles.container}>
                <View style={styles.inputGroup}>
                    {formFields.map(field => (
                        <Input
                            {...field}
                            onChange={e => handleInput(e, field.key)}
                            key={field.key}
                            value={formState.values[field.key as keyof FormValues]}
                            error={formState.errors[field.key as keyof FormValues]}
                            id={field.key}
                        />
                    ))}
                </View>
                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.error}>{error}</Text>
                    </View>
                )}
                <ForgotPassword emailAddress={formState.values.email} handleInput={handleInput} />
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
