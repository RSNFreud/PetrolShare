import {useContext, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {GetMemberType, POPUP_IDS} from '../constants';
import {PopupType} from '../page';
import {setOdometerData} from '../reducers/odometer';
import {OdometerAlert} from './odometerAlert';
import {ENDPOINTS} from '@constants/endpoints';
import {sendPostRequest, sendRequestToBackend} from 'src/hooks/sendRequestToBackend';
import {ApplicationStoreType} from 'src/reducers';
import {updateData} from '@pages/login/reducers/auth';
import {Text} from '@components/layout/text';
import {FormValues} from '@constants/common';
import {AppContext} from '@components/appContext/context';
import {returnErrorObject, returnValuesFromObject} from 'src/hooks/common';

const getAPIURL = (id: string) => {
    switch (id) {
        case POPUP_IDS.ODOMETER:
        case POPUP_IDS.SPECIFIC_DISTANCE:
            return ENDPOINTS.ADD_DISTANCE;
        case POPUP_IDS.ASSIGN_DISTANCE:
            return ENDPOINTS.ASSIGN_DISTANCE;
        default:
            break;
    }
};

const getUsername = async (userID: string) => {
    try {
        const res = await sendRequestToBackend({url: ENDPOINTS.GET_MEMBERS});
        if (res?.ok) {
            const data = (await res.json()) as GetMemberType;

            return data.find(data => String(data.userID) === String(userID))?.fullName || '';
        }
        return '';
    } catch {
        return '';
    }
};

export const useSubmitRequest = (
    setErrors: (data: {[key: string]: string}) => void,
    setData: (key: string, value: string) => void,
    id: string,
    formData: {[key: string]: FormValues},
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const {setPopupData, setAlertBoxData} = useContext(AppContext);
    const dispatch = useDispatch();
    const {currentMileage, distance, initialOdometer, hasShownAlert} = useSelector(
        (store: ApplicationStoreType) => ({
            currentMileage: store.auth.currentMileage,
            distance: store.auth.distance,
            initialOdometer: store.odometer.odometerStart,
            hasShownAlert: store.odometer.recoverMessageShown,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (
            id !== POPUP_IDS.ODOMETER ||
            !initialOdometer ||
            Number(formData?.odemeterStart?.value) > 0
        )
            return;
        setData('odemeterStart', String(initialOdometer));
        if (hasShownAlert) return;
        setAlertBoxData({
            isVisible: true,
            content: <OdometerAlert isChecked={isChecked} setIsChecked={handleCheckbox} />,
            title: 'Distance recovered!',
            buttons: [{text: 'OK', onClick: closeOdometerAlert}],
        });
    }, [id, formData?.odemeterStart, hasShownAlert, isChecked]);

    useEffect(() => {
        setAlertBoxData({
            content: <OdometerAlert isChecked={isChecked} setIsChecked={handleCheckbox} />,
        });
    }, [isChecked]);

    const handleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    const closeOdometerAlert = () => {
        dispatch(setOdometerData({recoverMessageShown: isChecked}));
        setAlertBoxData({isVisible: false});
    };

    const showSuccessPopup = (text: string) => {
        setPopupData({content: <Text style={{lineHeight: 24}}>{text}</Text>});
    };

    const handleOdometerDraft = (data: PopupType) => {
        const odometerStart = formData['odemeterStart']?.value;
        if (!odometerStart) return;

        dispatch(setOdometerData({odometerStart: Number(formData?.odemeterStart.value)}));
        showSuccessPopup(
            'Your odometer reading has been saved. You can access it anytime by clicking the "Record Odometer" button.',
        );
    };
    const handleValidate = (
        data: PopupType,
        setData: (data: {[key: string]: {value: string}}) => void,
    ) => {
        if (!data.validation) return;
        const values = returnValuesFromObject(formData);
        const validate = data.validation.safeParse(values);

        const errors = validate.error?.format();

        setData(returnErrorObject(formData, errors));
        if (data.id === POPUP_IDS.ODOMETER && !formData['odemeterEnd']?.value) {
            return handleOdometerDraft(data);
        }
        if (validate.success) handleSubmit(values, data);
    };

    const handleSubmit = async (values: {[key: string]: string}, data: PopupType) => {
        const {id} = data;
        const url = getAPIURL(id);
        let parsedData: {[key: string]: string} = {};
        if (!url) return;
        setIsLoading(true);

        switch (id) {
            case POPUP_IDS.ODOMETER:
                const distance = Number(values.odemeterEnd) - Number(values.odemeterStart);
                if (distance <= 0) {
                    setErrors({odemeterEnd: 'Please enter a distance above 0!'});
                    return;
                }
                parsedData.distance = String(distance);
                break;
            case POPUP_IDS.SPECIFIC_DISTANCE:
                parsedData.distance = values?.distance;
                break;
            case POPUP_IDS.ASSIGN_DISTANCE:
                parsedData.distance = values?.totalDistance;
                parsedData.userID = values?.username;
                break;
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
            if (id === POPUP_IDS.ASSIGN_DISTANCE) {
                successText = successText
                    .replace(/\$distance/, `${parsedData.distance} ${distance}`)
                    .replace(/\$username/, await getUsername(values?.username));
            }
            showSuccessPopup(successText);
        }
    };

    return {isLoading, handleValidate};
};
