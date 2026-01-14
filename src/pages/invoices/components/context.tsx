import {createContext} from 'react';
import {InvoiceType} from '../types';

type InvoiceContextType = {
    refetchInvoices: () => void;
    invoice?: InvoiceType;
    invoiceID?: string | null;
    isPublic?: boolean;
};

export const InvoiceContext = createContext<InvoiceContextType>({
    refetchInvoices: () => {},
    invoiceID: null,
});
