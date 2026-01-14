import {FC, useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import z, {ZodFormattedError} from 'zod';
import {convertValue, InvoiceGroupDataType} from '../libs/convertValue';
import {DataType} from './invoiceLogs';
import {Input} from '@components/layout/input';
import {Dropdown} from '@components/layout/dropdown/dropdown';
import {getUserData} from 'src/selectors/common';
import {useMemberRequest} from 'src/hooks/useMemberRequest';
import {Button} from '@components/layout/button';
import {FormValues, MISSING_VALUE, defaultValues} from '@constants/common';
import {commonValidation} from 'src/utils/validation';
import {returnErrorObject, returnValuesFromObject} from 'src/hooks/common';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/endpoints';
import {AppContext} from '@components/appContext/context';
import {Text} from '@components/layout/text';

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
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setData] = useState<{user: FormValues; distance: FormValues}>({
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
        const values = returnValuesFromObject(formData);
        const result = validation.safeParse(values);

        if (!result.success) {
            const errors = result.error?.format() as ZodFormattedError<
                {
                    [x: string]: any;
                },
                string
            >;

            setData(returnErrorObject(formData, errors) as typeof formData);
            return;
        }
        setIsLoading(true);
        const res = await sendPostRequest(ENDPOINTS.ASSIGN_INVOICE_DISTANCE, {
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
        setIsLoading(false);
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
