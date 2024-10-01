import Constants from 'expo-constants';
import {Redirect, Slot} from 'expo-router';
import {FC} from 'react';
import {SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {isLoggedIn as isLoggedInSelector} from '@pages/login/selectors/user';

const AuthLayout: FC = () => {
    const isLoggedIn = useSelector(isLoggedInSelector);
    if (isLoggedIn)
        return (
            <SafeAreaView style={{paddingTop: Constants.statusBarHeight}}>
                <Slot />
            </SafeAreaView>
        );
    return <Redirect href="login" />;
};

export default AuthLayout;
