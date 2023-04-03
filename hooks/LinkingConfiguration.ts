import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import { setItem } from '.'

const linking: any = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Login: 'login/:groupID?',
      Register: 'register',
      ManageDistance: 'manage-distance',
      AddPetrol: 'add-petrol',
      AddPreset: 'manage-distance/select-preset',
      Logs: 'logs',
      AddManual: 'manage-distance/manual',
      Invoices: 'invoices',
      ManageGroup: 'manage-group',
      Dashboard: 'dashboard/:groupID?',
      NotFound: '*/:groupID?',
      GPS: 'gps-tracking',
      DesktopScreen: '/',
    },
  },
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    let url = await Linking.getInitialURL()
    if (url != null) {
      return url
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync()
    url = response?.notification.request.content.data.url as string

    return url
  },
  subscribe(listener: (arg0: string) => void) {
    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data.url
        listener(url)
      },
    )

    return () => {
      // Clean up the event listeners
      linkingSubscription.remove();
      subscription.remove()
    }
  },
  getStateFromPath(path: string, config: {}) {
    if (path.includes('groupID=')) {
      let id = path.split('groupID=')[1].match(/\b\w*\b/)
      if (id) setItem('referalCode', id[0])
    }
  },
}

export default linking
