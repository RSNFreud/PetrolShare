/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications';

const linking: any = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      ManageDistance: 'manage-distance',
      AddPetrol: 'add-petrol',
      AddPreset: 'manage-distance/select-preset',
      Logs: 'logs',
      AddManual: 'manage-distance/manual',
      Invoices: 'invoices',
      Dashboard: 'dashboard',
      NotFound: '*',
      GPS: 'gps-tracking',
      DesktopScreen: '/',
    },
  }, async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    let url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    url = response?.notification.request.content.data.url as string;

    return url;
  }, subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    };
  },
}

export default linking
