import {SplashScreen as SplashScreenComponent} from '@components/layout/splashScreen';
import {useFonts} from 'expo-font';
import {Slot, SplashScreen} from 'expo-router';
import {useState} from 'react';
import {View} from 'react-native';
import {Provider} from 'react-redux';
import {Popup} from '@components/layout/popup';
import {store} from 'src/store';
import {PopupProvider} from 'src/popup/provider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require('src/assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('src/assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('src/assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('src/assets/fonts/Roboto-Light.ttf'),
    });
    const [loading, setLoading] = useState(true);

    SplashScreen.hideAsync();

    if (!loading) {
        return null;
    }

    return (
        <Provider store={store}>
            <PopupProvider>
                <View style={{paddingHorizontal: 18}}>
                    {/* <SplashScreenComponent /> */}
                    <Slot />
                    <Popup />
                </View>
            </PopupProvider>
        </Provider>
    );
}
