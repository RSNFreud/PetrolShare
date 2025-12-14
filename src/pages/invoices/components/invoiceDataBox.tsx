import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {chunk} from 'remeda';
import {InvoiceType} from '../types';
import {convertValue, FormatType} from '../libs/convertValue';
import {Colors} from '@constants/colors';
import {Text} from '@components/layout/text';

type PropsType = {invoice: InvoiceType};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        borderColor: Colors.border,
        borderStyle: 'solid',
        borderWidth: 1,
        rowGap: 10,
    },
    label: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'light',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    item: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
});

const getData = (
    petrol: string | undefined,
): {label: string; value: keyof InvoiceType; format?: FormatType}[] => [
    {label: 'Invoiced By:', value: 'fullName'},
    {label: 'Invoice Data:', value: 'sessionEnd', format: 'date'},
    {label: 'Amount Paid:', value: 'totalPrice', format: 'currency'},
    {
        label: `Price Per ${petrol === 'liters' ? 'Liter' : 'Gallon'}:`,
        value: 'pricePerLiter',
        format: 'currency',
    },
    {label: 'Total Distance:', value: 'totalDistance', format: 'distance'},
];

export const InvoiceDataBox: FC<PropsType> = ({invoice}) => {
    const rows = chunk(getData(invoice.petrol), 2);
    return (
        <View style={styles.container}>
            {rows.map((row, index) => (
                <View key={index} style={styles.row}>
                    {row.map(({label, value, format}) => {
                        return (
                            <View key={label} style={styles.item}>
                                <Text style={styles.label}>{label}</Text>
                                <Text style={styles.value}>
                                    {convertValue(invoice?.[value], format, invoice)}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
