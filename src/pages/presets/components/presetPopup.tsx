import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {PresetType} from '../types';
import {Input} from '@components/layout/input';
import {FormValues, defaultValues} from '@constants/common';
import {Button} from '@components/layout/button';

type PropsType = {
    presetData?: PresetType;
};

const styles = StyleSheet.create({
    container: {gap: 15, marginBottom: 20},
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

    return (
        <>
            <View style={styles.container}>
                {formOptions.map(({label, placeholder, id}) => (
                    <Input
                        key={id}
                        label={label}
                        placeholder={placeholder}
                        value={data[id as 'presetName' | 'presetDistance'].value}
                        onChangeText={text =>
                            setData(prevData => ({...prevData, [id]: {value: text}}))
                        }
                    />
                ))}
            </View>
            <Button>{presetData ? 'Edit Preset' : 'Save Preset'}</Button>
        </>
    );
};
