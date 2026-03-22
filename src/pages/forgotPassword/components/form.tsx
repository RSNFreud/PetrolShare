import {View, StyleSheet, TextInputChangeEvent} from 'react-native';
import {FC, useContext, useState} from 'react';
import {z} from 'zod';
import {ForgotPasswordType} from '../page';
import {ThankYou} from './thankYou';
import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {ENDPOINTS} from '@constants/endpoints';
import {MISSING_VALUE} from '@constants/common';
import {AppContext} from '@components/appContext/context';
import {useValidationRequest} from 'src/hooks/useValidationRequest';
import {DataType, validate} from 'src/hooks/common';

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
    const {setPopupData} = useContext(AppContext);
    const [formState, setFormState] = useState<DataType>({email: {value: emailAddress, error: ''}});
    const {isLoading, sendRequest} = useValidationRequest();

    const setEmail = (e: TextInputChangeEvent) => {
        const value = e.nativeEvent.text;
        setFormState(rest => ({...rest, email: {value, error: ''}}));
        handleInput(e, 'email');
    };

    const sendEmail = async () => {
        const isValid = validate(validation, formState, setFormState);

        if (!isValid) {
            return;
        }

        const res = await sendRequest(ENDPOINTS.FORGOT_PASSWORD, {
            emailAddress: formState.email,
        });
        if (res?.ok) {
            setPopupData({content: <ThankYou />});
            return;
        }
        const text = await res?.text();
        setFormState(prev => ({...prev, email: {...prev.email, error: text || ''}}));
    };

    return (
        <View style={styles.container}>
            <Input
                label="Email Address:"
                placeholder="name@mail.com"
                value={formState.email.value}
                error={formState.email.error}
                onChange={setEmail}
            />
            <Button onPress={sendEmail} loading={isLoading}>
                Send Recovery Email
            </Button>
        </View>
    );
};
