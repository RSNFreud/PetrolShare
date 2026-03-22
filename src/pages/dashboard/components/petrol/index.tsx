import {AppContext} from '@components/appContext/context';
import {useContext, useEffect, useState} from 'react';
import {PetrolPageOne} from './pageOne';
import {defaultValues, FormValues} from '@constants/common';
import {Button} from '@components/layout/button';
import z from 'zod';
import {stringToNumberValidation} from 'src/utils/validation';
import {validate, DataType, returnValuesFromObject} from 'src/hooks/common';
import {FormState, useCheckForValidity} from './useCheckForValidity';
import {PetrolPageTwo} from './pageTwo';
import {useValidationRequest} from 'src/hooks/useValidationRequest';
import {ENDPOINTS} from '@constants/endpoints';
import {useRouter} from 'expo-router';
import {useDispatch} from 'react-redux';
import {updateData} from '@pages/login/reducers/auth';

const screenOneValidation = z.object({
    totalCost: stringToNumberValidation,
    litersFilled: stringToNumberValidation,
});

const fullValidation = z.object({
    totalCost: stringToNumberValidation,
    litersFilled: stringToNumberValidation,
    currentOdometer: stringToNumberValidation,
});

export const Petrol = () => {
    const {setPopupData} = useContext(AppContext);
    const [page, setPage] = useState(0);
    const [data, setData] = useState<DataType>({
        totalCost: defaultValues,
        litersFilled: defaultValues,
        currentOdometer: defaultValues,
    });

    const validStatus = useCheckForValidity();
    const {sendRequest, isLoading: isRequestLoading} = useValidationRequest();
    const {navigate} = useRouter();
    const dispatch = useDispatch();

    const submit = async () => {
        const isValid = validate(fullValidation, data, setData);
        if (!isValid) return;

        const dataParsed = returnValuesFromObject(data);

        const res = await sendRequest(ENDPOINTS.ADD_PETROL, {
            totalPrice: dataParsed.totalCost,
            litersFilled: dataParsed.litersFilled,
            odometer: dataParsed.currentOdometer,
        });

        if (!res?.ok) {
            return;
        }

        const petrolData = await res.json();
        setPopupData({isVisible: false});
        dispatch(updateData());
        navigate(`/invoices?id=${petrolData}`);
    };

    const getButtons = () => {
        switch (page) {
            case 1:
                return (
                    <>
                        <Button onPress={submit} loading={isRequestLoading}>
                            Add Petrol
                        </Button>
                        <Button onPress={() => setPage(0)} variant="ghost">
                            Back
                        </Button>
                    </>
                );
            default:
                return (
                    <Button
                        onPress={onContinueClick}
                        disabled={validStatus === FormState.INVALID}
                        loading={validStatus === FormState.LOADING}
                    >
                        Continue
                    </Button>
                );
        }
    };

    const onContinueClick = () => {
        const isValid = validate(screenOneValidation, data, setData);
        if (!isValid) return;
        setPopupData({
            stickyButton: getButtons(),
        });
        setPage(1);
    };

    useEffect(() => {
        setPopupData({
            stickyButton: getButtons(),
            minContentHeight: 454,
        });
    }, [data, page, validStatus, isRequestLoading]);

    const handleInput = (data: {[key: string]: FormValues}) => {
        setData(prevData => ({...prevData, ...data}));
    };

    const renderComponent = () => {
        switch (page) {
            case 1:
                return <PetrolPageTwo data={data} setData={handleInput} />;
            default:
                return (
                    <PetrolPageOne
                        data={data}
                        isValid={validStatus === FormState.VALID}
                        setData={handleInput}
                    />
                );
        }
    };

    return <>{renderComponent()}</>;
};
