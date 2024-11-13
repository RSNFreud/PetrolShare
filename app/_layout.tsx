import {SplashScreen as SplashScreenComponent} from '@components/layout/splashScreen';
import {useFonts} from 'expo-font';
import {Slot, SplashScreen} from 'expo-router';
import {useState} from 'react';
import {ScrollView} from 'react-native';
import {Provider} from 'react-redux';
import {Popup} from '@components/layout/popup';
import {persistor, store} from 'src/store';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'expo-status-bar';
import {AppProvider} from '@components/appContext/provider';
import {Alertbox} from '@components/layout/alertBox';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.hideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require('src/assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('src/assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('src/assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('src/assets/fonts/Roboto-Light.ttf'),
    });
    const [loading, setLoading] = useState(true);

    if (!loading) {
        return null;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}></PersistGate>
            <AppProvider>
                <SplashScreenComponent />
                <ScrollView
                    style={{paddingHorizontal: 18}}
                    contentContainerStyle={{paddingBottom: 18}}
                    automaticallyAdjustKeyboardInsets={true}
                    keyboardShouldPersistTaps="always"
                >
                    <Slot />
                </ScrollView>
                <Popup />
                <Alertbox />
            </AppProvider>
            <StatusBar style="light" />
        </Provider>
    );
}
