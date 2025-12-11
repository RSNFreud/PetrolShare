import {useSearchParams} from 'expo-router/build/hooks';
import {InvoiceList} from './components/invoiceList';
import {Invoice} from './components/invoice';

export const Invoices = () => {
    const isInvoice = useSearchParams().get('id');

    if (isInvoice) return <Invoice />;

    return <InvoiceList />;
};
