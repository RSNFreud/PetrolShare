import {FC, ReactNode} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, StyleSheet, View} from 'react-native';
import {FlatSession} from '../hooks/useFetchLogs';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {convertValue} from '@pages/invoices/libs/convertValue';
import {getUserData} from 'src/selectors/common';
import {ButtonBase} from '@components/layout/buttonBase';
import {Pencil} from 'src/icons/pencil';
import {Delete} from 'src/icons/delete';

type PropsType = {
    data?: FlatSession;
    isEditable: boolean;
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    item: {
        borderRadius: 4,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    data: {
        padding: 15,
        gap: 10,
        backgroundColor: Colors.primary,
    },
    smText: {
        fontSize: 14,
    },
    flex: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    buttonContainer: {
        backgroundColor: Colors.secondary,
        paddingVertical: 5,
        height: 44,
        alignContent: 'center',
        gap: 15,
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 10,
        gap: 10,
    },
    verticalLine: {
        width: 1,
        backgroundColor: Colors.border,
    },
});

export const HistoryData: FC<PropsType> = ({data, isEditable}) => {
    const {distance, userID} = useSelector(getUserData);

    const Button = ({children, isDisabled}: {children: ReactNode; isDisabled: boolean}) => (
        <ButtonBase disabled={isDisabled} style={[{opacity: isDisabled ? 0.5 : 1}, styles.button]}>
            {children}
        </ButtonBase>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {data?.logs.map(log => (
                <View key={log.logID} style={[{opacity: log.pending ? 0.5 : 1}, styles.item]}>
                    <View style={styles.data}>
                        <View style={styles.flex}>
                            <Text style={styles.smText}>
                                {new Date(Number(log.date)).toLocaleDateString()}
                            </Text>
                            {log.pending && (
                                <Text style={[{color: Colors.red}, styles.smText]}>PENDING</Text>
                            )}
                        </View>
                        <View style={styles.flex}>
                            <Text bold>{log.fullName}</Text>
                            <Text>{convertValue(log.distance, 'distance', {distance})}</Text>
                        </View>
                    </View>
                    {isEditable && (
                        <View style={styles.buttonContainer}>
                            <Button isDisabled={log.userID !== String(userID)}>
                                <Pencil width={12} height={12} color={'white'} />
                                <Text bold style={styles.smText}>
                                    Edit
                                </Text>
                            </Button>
                            <View style={styles.verticalLine} />
                            <Button isDisabled={log.userID !== String(userID)}>
                                <Delete width={11} height={12} color={'white'} />
                                <Text bold style={[{color: Colors.red}, styles.smText]}>
                                    Delete
                                </Text>
                            </Button>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};
