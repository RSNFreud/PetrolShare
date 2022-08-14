/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: any = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      Settings: 'settings',
      AddDistance: 'add-distance',
      Dashboard: '',
      NotFound: '*',
    },
  },
};

export default linking;
