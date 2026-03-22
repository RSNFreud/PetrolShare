import {FC, useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import z from 'zod';
import {convertValue, InvoiceGroupDataType} from '../libs/convertValue';
import {DataType} from './invoiceLogs';
import {Input} from '@components/layout/input';
import {Dropdown} from '@components/layout/dropdown/dropdown';
import {getUserData} from 'src/selectors/common';
import {useMemberRequest} from 'src/hooks/useMemberRequest';
import {Button} from '@components/layout/button';
import {MISSING_VALUE, defaultValues} from '@constants/common';
import {commonValidation} from 'src/utils/validation';
import {DataType as FormDataType, validate} from 'src/hooks/common';
import {ENDPOINTS} from '@constants/endpoints';
import {AppContext} from '@components/appContext/context';
import {Text} from '@components/layout/text';
import {useValidationRequest} from 'src/hooks/useValidationRequest';

type PropsType = {
    data: DataType;
    groupData: InvoiceGroupDataType;
    invoiceID?: string | null;
    refetchInvoices: () => void;
};

const styles = StyleSheet.create({
    container: {
        gap: 15,
        marginBottom: 20,
    },
});

export const AssignDistance: FC<PropsType> = ({data, invoiceID, groupData, refetchInvoices}) => {
    const {userID} = useSelector(getUserData);
    const {setPopupData} = useContext(AppContext);
    const members = useMemberRequest(userID, true);
    const {sendRequest, isLoading} = useValidationRequest();

    const [formData, setData] = useState<FormDataType>({
        user: defaultValues,
        distance: defaultValues,
    });

    const validation = z.object({
        user: commonValidation,
        distance: z.coerce
            .number({error: 'Please enter a valid number'})
            .min(0.1, 'Please enter a valid number above 0')
            .max(data.distance, 'Please enter a value less than or equal to the maximum distance')
            .nonnegative(MISSING_VALUE),
    });

    const handleSubmit = async () => {
        const isValid = validate(validation, formData, setData);

        if (!isValid) {
            return;
        }
        const res = await sendRequest(ENDPOINTS.ASSIGN_INVOICE_DISTANCE, {
            invoiceID,
            userID: formData.user.value,
            distance: formData.distance.value,
        });

        if (res?.ok) {
            const name = members?.find(member => member.value === formData.user.value)?.label || '';
            setPopupData({
                title: 'Distance Added',
                content: (
                    <Text>
                        {convertValue(formData.distance.value, 'distance', groupData)} has been
                        successfully added to {name}!
                    </Text>
                ),
            });
            refetchInvoices();
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Input
                    label="Distance to Apply:"
                    placeholder={`Enter Amount (Max: ${data?.distance})`}
                    keyboardType="numeric"
                    value={formData.distance.value}
                    error={formData.distance.error}
                    onChangeText={value =>
                        setData(oldState => ({...oldState, distance: {value, error: ''}}))
                    }
                />
                <Dropdown
                    label="User:"
                    placeholder="Choose a user"
                    value={formData.user.value}
                    onChangeText={value =>
                        setData(oldState => ({...oldState, user: {value, error: ''}}))
                    }
                    items={members}
                />
            </View>
            <Button loading={isLoading} onPress={handleSubmit}>
                Assign Distance
            </Button>
        </>
    );
};
