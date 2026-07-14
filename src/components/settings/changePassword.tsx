import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {DescriptionBox} from '@components/layout/descriptionBox';
import {Input} from '@components/layout/input';
import {PageContext} from '@components/layout/pageManager';
import {Colors} from '@constants/colors';
import {defaultValues} from '@constants/common';
import {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SETTINGS} from './constants';
import {useValidationRequest} from 'src/hooks/useValidationRequest';
import z from 'zod';
import {commonValidation} from 'src/utils/validation';
import {DataType, returnValuesFromObject, validate} from 'src/hooks/common';
import {ENDPOINTS} from '@constants/endpoints';
import {logOut} from '@pages/login/reducers/auth';
import {useDispatch} from 'react-redux';
import {Text} from '@components/layout/text';

const styles = StyleSheet.create({
    seperator: {
        height: 1,
        backgroundColor: Colors.border,
        width: '100%',
    },
    container: {
        gap: 25,
    },
    form: {
        gap: 15,
    },
    buttons: {
        gap: 10,
    },
});

const validation = z
    .object({
        password: commonValidation,
        confirmPassword: commonValidation,
        currentPassword: commonValidation,
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Please make sure the passwords match!',
        path: ['confirmPassword'],
    });

export const ChangePassword = () => {
    const dispatch = useDispatch();
    const {setPopupData, setAlertBoxData} = useContext(AppContext);
    const {sendRequest, isLoading} = useValidationRequest();
    const {setPage} = useContext(PageContext);
    const [data, setData] = useState<DataType>({
        currentPassword: defaultValues,
        password: defaultValues,
        confirmPassword: defaultValues,
    });

    const handleSave = async () => {
        const isValid = validate(validation, data, setData);
        if (!isValid) return;

        const parsedData = returnValuesFromObject(data);

        const res = await sendRequest(ENDPOINTS.CHANGE_PASSWORD, parsedData);

        if (!res?.ok) {
            const err = await res?.text();
            setData(prev => ({
                ...prev,
                currentPassword: {
                    error: err,
                    value: prev.currentPassword.value,
                },
            }));
            return;
        }
        dispatch(logOut());
        setAlertBoxData({
            isVisible: true,
            title: 'Password Changed',
            content: <Text>Your password has been changed successfully.</Text>,
            buttons: [
                {
                    text: 'OK',
                },
            ],
        });
        setPopupData({isVisible: false});
    };

    return (
        <View style={styles.container}>
            <DescriptionBox
                content="Changing your password will log you out of all active sessions, requiring you to log
                in again with the new password to restore access."
            />
            <View style={styles.form}>
                <Input
                    label="Current Password"
                    placeholder="Enter your current password"
                    value={data?.currentPassword.value}
                    secureTextEntry
                    error={data?.currentPassword.error}
                    onChangeText={text =>
                        setData(prev => ({
                            ...prev,
                            currentPassword: {error: '', value: text},
                        }))
                    }
                />
                <View style={styles.seperator} />
                <Input
                    value={data?.password.value}
                    secureTextEntry
                    error={data?.password.error}
                    onChangeText={text =>
                        setData(prev => ({
                            ...prev,
                            password: {error: '', value: text},
                        }))
                    }
                    label="New Password"
                    placeholder="Enter your new password"
                />
                <Input
                    secureTextEntry
                    value={data?.confirmPassword.value}
                    error={data?.confirmPassword.error}
                    onChangeText={text =>
                        setData(prev => ({
                            ...prev,
                            confirmPassword: {error: '', value: text},
                        }))
                    }
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                />
            </View>
            <View style={styles.buttons}>
                <Button onPress={handleSave} loading={isLoading}>
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
        </View>
    );
};
