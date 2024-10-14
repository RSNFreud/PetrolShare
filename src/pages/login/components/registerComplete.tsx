import {Text} from '@components/layout/text';
import {useSelector} from 'react-redux';
import {getUserName} from '../selectors/user';
import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
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
    const name = useSelector(getUserName);

    return (
        <>
            <Text style={style.text}>
                Thank you for registering for PetrolShare{' '}
                <Text style={style.bold}>{name || 'User'}</Text>.
            </Text>
            <Text style={style.subtitle}>
                Please check your email for a confirmation message to activate your account!
            </Text>
        </>
    );
};
