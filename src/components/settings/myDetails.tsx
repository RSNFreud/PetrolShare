import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {defaultValues, MISSING_VALUE} from '@constants/common';
import {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {DataType, returnValuesFromObject, validate} from 'src/hooks/common';
import {commonValidation} from 'src/utils/validation';
import z, {set} from 'zod';
import {Settings} from './settings';
import {useValidationRequest} from 'src/hooks/useValidationRequest';
import {ENDPOINTS} from '@constants/endpoints';
import {useDispatch, useSelector} from 'react-redux';
import {updateData} from '@pages/login/reducers/auth';
import {getUserData} from 'src/selectors/common';
import {Text} from '@components/layout/text';
import {PageContext} from '@components/layout/pageManager';
import {SETTINGS} from './constants';

const INPUTS = [
    {
        key: 'fullName',
        label: 'Name',
        placeholder: 'Enter your name',
    },
    {
        key: 'emailAddress',
        label: 'Email',
        placeholder: 'Enter your email',
    },
] as const;

const styles = StyleSheet.create({
    input: {
        gap: 15,
    },
    buttons: {
        gap: 10,
        marginTop: 25,
    },
});

const validation = z.object({
    fullName: commonValidation,
    emailAddress: z.email('Please enter a valid email!').min(1, MISSING_VALUE).trim(),
});

export const MyDetails = () => {
    const {setPage} = useContext(PageContext);
    const {setPopupData} = useContext(AppContext);
    const userData = useSelector(getUserData);
    const {sendRequest, isLoading} = useValidationRequest();
    const [data, setData] = useState<DataType>({
        fullName: defaultValues,
        emailAddress: defaultValues,
    });

    useEffect(() => {
        setData({
            fullName: {value: userData?.fullName || '', error: ''},
            emailAddress: {value: userData?.emailAddress || '', error: ''},
        });
    }, [userData]);

    const dispatch = useDispatch();

    const handleSave = async () => {
        const isValid = validate(validation, data, setData);
        if (!isValid) return;

        const parsedData = returnValuesFromObject(data);

        const res = await sendRequest(ENDPOINTS.CHANGE_DETAILS, parsedData);

        if (!res?.ok) return;

        setPopupData({content: <Text>Your details have been updated successfully!</Text>});

        dispatch(updateData());
    };

    return (
        <>
            <View style={styles.input}>
                {INPUTS.map(input => (
                    <Input
                        key={input.key}
                        value={data?.[input.key].value}
                        error={data?.[input.key].error}
                        label={input.label}
                        placeholder={input.placeholder}
                        onChangeText={text =>
                            setData(prev => ({
                                ...prev,
                                [input.key]: {error: '', value: text},
                            }))
                        }
                    />
                ))}
            </View>
            <View style={styles.buttons}>
                <Button loading={isLoading} onPress={handleSave}>
                    Save
                </Button>
                <Button
                    variant="ghost"
                    onPress={() => {
                        setPage(SETTINGS.DEFAULT);
                        setPopupData({title: 'Settings'});
                    }}
                >
                    Back
                </Button>
            </View>
        </>
    );
};
