import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {sendPostRequest} from 'hooks/sendFetchRequest';
import {Platform} from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export const schedulePushNotification = async (title?: string, body?: string) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: {route: 'invoices', invoiceID: 417},
        },
        trigger: {seconds: 2},
    });
};

export const registerForPushNotificationsAsync = async (emailAddress: string) => {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            vibrationPattern: [0, 250, 250, 250],
            importance: Notifications.AndroidImportance.MAX,
        });
    }
    if (Platform.OS === 'web') return;
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            // alert("Failed to get push token for push notification!");
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
    } else {
        // alert("Must use physical device for Push Notifications");
    }

    return token;
};

export const deregisterForPushNotifications = async (emailAddress: string) => {
    await sendPostRequest('notify/deregister', {
        emailAddress,
    });
};
