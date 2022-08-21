/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

const linking: any = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      Settings: 'settings',
      AddDistance: 'manage-distance',
      Logs: 'logs',
      AddManual: 'manage-distance/manual',
      Dashboard: '',
      NotFound: '*',
    },
  },
};

export default linking;
