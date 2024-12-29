import React, {createRef, useRef, useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {z} from 'zod';
import {PresetType} from '../types';
import {Input} from '@components/layout/input';
import {FormValues, defaultValues} from '@constants/common';
import {Button} from '@components/layout/button';
import {commonValidation, stringToNumberValidation} from 'src/utils/validation';

type PropsType = {
    presetData?: PresetType;
};

const styles = StyleSheet.create({
    container: {gap: 15, marginBottom: 20},
});

const validation = z.object({
    presetName: commonValidation,
    presetDistance: stringToNumberValidation,
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
        id: 'presetDistance',
    },
];

export const PresetPopup: React.FC<PropsType> = ({presetData}) => {
    const [data, setData] = useState<{presetName: FormValues; presetDistance: FormValues}>({
        presetName: presetData ? {...defaultValues, value: presetData.presetName} : defaultValues,
        presetDistance: presetData
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

    const handleSubmit = () => {
        const result = validation.safeParse(
            Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.value])),
        );

        if (!result.success) {
            const error = result.error.flatten();

            setData({
                presetName: {
                    value: data.presetName.value,
                    error: error.fieldErrors.presetName?.[0] || '',
                },
                presetDistance: {
                    value: data.presetDistance.value,
                    error: error.fieldErrors.presetDistance?.[0] || '',
                },
            });
            return;
        }
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
                        value={data[id as 'presetName' | 'presetDistance'].value}
                        error={data[id as 'presetName' | 'presetDistance'].error}
                        onChangeText={text =>
                            setData(prevData => ({...prevData, [id]: {value: text}}))
                        }
                        onSubmitEditing={() => handleKeyboardSubmit(index)}
                        submitBehavior="submit"
                    />
                ))}
            </View>
            <Button onPress={handleSubmit}>{presetData ? 'Edit Preset' : 'Save Preset'}</Button>
        </>
    );
};
