import {Text} from '@components/layout/text';
import {useSelector} from 'react-redux';
import {getUserName} from '../selectors/user';
import {Button} from '@components/layout/button';
import {StyleSheet} from 'react-native';
import {useContext} from 'react';
import {PopupContext} from 'src/popup/context';

const style = StyleSheet.create({
    button: {
        marginTop: 30,
    },
    text: {
        lineHeight: 24,
    },
    subtitle: {
        lineHeight: 24,
        marginTop: 15,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export const RegisterComplete = () => {
    const {setPopupData} = useContext(PopupContext);
    const name = useSelector(getUserName);

    const handleDismiss = () => {
        setPopupData({isVisible: false});
    };

    return (
        <>
            <Text style={style.text}>
                Thank you for registering for PetrolShare{' '}
                <Text style={style.bold}>{name || 'User'}</Text>.
            </Text>
            <Text style={style.subtitle}>
                Please check your email for a confirmation message to activate your account!
            </Text>
            <Button style={style.button} onPress={handleDismiss}>
                Dismiss
            </Button>
        </>
    );
};
