import {Colors} from '@constants/colors';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';

type PropsType = {
    isChecked?: boolean;
};

const styles = StyleSheet.create({
    container: {
        width: 15,
        height: 15,
        borderRadius: 100,
        backgroundColor: Colors.primary,
        borderColor: Colors.border,
        borderWidth: 1,
        padding: 3,
    },
    check: {
        backgroundColor: Colors.tertiary,
        flex: 1,
        borderRadius: 100,
    },
});

export const RadioButton: FC<PropsType> = ({isChecked}) => {
    return <View style={styles.container}>{isChecked && <View style={styles.check} />}</View>;
};
