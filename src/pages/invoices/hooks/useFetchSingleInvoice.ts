import {useQuery} from '@tanstack/react-query';
import {InvoiceType} from '../types';
import {ENDPOINTS} from '@constants/endpoints';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export const useFetchSingleInvoice = (invoiceID: string | null, isPublic?: boolean) => {
    return useQuery({
        queryKey: ['invoices', invoiceID],
        queryFn: async () => {
            const res = await sendRequestToBackend({
                url: `${isPublic ? ENDPOINTS.GET_PUBLIC_INVOICES : ENDPOINTS.GET_INVOICES}/${invoiceID}`,
            });

            if (res?.ok) {
                return (await res.json()) as InvoiceType;
            }
        },
        enabled: Boolean(invoiceID),
        refetchOnMount: true,
    });
};
