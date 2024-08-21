import {registerForPushNotificationsAsync} from '@components/sendNotification';
import {StoreData} from './context';
import {sendPostRequest} from './sendFetchRequest';

export const logIn = async (email: string, password: string) => {
    const res = await sendPostRequest(`user/login`, {
        emailAddress: email,
        password,
    });

    if (res) {
        if (res.ok && res.status === 200) {
            await registerForPushNotificationsAsync(email);
            return {valid: true, data: (await res.json()) as StoreData};
        } else return {valid: false, errors: await res.text()};
    } else
        return {
            valid: false,
            errors: 'We are having trouble connecting to our authentication servers. Please try again later...',
        };
};
