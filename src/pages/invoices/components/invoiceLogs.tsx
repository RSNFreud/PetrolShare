import {FC} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, StyleSheet, View} from 'react-native';
import {convertValue, InvoiceGroupDataType} from '../libs/convertValue';
import {Colors} from '@constants/colors';
import {Text} from '@components/layout/text';
import {getUserData} from 'src/selectors/common';

type PropsType = {
    invoiceData: string;
    invoiceGroupData: InvoiceGroupDataType;
};

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
    wrapper: {
        marginVertical: 20,
    },
});

type DataType = {
    distance: number;
    emailAddress: string;
    fullName: string;
    liters: string;
    paid: boolean;
    userID: string;
    paymentDue: number;
};

const Log = ({data, groupData}: {data: DataType; groupData: InvoiceGroupDataType}) => {
    return (
        <View style={styles.box}>
            <View style={styles.boxContent}>
                <View style={styles.flex}>
                    <Text style={styles.text} bold>
                        {convertValue(data.paymentDue, 'currency', groupData)}
                    </Text>
                    <Text style={styles.text}>
                        {convertValue(data.liters, 'petrol', groupData)}
                    </Text>
                </View>
                <Text style={styles.text}>
                    {data.fullName} ({convertValue(data.distance, 'distance', groupData)})
                </Text>
            </View>
        </View>
    );
};

export const InvoiceLogs: FC<PropsType> = ({invoiceData, invoiceGroupData}) => {
    const parsedData = JSON.parse(invoiceData) as DataType[];

    const {userID} = useSelector(getUserData);

    const currentUserData = parsedData.find(data => parseInt(data.userID) === parseInt(userID));

    return (
        <ScrollView style={styles.wrapper}>
            {currentUserData && <Log data={currentUserData} groupData={invoiceGroupData} />}
        </ScrollView>
    );
};
