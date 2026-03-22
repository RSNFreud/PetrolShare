import {Text} from '@components/layout/text';
import {FC, ReactNode} from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        lineHeight: 24,
    },
});

type PropsType = {
    buttons?: ReactNode;
};

export const ConfirmLeave: FC<PropsType> = ({buttons}) => (
    <>
        <Text style={styles.title}>Are you sure you want to leave the group?</Text>
        <Text style={styles.text}>
            You are about to create a new group. If you are the last member in your current group,
            your data will be lost and cannot be restored. Please confirm to continue.
        </Text>
        {buttons}
    </>
);
