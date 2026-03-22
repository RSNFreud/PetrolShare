import {Input} from '@components/layout/input';
import {LogType} from '../hooks/useFetchLogs';
import {FC, useContext, useState} from 'react';
import {Button} from '@components/layout/button';
import {StyleSheet, View} from 'react-native';
import {defaultValues} from '@constants/common';
import z from 'zod';
import {commonValidation} from 'src/utils/validation';
import {ENDPOINTS} from '@constants/endpoints';
import {AppContext} from '@components/appContext/context';
import {convertValue} from '@pages/invoices/libs/convertValue';
import {useSelector} from 'react-redux';
import {getUserData} from 'src/selectors/common';
import {Text} from '@components/layout/text';
import {DataType, validate} from 'src/hooks/common';
import {useValidationRequest} from 'src/hooks/useValidationRequest';

type PropsType = {
    log: LogType;
    onUpdate: () => void;
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
});

const validation = z.object({
    distance: commonValidation,
});

export const EditInvoice: FC<PropsType> = ({log, onUpdate}) => {
    const [data, setData] = useState<DataType>({
        distance: defaultValues,
    });
    const {setPopupData} = useContext(AppContext);
    const {distance} = useSelector(getUserData);
    const {isLoading, sendRequest} = useValidationRequest();

    const updateDistance = async () => {
        const isValid = validate(validation, data, setData);

        if (!isValid) {
            return;
        }
        const res = await sendRequest(ENDPOINTS.EDIT_LOG, {
            logID: log.logID,
            distance: data.distance.value,
        });
        if (res?.ok) {
            setPopupData({
                content: (
                    <Text style={{lineHeight: 24}}>
                        The distance has successfully been updated from{' '}
                        {convertValue(log.distance, 'distance', {distance})} to{' '}
                        {convertValue(data.distance.value, 'distance', {distance})}!
                    </Text>
                ),
            });

            onUpdate();
        }
    };

    return (
        <View style={styles.container}>
            <Input
                placeholder="Enter new distance"
                label="Distance:"
                value={data.distance.value}
                onChangeText={text => setData({...data, distance: {...data.distance, value: text}})}
                error={data.distance.error}
            />
            <Button loading={isLoading} onPress={updateDistance}>
                Update Distance
            </Button>
        </View>
    );
};
