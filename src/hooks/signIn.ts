import {sendCustomEvent} from './common';
import {registerForPushNotificationsAsync} from './notifications';
import {sendPostRequest} from './sendRequestToBackend';

type PropsType = {
    emailAddress: string;
    password: string;
    onSuccess: () => void;
};

export const signIn = async ({emailAddress, password, onSuccess}: PropsType) => {
    const res = await sendPostRequest(`user/login`, {
        emailAddress,
        password,
    });

    if (res) {
        if (res.ok && res.status === 200) {
            await registerForPushNotificationsAsync(emailAddress);
            sendCustomEvent('openSplash');
            setTimeout(() => {
                sendCustomEvent('closeSplash');
            }, 500);
        }
    } else
        return {
            valid: false,
            errors: 'We are having trouble connecting to our authentication servers. Please try again later...',
        };
};
