import {EventRegister} from 'react-native-event-listeners';

export const sendCustomEvent = (event: string, data?: any) => {
    EventRegister.emit(event, data);
};
