import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {Input} from '@components/layout/input';
import {defaultValues} from '@constants/common';
import {ENDPOINTS} from '@constants/endpoints';
import {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {DataType, returnValuesFromObject, validate} from 'src/hooks/common';
import {useValidationRequest} from 'src/hooks/useValidationRequest';
import {commonValidation} from 'src/utils/validation';
import z from 'zod';
import {ErrorBox} from '@components/layout/errorBox';
import {ConfirmLeave} from './confirmLeave';
import {GroupInformation} from './groupInformation';
import {ReturnToMenu} from './returnToMenu';

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    groupInput: {
        gap: 10,
    },
    buttonContainer: {
        gap: 10,
        marginTop: 30,
    },
});

const validation = z.object({
    groupID: commonValidation,
});

export const JoinGroup = () => {
    const {isLoading, sendRequest} = useValidationRequest();
    const [data, setData] = useState<DataType>({groupID: defaultValues});

    const [validationError, setValidationError] = useState('');
    const {setPopupData, isNewUser} = useContext(AppContext);

    const handleJoinGroup = async () => {
        const parsedData = returnValuesFromObject(data);
        const res = await sendRequest(ENDPOINTS.JOIN_GROUP, parsedData);
        if (!res?.ok) return;

        setPopupData({content: <GroupInformation groupID={parsedData.groupID} />});
    };

    const JoinGroup = () => (
        <Button loading={isLoading} onPress={handleSubmit}>
            Join Group
        </Button>
    );

    const Buttons = () => (
        <View style={styles.buttonContainer}>
            <Button onPress={handleJoinGroup} loading={isLoading}>
                Join Group
            </Button>
            <Button
                variant="ghost"
                onPress={() => {
                    setPopupData({isVisible: false});
                }}
            >
                Cancel
            </Button>
        </View>
    );

    const handleSubmit = async () => {
        const isValid = validate(validation, data, setData);

        if (!isValid) return;
        const parsedData = returnValuesFromObject(data);
        const res = await sendRequest(ENDPOINTS.VALIDATE_GROUP, parsedData);

        if (res?.ok) {
            setValidationError('');
            setPopupData({content: <ConfirmLeave buttons={<Buttons />} />});
        } else {
            const message = await res?.text();
            setValidationError(String(message));
        }
    };

    useEffect(() => {
        if (!isNewUser) return;

        setPopupData({
            stickyButton: (
                <>
                    <JoinGroup />
                    <ReturnToMenu />
                </>
            ),
        });
    }, [isNewUser, isLoading, data]);

    return (
        <View style={styles.container}>
            <View style={styles.groupInput}>
                <Input
                    label="Group ID:"
                    placeholder="Enter new group ID"
                    value={data.groupID.value}
                    error={data.groupID.error}
                    onChangeText={value => setData({groupID: {error: '', value}})}
                />
                {validationError && <ErrorBox content={validationError} />}
            </View>
            {!isNewUser && <JoinGroup />}
        </View>
    );
};
