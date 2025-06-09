import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';
import {sendPostRequest} from './sendRequestToBackend';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowList: true,
        shouldShowBanner: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export const registerForPushNotificationsAsync = async (emailAddress: string) => {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            vibrationPattern: [0, 250, 250, 250],
            importance: Notifications.AndroidImportance.MAX,
        });
    }
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } catch {}

        if (!token) return;

        await sendPostRequest('notify/register', {
            emailAddress,
            notificationKey: token,
        });
    }
    return token;
};
