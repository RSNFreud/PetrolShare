import Header from '@components/Header';
import AlertBox from '@components/alertBox';
import NetworkError from '@components/networkError';
import Premium from '@components/premium';
import {deregisterForPushNotifications} from '@components/sendNotification';
import SplashScreenComponent from '@components/splashScreen';
import {Text} from '@components/text';
import * as Sentry from '@sentry/react-native';
import Colors from 'constants/Colors';
import {useFonts} from 'expo-font';
import * as Notifications from 'expo-notifications';
import {Slot, useLocalSearchParams, useNavigationContainerRef, usePathname} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useUpdates} from 'expo-updates';
import {setItem, sendCustomEvent, deleteItem, checkForUpdates, Alert, getItem} from 'hooks';
import {AuthContext, AuthContextType, StoreData} from 'hooks/context';
import {logIn} from 'hooks/login';
import {sendRequestToBackend} from 'hooks/sendRequestToBackend';
import React, {useEffect, useState} from 'react';
import {Animated, View, Dimensions, Platform} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import Purchases from 'react-native-purchases';
import Toast from 'react-native-toast-message';

const ToastConfig = {
    default: ({text1}: {text1?: string}) => (
        <View
            style={{
                backgroundColor: Colors.background,
                borderColor: Colors.border,
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 4,
                paddingVertical: 15,
                paddingHorizontal: 25,
                marginHorizontal: 20,
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    color: 'white',
                    fontWeight: '700',
                    textAlign: 'center',
                    lineHeight: 24,
                }}
            >
                {text1}
            </Text>
        </View>
    ),
};

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
Sentry.init({
    dsn: 'https://9262fe64d3f987c3fdb7f20c0d506641@o4506003486277632.ingest.sentry.io/4506003538575360',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    integrations: [
        new Sentry.ReactNativeTracing({
            routingInstrumentation,
        }),
    ],
});

export const App = () => {
    const [loading, setLoading] = useState(true);
    const [isServerError, setIsServerError] = useState(false);
    const [userData, setUserData] = useState<Partial<StoreData>>({});
    const [isPremium, setIsPremium] = useState(true);
    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    });
    const [notifData, setNotifData] = useState({routeName: '', invoiceID: ''});
    const pathname = usePathname();
    const routeParams = useLocalSearchParams();
    const ref = useNavigationContainerRef();
    const [loadingStatus, setLoadingStatus] = useState({
        fonts: fontsLoaded,
        auth: false,
    });
    const {isChecking, isUpdateAvailable, isDownloading} = useUpdates();

    const store = React.useMemo(
        () => ({
            signIn: async ({emailAddress, password}) => {
                const res = await logIn(emailAddress, password);
                if (res.valid && res.data) {
                    setUserData(res.data);
                    sendCustomEvent('openSplash');
                    setTimeout(() => {
                        sendCustomEvent('closeSplash');
                    }, 500);
                    return {valid: true};
                } else return {valid: false, message: res.errors};
            },
            register: async (e: any) => {
                setUserData(e);
                try {
                    setItem('userData', JSON.stringify(e));
                } catch {}
            },
            retrieveData: userData,
            isServerError: isServerError,
            setData: setUserData,
            updateData: () => fetchData(),
            isLoading: loading,
            isPremium,
            setPremiumStatus: setIsPremium,
            signOut: async () => {
                deleteItem('userData');
                deleteItem('presets');
                if (userData?.emailAddress) deregisterForPushNotifications(userData.emailAddress);
                setUserData({});
            },
            isLoggedIn: Boolean(Object.keys(userData).length),
        }),
        [userData, loading],
    ) as AuthContextType;

    useEffect(() => {
        if (isDownloading) return;
        checkIfAuth();
    }, [isDownloading]);

    // Update session data when user data changes
    useEffect(() => {
        if (userData.authenticationKey) setItem('userData', JSON.stringify(userData));
    }, [userData]);

    useEffect(() => {
        if (isDownloading) return;
        fetchData();
    }, [pathname, isDownloading]);

    useEffect(() => {
        if (routeParams['groupID']) {
            setItem(
                'referalCode',
                routeParams['groupID']?.toString().split('groupID=')[1]?.replace(':', ''),
            );
        }
    }, [routeParams]);

    const checkIfAuth = async () => {
        const ogData = getItem('userData');

        // If not signed in show login
        if (!ogData)
            return setLoadingStatus(loadingStatus => ({
                ...loadingStatus,
                auth: true,
            }));

        // If auth key missing also show login
        const parsed = JSON.parse(ogData);
        if (!('authenticationKey' in parsed)) {
            setLoading(false);
            return store.signOut;
        }

        // Check if auth key valid
        const data = await sendRequestToBackend({
            url: `user/verify?authenticationKey=${parsed.authenticationKey}`,
            onError: () => {
                setIsServerError(true);
            },
        });

        if (data) {
            setIsServerError(false);
            if (data.status === 200) {
                const userData = await data.json();
                setItem('userData', JSON.stringify({...parsed, ...userData}));
                setUserData({...parsed, ...userData});
                setLoadingStatus(loadingStatus => ({
                    ...loadingStatus,
                    auth: true,
                }));
                return;
            }
            if (data.status === 400 && (await data.text()).includes('deactivated')) {
                setTimeout(async () => {
                    Alert('Account Deactivated', await data.text());
                }, 500);
            }

            store.signOut();
        }

        setLoadingStatus(loadingStatus => ({
            ...loadingStatus,
            auth: true,
        }));
    };

    const fetchData = async () => {
        if (!userData.authenticationKey) return;
        const res = await sendRequestToBackend({
            url: `user/get?authenticationKey=${userData?.authenticationKey}`,
        });

        if (res && res.ok) {
            const newData = await res.json();
            setUserData(rest => ({...rest, ...newData}));
        }
    };

    useEffect(() => {
        if (fontsLoaded) setLoadingStatus(loadingStatus => ({...loadingStatus, fonts: true}));
    }, [fontsLoaded]);

    useEffect(() => {
        checkForUpdates(loading);
    }, [isUpdateAvailable]);

    useEffect(() => {
        if (isUpdateAvailable || isChecking || isDownloading) return;
        if (loadingStatus.auth && loadingStatus.fonts) setLoading(false);
    }, [loadingStatus, isChecking, isUpdateAvailable, isDownloading]);

    useEffect(() => {
        let i: string | number | NodeJS.Timeout | undefined;

        if (!loading && !notifData.invoiceID && !notifData.routeName) {
            sendCustomEvent('closeSplash');
        }
        Notifications.addNotificationResponseReceivedListener(e => {
            const routeName = e.notification.request.content.data['route'] as any;
            const invoiceID = e.notification.request.content.data['invoiceID'] as string;
            if (!routeName) return;
            setNotifData({routeName, invoiceID});
        });
        return () => clearTimeout(i);
    }, [loading, notifData]);

    useEffect(() => {
        if (ref) {
            routingInstrumentation.registerNavigationContainer(ref);
        }
    }, [ref]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            Purchases.configure({apiKey: 'goog_lTKKSMIRMQmuaTqjQwdeuRjLqQc'});
        }
        if (Platform.OS === 'ios') {
            Purchases.configure({apiKey: 'appl_WqDbxNapCEFuKTgtIlsqKCMAXVn'});
        }

        EventRegister.addEventListener('sendAlert', e => {
            Toast.show({
                type: 'default',
                text1: e,
            });
        });

        return () => {
            EventRegister.removeEventListener('popupVisible');
            EventRegister.removeEventListener('sendAlert');
        };
    }, []);

    return (
        <>
            <SplashScreenComponent />
            {isServerError && <NetworkError onRetry={checkIfAuth} />}
            <Animated.View
                style={{
                    flex: 1,
                    opacity: loading ? 0 : 1,
                    backgroundColor: Colors.background,
                }}
            >
                <View
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                        backgroundColor: Colors.background,
                        flex: 1,
                    }}
                >
                    <AuthContext.Provider value={store}>
                        {store.isLoggedIn && <Premium />}
                        <Header />
                        <Slot />
                        <AlertBox />
                        <Toast config={ToastConfig} />
                    </AuthContext.Provider>
                    <StatusBar
                        style="light"
                        backgroundColor={pathname != '/' ? Colors.background : Colors.secondary}
                    />
                </View>
            </Animated.View>
        </>
    );
};

export default Sentry.wrap(App);
