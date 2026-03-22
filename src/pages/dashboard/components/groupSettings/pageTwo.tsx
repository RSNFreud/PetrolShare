import {FC} from 'react';
import {Dropdown} from '@components/layout/dropdown/dropdown';

import {useCurrencies} from '@pages/dashboard/hooks/useCurrencies';
import {CommonPropsType} from 'src/types/common';
import {View} from 'react-native';

export const GroupPageTwo: FC<CommonPropsType> = ({data, setData}) => {
    const {data: dropdownData} = useCurrencies();

    const getItems = () => {
        if (!dropdownData) return [];
        return Object.entries(dropdownData).map(([key, value]) => ({
            label: `${value.name} (${value.symbol})`,
            value: key,
            key: key,
        }));
    };

    return (
        <View style={{gap: 20}}>
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
    );
};
