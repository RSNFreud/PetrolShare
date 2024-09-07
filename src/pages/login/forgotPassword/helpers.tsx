import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View} from 'react-native';
import {Text} from '@components/layout/text';
import {FC, useContext, useState} from 'react';
import {ForgotPasswordType} from './forgotPassword';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/api-routes';
import {PopupContext} from 'src/popup/context';
import {z} from 'zod';

const styles = StyleSheet.create({
    container: {
        gap: 25,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        lineHeight: 24,
    },
});

const MISSING_VALUE = 'Please fill out this required field!';

const validation = z
    .object({
        email: z.string().trim().min(1, MISSING_VALUE).email('Please enter a valid email!'),
    })
    .required();

export const Form: FC<ForgotPasswordType> = ({emailAddress, handleInput}) => {
    const {setPopupData} = useContext(PopupContext);
    const [formState, setFormState] = useState({email: emailAddress, isLoading: false, error: ''});

    const setEmail = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const value = e.nativeEvent.text;
        setFormState(rest => ({...rest, email: value}));
        handleInput(e, 'email');
    };

    const sendEmail = async () => {
        const validate = validation.safeParse({email: formState.email});

        if (!validate.success) {
            const errorMessage = validate.error.format().email?._errors[0] || '';
            return setFormState(prevState => ({
                ...prevState,
                error: errorMessage,
            }));
        }

        setFormState(rest => ({...rest, error: '', isLoading: true}));
        const res = await sendPostRequest(ENDPOINTS.FORGOT_PASSWORD, {
            emailAddress: formState.email,
        });
        if (res?.ok) {
            setPopupData({content: <ThankYou />});
            setTimeout(() => setFormState(rest => ({...rest, isLoading: false})), 300);
            return;
        }
        const text = await res?.text();
        setTimeout(
            () => setFormState(rest => ({...rest, error: text || '', isLoading: false})),
            300,
        );
    };

    return (
        <View style={styles.container}>
            <Input
                label="Email Address:"
                placeholder="name@mail.com"
                value={formState.email}
                error={formState.error}
                onChange={setEmail}
            />
            <Button onPress={sendEmail} loading={formState.isLoading}>
                Send Recovery Email
            </Button>
        </View>
    );
};

export const ThankYou = () => (
    <>
        <Text bold style={styles.title}>
            Thank you for your request
        </Text>
        <Text style={styles.text}>
            Your request has been received. If the email is in our database, you will receive
            password reset instructions within a few minutes.
        </Text>
    </>
);
