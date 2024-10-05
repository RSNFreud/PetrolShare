import {Button} from '@components/layout/button';
import {Text} from '@components/layout/text';
import {logOut} from '@pages/login/reducers/auth';
import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {PopupContext} from 'src/popup/context';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        lineHeight: 24,
    },
    buttons: {
        gap: 15,
        flexDirection: 'row',
        width: '100%',
        marginTop: 30,
    },
    btn: {
        flex: 1,
    },
});

export const Logout = () => {
    const {setPopupData} = useContext(PopupContext);
    const dispatch = useDispatch();

    const handleNo = () => {
        setPopupData({isVisible: false});
    };

    const handleYes = () => {
        setPopupData({isVisible: false});
        dispatch(logOut());
    };

    return (
        <>
            <Text bold style={styles.title}>
                Are you sure you want to sign out?
            </Text>
            <Text style={styles.text}>
                You will be logged out of your account and will need to log in again to access your
                information.
            </Text>
            <View style={styles.buttons}>
                <Button color="red" style={styles.btn} onPress={handleYes}>
                    Yes
                </Button>
                <Button variant="ghost" style={styles.btn} onPress={handleNo}>
                    No
                </Button>
            </View>
        </>
    );
};
