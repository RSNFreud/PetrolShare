import {DescriptionBox} from '@components/layout/descriptionBox';
import {RadioList} from '@components/layout/radioList';
import {defaultValues} from '@constants/common';
import {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useCurrencies} from '../hooks/useCurrencies';
import {Dropdown} from '@components/layout/dropdown/dropdown';
import {Button} from '@components/layout/button';
import z from 'zod';
import {commonValidation} from 'src/utils/validation';
import {returnValuesFromObject, returnErrorObject} from 'src/hooks/common';

type PropsType = {
    isCreating?: boolean;
};

const styles = StyleSheet.create({
    radioContainer: {
        marginTop: 20,
        gap: 25,
    },
    buttons: {
        gap: 10,
        marginTop: 30,
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

const validation = z.object({
    distance: commonValidation,
    petrol: commonValidation,
    currency: commonValidation,
});

export const GroupSettings: FC<PropsType> = ({isCreating}) => {
    const [data, setData] = useState({
        distance: defaultValues,
        petrol: defaultValues,
        currency: defaultValues,
    });
    const {data: dropdownData} = useCurrencies();

    const getItems = () => {
        if (!dropdownData) return [];
        return Object.entries(dropdownData).map(([key, value]) => ({
            label: `${value.name} (${value.symbol})`,
            value: key,
            key: key,
        }));
    };

    const handleSubmit = () => {
        const values = returnValuesFromObject(data);
        const result = validation.safeParse(values);

        if (!result.success) {
            const {properties: errors} = z.treeifyError(result.error);
            setData(returnErrorObject(data, errors) as typeof data);
            return;
        }
    };

    return (
        <>
            {isCreating && (
                <DescriptionBox content="To finish creating your group, please fill out the following options." />
            )}
            <View style={styles.radioContainer}>
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
                <Dropdown
                    hasSearchBar
                    label="Which currency format are you using?"
                    placeholder="Choose a currency"
                    items={getItems()}
                    onChangeText={value => setData({...data, currency: {value, error: ''}})}
                    value={data.currency.value}
                    error={data.currency.error}
                />
            </View>
            <View style={styles.buttons}>
                <Button onPress={() => handleSubmit()}>Create Group</Button>
                {isCreating && <Button variant="ghost">Cancel</Button>}
            </View>
        </>
    );
};
