import {FC, useContext} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Log} from './log';
import {InvoiceContext} from './context';
import {Colors} from '@constants/colors';
import {getUserData} from 'src/selectors/common';

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
    },
    horizontalLine: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 20,
    },
    logs: {
        gap: 10,
    },
});

export type DataType = {
    distance: number;
    emailAddress: string;
    fullName: string;
    liters: string;
    paid: boolean;
    userID: string;
    paymentDue: number;
};

export const InvoiceLogs: FC = () => {
    const {invoice} = useContext(InvoiceContext);
    const parsedData = JSON.parse(invoice?.invoiceData || '') as DataType[];

    const {userID} = useSelector(getUserData);

    const currentUserData = parsedData.find(data => parseInt(data.userID) === parseInt(userID));

    return (
        <ScrollView style={styles.wrapper}>
            {currentUserData && (
                <>
                    <Log data={currentUserData} isCurrentUser />
                    <View style={styles.horizontalLine} />
                </>
            )}
            <View style={styles.logs}>
                {parsedData
                    .filter(data => parseInt(data.userID) !== parseInt(userID))
                    .map(data => (
                        <Log key={data.userID} data={data} />
                    ))}
            </View>
        </ScrollView>
    );
};
