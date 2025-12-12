import {Redirect, Slot} from 'expo-router';
import {FC} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {isLoggedIn as isLoggedInSelector} from '@pages/login/selectors/user';
import {Header} from '@components/layout/header';

const AuthLayout: FC = () => {
    const isLoggedIn = useSelector(isLoggedInSelector);
    if (isLoggedIn)
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}}>
                    <Header />
                    <Slot />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    return <Redirect href="/login" />;
};

export default AuthLayout;
