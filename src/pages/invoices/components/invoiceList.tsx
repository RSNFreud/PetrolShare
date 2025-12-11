import {FC} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useFetchInvoices} from '../hooks/useFetchInvoices';
import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {ButtonBase} from '@components/layout/buttonBase';

const styles = StyleSheet.create({
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    titleContainer: {
        paddingBottom: 15,
    },
    listContainer: {
        height: 48,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        borderColor: Colors.border,
        borderStyle: 'solid',
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderWidth: 1,
    },
    text: {
        fontSize: 14,
    },
    list: {
        gap: 10,
    },
    fullPageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 5,
    },
    noInvoiceText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

const getDate = (date: string) =>
    new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(Number(date)));

export const InvoiceList: FC = () => {
    const {isLoading, data} = useFetchInvoices();
    const {navigate} = useRouter();

    if (isLoading)
        return (
            <>
                <Breadcrumbs pages={[{label: 'Dashboard', href: '/'}, {label: 'Invoices'}]} />
                <View style={styles.fullPageContainer}>
                    <ActivityIndicator size="large" color={Colors.tertiary} />
                </View>
            </>
        );

    return (
        <>
            <Breadcrumbs pages={[{label: 'Dashboard', href: '/'}, {label: 'Invoices'}]} />
            {data?.length ? (
                <>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            Please choose a invoice from the list below:
                        </Text>
                    </View>
                    <ScrollView contentContainerStyle={styles.list}>
                        {data.map(({invoiceID, sessionEnd}) => (
                            <ButtonBase
                                key={invoiceID}
                                style={styles.listContainer}
                                onPress={() => navigate(`/invoices?id=${invoiceID}`)}
                            >
                                <Text style={styles.text} bold>
                                    Invoice #{invoiceID}
                                </Text>
                                <Text style={styles.text}>{getDate(sessionEnd)}</Text>
                            </ButtonBase>
                        ))}
                    </ScrollView>
                </>
            ) : (
                <View style={styles.fullPageContainer}>
                    <Text style={styles.noInvoiceText}>No invoices available.</Text>
                    <Text style={styles.noInvoiceText}>
                        Fill up with petrol to create your first one.
                    </Text>
                </View>
            )}
        </>
    );
};
