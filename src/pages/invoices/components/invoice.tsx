import {FC} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useSearchParams} from 'expo-router/build/hooks';
import {useFetchSingleInvoice} from '../hooks/useFetchSingleInvoice';
import {InvoiceDataBox} from './invoiceDataBox';
import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Colors} from '@constants/colors';

const styles = StyleSheet.create({
    fullPageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 5,
    },
});

export const Invoice: FC = () => {
    const invoiceID = useSearchParams().get('id');
    const {data, isLoading} = useFetchSingleInvoice(invoiceID);

    return (
        <>
            <Breadcrumbs
                pages={[
                    {label: 'Dashboard', href: '/'},
                    {label: 'Invoices', href: '/invoices'},
                    {label: `Invoice #${invoiceID}`},
                ]}
            />
            {data && (
                <>
                    <InvoiceDataBox invoice={data} />
                </>
            )}
            {isLoading && (
                <View style={styles.fullPageContainer}>
                    <ActivityIndicator size="large" color={Colors.tertiary} />
                </View>
            )}
        </>
    );
};
