import {useContext, useState} from 'react';
import {POPUP_IDS} from '../constants';
import {ENDPOINTS} from '@constants/api-routes';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {ApplicationStoreType} from 'src/reducers';
import {updateData} from '@pages/login/reducers/auth';
import {PopupType} from '../page';
import {PopupContext} from 'src/popup/context';
import {Text} from '@components/layout/text';

const getAPIURL = (id: string) => {
    switch (id) {
        case POPUP_IDS.ODOMETER:
        case POPUP_IDS.SPECIFIC_DISTANCE:
            return ENDPOINTS.ADD_DISTANCE;

        default:
            break;
    }
};

export const useSubmitRequest = (setErrors: (data: {[key: string]: string}) => void) => {
    const [isLoading, setIsLoading] = useState(false);

    const {setPopupData} = useContext(PopupContext);
    const dispatch = useDispatch();
    const {authenticationKey, currentMileage, distance} = useSelector(
        (store: ApplicationStoreType) => ({
            authenticationKey: store.auth.authenticationKey,
            currentMileage: store.auth.currentMileage,
            distance: store.auth.distance,
        }),
        shallowEqual,
    );

    const showSuccessPopup = (text: string) => {
        setPopupData({content: <Text style={{lineHeight: 24}}>{text}</Text>});
    };

    const handleSubmit = async (values: {[key: string]: string}, data: PopupType) => {
        const {id} = data;
        const url = getAPIURL(id);
        let parsedData: {[key: string]: string} = {authenticationKey};
        if (!url) return;
        setIsLoading(true);

        switch (id) {
            case POPUP_IDS.ODOMETER:
                const distance = Number(values.odemeterEnd) - Number(values.odemeterStart);
                if (distance <= 0) {
                    setErrors({
                        odemeterEnd: 'Please enter a distance above 0!',
                    });
                    return;
                }
                parsedData.distance = String(distance);
                break;
            case POPUP_IDS.SPECIFIC_DISTANCE:
                parsedData.distance = values?.distance;
            default:
                break;
        }

        const res = await sendPostRequest(url, parsedData);

        if (res?.ok) {
            setTimeout(() => setIsLoading(false), 300);
            dispatch(updateData());

            let successText = data.successText;

            if (id === POPUP_IDS.ODOMETER || id === POPUP_IDS.SPECIFIC_DISTANCE) {
                successText = successText
                    .replace(/\$distance/, `${parsedData.distance} ${distance}`)
                    .replace(
                        /\$total_distance/,
                        `${Number(currentMileage) + Number(parsedData.distance)} ${distance}`,
                    );
            }
            showSuccessPopup(successText);
        }
    };

    return {handleSubmit, isLoading};
};
