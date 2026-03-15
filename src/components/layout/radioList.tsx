import {Colors} from '@constants/colors';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './text';
import {RadioButton} from './radioButton';
import {ButtonBase} from './buttonBase';

type PropsType = {
    label: string;
    options: {
        label: string;
        value: string;
    }[];
    value: string;
    handleChange: (value: string) => void;
    error?: string;
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    error: {
        fontSize: 14,
        color: Colors.red,
        marginTop: 8,
    },
    label: {
        marginBottom: 6,
        lineHeight: 24,
    },
    list: {
        gap: 7,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        height: 24,
        alignItems: 'center',
    },
});

export const RadioList: FC<PropsType> = ({label, options, value, handleChange, error}) => {
    return (
        <View style={styles.container}>
            <Text bold style={styles.label}>
                {label}
            </Text>
            <View style={styles.list}>
                {options.map(option => (
                    <ButtonBase
                        key={option.value}
                        style={styles.row}
                        onPress={() => handleChange(option.value)}
                    >
                        <RadioButton isChecked={value === option.value} />
                        <Text>{option.label}</Text>
                    </ButtonBase>
                ))}
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};
