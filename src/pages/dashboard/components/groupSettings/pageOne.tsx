import {FC} from 'react';

import {CommonPropsType} from 'src/types/common';
import {StyleSheet, View} from 'react-native';
import {DescriptionBox} from '@components/layout/descriptionBox';
import {RadioList} from '@components/layout/radioList';

const styles = StyleSheet.create({
    radioContainer: {
        gap: 25,
        marginBottom: 25,
    },
});

const OPTIONS = [
    {
        label: 'Which format do you want distance to be\ndisplayed in?',
        value: 'distance' as const,
        options: [
            {label: 'Kilometers', value: 'km'},
            {label: 'Miles', value: 'miles'},
        ],
    },
    {
        label: 'Which format do you want petrol to be\ndisplayed in?',
        value: 'petrol' as const,
        options: [
            {label: 'Gallons', value: 'gallons'},
            {label: 'Liters', value: 'liters'},
        ],
    },
];

export const GroupPageOne: FC<CommonPropsType & {isCreating?: boolean}> = ({
    isCreating,
    data,
    setData,
}) => {
    return (
        <>
            {isCreating && (
                <DescriptionBox content="To finish creating your group, please fill out the following options." />
            )}
            <View style={[styles.radioContainer, {marginTop: isCreating ? 20 : 0}]}>
                {OPTIONS.map(option => (
                    <RadioList
                        key={option.value}
                        options={option.options}
                        label={option.label}
                        value={data?.[option.value].value}
                        error={data?.[option.value].error}
                        handleChange={value =>
                            setData({...data, [option.value]: {value, error: ''}})
                        }
                    />
                ))}
            </View>
        </>
    );
};
