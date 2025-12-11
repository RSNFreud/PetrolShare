import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {chunk} from 'remeda';
import {InvoiceType} from '../types';
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

type FormatType = 'date' | 'currency' | 'distance';

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

export const InvoiceData: FC<PropsType> = ({invoice}) => {
    const convertValue = (value: string | number, format?: FormatType) => {
        switch (format) {
            case 'date':
                return new Intl.DateTimeFormat('en-GB', {}).format(new Date(Number(value)));
            case 'currency':
                return `${Number(value).toLocaleString('en-US', {
                    style: 'currency',
                    currency: invoice.currency,
                })}`;
            case 'distance':
                return `${value} ${invoice.distance}`;
            default:
                return value;
        }
    };
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
                                    {convertValue(invoice?.[value], format)}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
