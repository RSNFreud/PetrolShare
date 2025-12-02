import {Slot} from 'expo-router';
import {Platform} from 'react-native';
import NotFoundScreen from 'screens/NotFoundScreen';

export default () => {
    if (Platform.OS === 'web') return <NotFoundScreen />;

    return <Slot />;
};
