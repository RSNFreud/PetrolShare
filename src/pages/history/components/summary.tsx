import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FC} from 'react';
import {FlatSession} from '../hooks/useFetchLogs';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {convertValue} from '@pages/invoices/libs/convertValue';
import {getUserData} from 'src/selectors/common';

type PropsType = {
    data?: FlatSession;
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        borderColor: Colors.border,
        borderWidth: 1,
        marginVertical: 20,
        backgroundColor: Colors.secondary,
    },
    header: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    data: {
        padding: 15,
        gap: 15,
    },
});

export const Summary: FC<PropsType> = ({data}) => {
    const {distance: distanceFormat} = useSelector(getUserData);

    if (!data?.logs) return null;

    const userData: {[key: string]: number} = data?.logs.reduce(
        (acc, log) => {
            return {
                ...acc,
                [log.fullName]: (acc[log.fullName] || 0) + log.distance || 0,
            };
        },
        {} as {[key: string]: number},
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>Summary</Text>
            </View>
            <View style={styles.data}>
                {Object.entries(userData).map(([name, distance]) => (
                    <Text key={name}>
                        <Text bold>{name}</Text>:{' '}
                        {convertValue(distance, 'distance', {distance: distanceFormat})}
                    </Text>
                ))}
            </View>
        </View>
    );
};
