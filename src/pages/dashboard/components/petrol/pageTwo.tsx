import {Input} from '@components/layout/input';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {CommonPropsType} from 'src/types/common';

const INPUTS = [
    {
        label: 'Current Odometer',
        placeholder: 'Enter the current odometer value',
        id: 'currentOdometer',
    },
];

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    inputContainer: {
        gap: 15,
    },
});

export const PetrolPageTwo: FC<CommonPropsType> = ({data, setData}) => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                {INPUTS.map(input => (
                    <Input
                        key={input.id}
                        {...input}
                        value={data[input.id]?.value}
                        onChangeText={text =>
                            setData({...data, [input.id]: {error: '', value: text}})
                        }
                        keyboardType="number-pad"
                        error={data[input.id]?.error}
                    />
                ))}
            </View>
        </View>
    );
};
