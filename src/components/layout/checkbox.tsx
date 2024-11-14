import React, {FC} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from './text';
import {Colors} from '@constants/colors';
import {Tick} from 'src/icons/tick';

type PropsType = {
    isChecked?: boolean;
    label: string;
    handleChange: () => void;
};

const styles = StyleSheet.create({
    checkbox: {
        height: 20,
        width: 20,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: Colors.border,
        backgroundColor: Colors.primary,
        borderWidth: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    icon: {
        color: 'white',
        width: 10,
    },
});

export const Checkbox: FC<PropsType> = ({isChecked, label, handleChange}) => {
    return (
        <TouchableWithoutFeedback onPress={handleChange}>
            <View style={styles.container}>
                <View style={styles.checkbox}>
                    {isChecked && <Tick style={styles.icon} width={14} height={14} />}
                </View>
                <Text>{label}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};
