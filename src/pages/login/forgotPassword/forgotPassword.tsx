import {ButtonBase} from '@components/layout/buttonBase';
import {Text} from '@components/layout/text';
import {FC, useContext} from 'react';
import {NativeSyntheticEvent, StyleSheet, TextInputChangeEventData} from 'react-native';
import {RootContext} from 'src/context/rootContext';
import {Form} from './helpers';

const styles = StyleSheet.create({
    forgotPassword: {
        textDecorationLine: 'underline',
    },
});

export type ForgotPasswordType = {
    emailAddress: string;
    handleInput: (e: NativeSyntheticEvent<TextInputChangeEventData>, id: string) => void;
};

export const ForgotPassword: FC<ForgotPasswordType> = ({emailAddress, handleInput}) => {
    const {setPopupData} = useContext(RootContext);

    const openPasswordResetForm = () => {
        setPopupData({
            title: 'Forgot Password',
            hasClose: true,
            content: <Form emailAddress={emailAddress} handleInput={handleInput} />,
            isVisible: true,
        });
    };

    return (
        <>
            <ButtonBase onPress={openPasswordResetForm}>
                <Text style={styles.forgotPassword}>Forgot my password</Text>
            </ButtonBase>
        </>
    );
};
