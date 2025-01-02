import React, {createRef, useContext, useRef, useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {z, ZodFormattedError} from 'zod';
import {PresetType} from '../types';
import {Input} from '@components/layout/input';
import {FormValues, defaultValues} from '@constants/common';
import {Button} from '@components/layout/button';
import {commonValidation, stringToNumberValidation} from 'src/utils/validation';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/endpoints';
import {AppContext} from '@components/appContext/context';
import {Text} from '@components/layout/text';
import {returnErrorObject, returnValuesFromObject} from 'src/hooks/common';

type PropsType = {
    presetData?: PresetType;
    fetchPresets: () => void;
};

const styles = StyleSheet.create({
    container: {gap: 15, marginBottom: 20},
});

const validation = z.object({
    presetName: commonValidation,
    distance: stringToNumberValidation,
});

const formOptions = [
    {
        label: 'Preset Name:',
        placeholder: 'Enter name',
        id: 'presetName',
    },
    {
        label: 'Preset Distance:',
        placeholder: 'Enter distance',
        id: 'distance',
    },
];

export const PresetPopup: React.FC<PropsType> = ({presetData, fetchPresets}) => {
    const {setPopupData} = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{presetName: FormValues; distance: FormValues}>({
        presetName: presetData ? {...defaultValues, value: presetData.presetName} : defaultValues,
        distance: presetData
            ? {...defaultValues, value: String(presetData.distance)}
            : defaultValues,
    });

    const inputRefs = useRef(formOptions?.map(() => createRef<TextInput>()));

    const handleKeyboardSubmit = (index: number) => {
        const nextEl = inputRefs?.current?.[index + 1];
        if (nextEl) {
            return nextEl.current?.focus();
        }
        handleSubmit();
    };

    const handleSubmit = async () => {
        const values = returnValuesFromObject(data);
        const result = validation.safeParse(values);

        if (!result.success) {
            const errors = result.error?.format() as ZodFormattedError<
                {
                    [x: string]: any;
                },
                string
            >;

            setData(returnErrorObject(data, errors) as typeof data);
            return;
        }
        setIsLoading(true);

        const isEdit = presetData?.presetID;

        const res = await sendPostRequest(isEdit ? ENDPOINTS.EDIT_PRESET : ENDPOINTS.ADD_PRESET, {
            ...presetData,
            presetName: data.presetName.value,
            distance: data.distance.value,
        });
        setIsLoading(false);
        if (!res?.ok) return;
        setPopupData({
            content: (
                <Text style={{lineHeight: 26}}>
                    {isEdit ? (
                        <>
                            Preset updated successfully! The distance has been saved and is now
                            ready to be used. You can update the preset again by clicking the pencil
                            icon next to it.
                        </>
                    ) : (
                        <>
                            Preset added successfully! The distance has been saved and is now ready
                            to be used. You can update the preset by clicking the pencil icon next
                            to it.
                        </>
                    )}
                </Text>
            ),
        });
        fetchPresets();
    };

    return (
        <>
            <View style={styles.container}>
                {formOptions.map(({label, placeholder, id}, index) => (
                    <Input
                        key={id}
                        label={label}
                        innerRef={inputRefs?.current?.[index]}
                        placeholder={placeholder}
                        value={data[id as 'presetName' | 'distance'].value}
                        error={data[id as 'presetName' | 'distance'].error}
                        onChangeText={text =>
                            setData(prevData => ({...prevData, [id]: {value: text}}))
                        }
                        onSubmitEditing={() => handleKeyboardSubmit(index)}
                        submitBehavior="submit"
                    />
                ))}
            </View>
            <Button onPress={handleSubmit} loading={isLoading}>
                {presetData ? 'Edit Preset' : 'Save Preset'}
            </Button>
        </>
    );
};
