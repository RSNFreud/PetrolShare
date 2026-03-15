import {FC, ReactNode, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, StyleSheet, View} from 'react-native';
import {FlatSession, LogType} from '../hooks/useFetchLogs';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {convertValue} from '@pages/invoices/libs/convertValue';
import {getUserData} from 'src/selectors/common';
import {ButtonBase} from '@components/layout/buttonBase';
import {Pencil} from 'src/icons/pencil';
import {Delete} from 'src/icons/delete';
import {AppContext} from '@components/appContext/context';
import {EditInvoice} from './editLog';
import {DeletePopup} from '@components/deletePopup';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/endpoints';
import {updateData} from '@pages/login/reducers/auth';

type PropsType = {
    data?: FlatSession;
    isEditable: boolean;
    refetch: () => void;
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

export const HistoryData: FC<PropsType> = ({data, isEditable, refetch}) => {
    const {distance, userID} = useSelector(getUserData);
    const {setPopupData} = useContext(AppContext);
    const dispatch = useDispatch();

    const Button = ({
        children,
        isDisabled,
        onPress,
    }: {
        children: ReactNode;
        isDisabled: boolean;
        onPress?: () => void;
    }) => (
        <ButtonBase
            disabled={isDisabled}
            style={[{opacity: isDisabled ? 0.5 : 1}, styles.button]}
            onPress={onPress}
        >
            {children}
        </ButtonBase>
    );

    const handleRefetch = () => {
        refetch();
        dispatch(updateData());
    };

    const handleEdit = (log: LogType) => {
        setPopupData({
            content: <EditInvoice log={log} onUpdate={handleRefetch} />,
            isVisible: true,
            title: 'Edit Distance',
        });
    };

    const deleteLog = async (logID: string) => {
        const res = await sendPostRequest(ENDPOINTS.DELETE_LOG, {logID});
        if (res?.ok) {
            setPopupData({
                content: (
                    <Text style={{lineHeight: 24}}>
                        The log has been successfully deleted and all associated records have been
                        removed.
                    </Text>
                ),
            });
            handleRefetch();
        }
    };

    const handleDelete = (log: LogType) => {
        setPopupData({
            content: (
                <DeletePopup
                    title="Are you sure you want to delete this log?"
                    content="Once deleted, the log will be permanently removed and cannot be recovered."
                    onDelete={() => deleteLog(log.logID)}
                />
            ),
            title: 'Delete Log',
            isVisible: true,
        });
    };

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
                            <Button
                                isDisabled={log.userID !== String(userID)}
                                onPress={() => handleEdit(log)}
                            >
                                <Pencil width={12} height={12} color={'white'} />
                                <Text bold style={styles.smText}>
                                    Edit
                                </Text>
                            </Button>
                            <View style={styles.verticalLine} />
                            <Button
                                isDisabled={log.userID !== String(userID)}
                                onPress={() => handleDelete(log)}
                            >
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
