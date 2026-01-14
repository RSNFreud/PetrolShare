import {FC} from 'react';
import {ActivityIndicator, Share, StyleSheet, View} from 'react-native';
import {useSearchParams} from 'expo-router/build/hooks';
import {useFetchSingleInvoice} from '../hooks/useFetchSingleInvoice';
import {InvoiceLogs} from './invoiceLogs';
import {InvoiceDataBox} from './invoiceDataBox';
import {InvoiceContext} from './context';
import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Colors} from '@constants/colors';
import {Button} from '@components/layout/button';
import {Share as ShareIcon} from 'src/icons/share';
import {APP_ADDRESS} from '@constants/api-routes';

const styles = StyleSheet.create({
    fullPageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 5,
        position: 'relative',
    },
    floatingButton: {
        position: 'absolute',
        right: 0,
        bottom: 30,
        flexDirection: 'row',
        width: 120,
        borderRadius: 8,
        gap: 10,
    },
});

type PropsType = {isPublic?: boolean};

export const Invoice: FC<PropsType> = ({isPublic}) => {
    const invoiceID = useSearchParams().get('id');
    const {data, isLoading, refetch} = useFetchSingleInvoice(invoiceID, isPublic);

    return (
        <>
            {!isPublic && (
                <Breadcrumbs
                    pages={[
                        {label: 'Dashboard', href: '/'},
                        {label: 'Invoices', href: '/invoices'},
                        {label: `Invoice #${invoiceID}`},
                    ]}
                />
            )}
            {data && (
                <InvoiceContext.Provider
                    value={{refetchInvoices: refetch, invoice: data, invoiceID, isPublic}}
                >
                    <InvoiceDataBox />
                    <InvoiceLogs />
                    {!isPublic && (
                        <Button
                            onPress={() =>
                                Share.share({
                                    message: `I have filled up with petrol! Please see the following link to see how much you owe! ${APP_ADDRESS}payments/public/${data.uniqueURL}`,
                                    title: 'Share Petrol Invoice',
                                })
                            }
                            style={styles.floatingButton}
                            icon={<ShareIcon color={'white'} width={22} height={18} />}
                        >
                            Share
                        </Button>
                    )}
                </InvoiceContext.Provider>
            )}
            {(isLoading || !data) && (
                <View style={styles.fullPageContainer}>
                    <ActivityIndicator size="large" color={Colors.tertiary} />
                </View>
            )}
        </>
    );
};
