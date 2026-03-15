import {Input} from '@components/layout/input';
import {LogType} from '../hooks/useFetchLogs';
import {FC, useContext, useState} from 'react';
import {Button} from '@components/layout/button';
import {StyleSheet, View} from 'react-native';
import {defaultValues} from '@constants/common';
import z, {set} from 'zod';
import {commonValidation} from 'src/utils/validation';
import {returnErrorObject, returnValuesFromObject} from 'src/hooks/common';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/endpoints';
import {AppContext} from '@components/appContext/context';
import {convertValue} from '@pages/invoices/libs/convertValue';
import {useSelector} from 'react-redux';
import {getUserData} from 'src/selectors/common';
import {Text} from '@components/layout/text';

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
    const [data, setData] = useState({
        distance: defaultValues,
    });
    const {setPopupData} = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const {distance} = useSelector(getUserData);

    const updateDistance = async () => {
        const values = returnValuesFromObject(data);
        const result = validation.safeParse(values);

        if (!result.success) {
            const {properties: errors} = z.treeifyError(result.error);

            setData(returnErrorObject(data, errors) as typeof data);
            return;
        }
        setIsLoading(true);
        const res = await sendPostRequest(ENDPOINTS.EDIT_LOG, {
            logID: log.logID,
            distance: data.distance.value,
        });
        setIsLoading(false);
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
