import Constants from 'expo-constants';
import {Redirect, Slot} from 'expo-router';
import {FC} from 'react';
import {SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {ApplicationStoreType} from 'src/reducers';
import {isLoggedIn as isLoggedInSelector} from 'src/selectors/user';

type PropsType = {
    isLoggedIn: boolean;
};

const AuthLayout: FC<PropsType> = ({isLoggedIn}) => {
    if (isLoggedIn)
        return (
            <SafeAreaView style={{paddingTop: Constants.statusBarHeight}}>
                <Slot />
            </SafeAreaView>
        );
    return <Redirect href="login" />;
};

const mapStateToProps = (store: ApplicationStoreType) => ({
    isLoggedIn: isLoggedInSelector(store),
});

const AuthLayoutConnected = connect(mapStateToProps)(AuthLayout);

export default AuthLayoutConnected;
