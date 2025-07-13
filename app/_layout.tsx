import {useFonts} from 'expo-font';
import {Slot, SplashScreen} from 'expo-router';
import {useState} from 'react';
import {ScrollView} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'expo-status-bar';
import {onlineManager, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import * as Network from 'expo-network';
import {Popup} from '@components/layout/popup';
import {persistor, store} from 'src/store';
import {AppProvider} from '@components/appContext/provider';
import {Alertbox} from '@components/layout/alertBox';

import {SplashScreen as SplashScreenComponent} from '@components/layout/splashScreen';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://9262fe64d3f987c3fdb7f20c0d506641@o4506003486277632.ingest.us.sentry.io/4506003538575360',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

onlineManager.setEventListener(setOnline => {
    const subscription = Network.addNetworkStateListener(state => {
        setOnline(state?.isConnected || false);
    });
    return () => subscription.remove();
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.hideAsync();

export default Sentry.wrap(function RootLayout() {
    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require('src/assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('src/assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('src/assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('src/assets/fonts/Roboto-Light.ttf'),
    });
    const [loading, setLoading] = useState(true);
    const queryClient = new QueryClient();

    if (!loading) {
        return null;
    }

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <PersistGate loading={null} persistor={persistor}></PersistGate>
                <AppProvider>
                    <SplashScreenComponent />
                    <ScrollView
                        style={{paddingHorizontal: 18}}
                        contentContainerStyle={{
                            paddingBottom: 18,
                            flex: 1,
                        }}
                        automaticallyAdjustKeyboardInsets={true}
                        keyboardShouldPersistTaps="always"
                    >
                        <Slot />
                    </ScrollView>
                    <Popup />
                    <Alertbox />
                </AppProvider>
                <StatusBar style="light" />
            </QueryClientProvider>
        </Provider>
    );
});