import Layout from '@components/layout';
import {useLocalSearchParams} from 'expo-router';
import {useEffect, useState} from 'react';

import Invoice from './invoices/invoice';

export default () => {
    const route = useLocalSearchParams();
    const [invoiceID, setInvoiceID] = useState('');

    useEffect(() => {
        const key = route['uniqueURL'] as string;
        if (key) setInvoiceID(key);
    }, [route]);

    if (!invoiceID) return <></>;

    return (
        <Layout noScrollView noBottomPadding>
            <Invoice invoiceID={invoiceID} isPublic />
        </Layout>
    );
};
