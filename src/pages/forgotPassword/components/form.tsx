import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {NativeSyntheticEvent, TextInputChangeEventData, View, StyleSheet} from 'react-native';
import {FC, useContext, useState} from 'react';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/api-routes';
import {PopupContext} from 'src/popup/context';
import {ForgotPasswordType} from '../page';
import {MISSING_VALUE} from '@constants/common';
import {z} from 'zod';
import {ThankYou} from './thankYou';

const validation = z
    .object({
        email: z.string().trim().min(1, MISSING_VALUE).email('Please enter a valid email!'),
    })
    .required();

const styles = StyleSheet.create({
    container: {
        gap: 25,
    },
});

export const Form: FC<ForgotPasswordType> = ({emailAddress, handleInput}) => {
    const {setPopupData} = useContext(PopupContext);
    const [formState, setFormState] = useState({email: emailAddress, isLoading: false, error: ''});

    const setEmail = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const value = e.nativeEvent.text;
        setFormState(rest => ({...rest, email: value, error: ''}));
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
