import {Input} from '@components/layout/input';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {CommonPropsType} from 'src/types/common';
import {ErrorBox} from '@components/layout/errorBox';
import {DescriptionBox} from '@components/layout/descriptionBox';

const INPUTS = [
    {
        label: 'Liters Filled',
        placeholder: 'Enter amount of liters filled',
        id: 'litersFilled',
    },
    {
        label: 'Total Cost',
        placeholder: 'Enter total cost of refueling',
        id: 'totalCost',
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

export const PetrolPageOne: FC<CommonPropsType & {isValid?: boolean}> = ({
    data,
    setData,
    isValid,
}) => {
    return (
        <View style={styles.container}>
            <DescriptionBox content="Fill out the form below in order to create a payment log based on the distance tracked during your current session." />
            <View style={styles.inputContainer}>
                {INPUTS.map(input => (
                    <Input
                        key={input.id}
                        {...input}
                        value={data[input.id].value}
                        onChangeText={text =>
                            setData({...data, [input.id]: {error: '', value: text}})
                        }
                        keyboardType="number-pad"
                        error={data[input.id]?.error}
                    />
                ))}
            </View>
            {!isValid && (
                <ErrorBox content="You have no distance tracked in your session for us to generate a payment for." />
            )}
        </View>
    );
};
