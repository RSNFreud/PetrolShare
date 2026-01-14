import {StyleSheet, View} from 'react-native';
import {useState, ReactNode, ComponentProps, useContext} from 'react';
import {convertValue, InvoiceGroupDataType} from '../libs/convertValue';
import {InvoiceContext} from './context';
import {AssignDistance} from './assignDistance';
import {DataType} from './invoiceLogs';
import {ButtonBase} from '@components/layout/buttonBase';
import {ENDPOINTS} from '@constants/endpoints';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {Bell} from 'src/icons/bell';
import {Road} from 'src/icons/road';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {AppContext} from '@components/appContext/context';

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
    box: {
        backgroundColor: Colors.primary,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 4,
        gap: 5,
    },
    boxContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 5,
    },
    flex: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 12,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    buttonText: {
        fontSize: 14,
        lineHeight: 14,
    },
});

export const Log = ({data, isCurrentUser}: {data: DataType; isCurrentUser?: boolean}) => {
    const [isPressed, setIsPressed] = useState(false);
    const {invoice, invoiceID, refetchInvoices} = useContext(InvoiceContext);
    const {setPopupData} = useContext(AppContext);
    const {children, props} = ((): {
        children: ReactNode;
        props: ComponentProps<typeof ButtonBase>;
    } => {
        if (data.fullName === 'Unaccounted Distance')
            return {
                children: (
                    <>
                        <Road color={'white'} height={14} width={14} />
                        <Text style={styles.buttonText} bold>
                            Assign Distance
                        </Text>
                    </>
                ),
                props: {
                    onPress: () => {
                        setPopupData({
                            isVisible: true,
                            title: 'Assign Distance',
                            content: (
                                <AssignDistance
                                    data={data}
                                    invoiceID={invoiceID}
                                    groupData={invoice as InvoiceGroupDataType}
                                    refetchInvoices={refetchInvoices}
                                />
                            ),
                        });
                    },
                },
            };
        return {
            children: (
                <>
                    <Bell color={'white'} width={13} height={14} />
                    <Text style={styles.buttonText} bold>
                        {isPressed ? 'Reminder Sent' : 'Send Reminder'}
                    </Text>
                </>
            ),
            props: {
                disabled: isPressed,
                onPress: () => {
                    setIsPressed(true);
                    sendPostRequest(ENDPOINTS.SEND_REMINDER, {
                        userID: data.userID,
                        invoiceID,
                    });
                    setTimeout(() => {
                        setIsPressed(false);
                    }, 1000);
                },
            },
        };
    })();

    return (
        <View style={styles.box}>
            <View style={styles.boxContent}>
                <View style={styles.flex}>
                    <Text style={styles.text} bold>
                        {convertValue(data.paymentDue, 'currency', invoice)}
                    </Text>
                    <Text style={styles.text}>{convertValue(data.liters, 'petrol', invoice)}</Text>
                </View>
                <Text style={styles.text}>
                    {data.fullName} ({convertValue(data.distance, 'distance', invoice)})
                </Text>
            </View>
            {!isCurrentUser && (
                <>
                    <ButtonBase style={styles.button} {...props}>
                        {children}
                    </ButtonBase>
                </>
            )}
        </View>
    );
};
