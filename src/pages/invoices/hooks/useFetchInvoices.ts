import {useQuery} from '@tanstack/react-query';
import {InvoiceListType} from '../types';
import {ENDPOINTS} from '@constants/endpoints';
import {sendRequestToBackend} from 'src/hooks/sendRequestToBackend';

export const useFetchInvoices = () => {
    return useQuery({
        queryKey: ['invoices'],
        queryFn: async () => {
            const res = await sendRequestToBackend({url: ENDPOINTS.GET_INVOICES});
            if (res?.ok) {
                return (await res.json()) as InvoiceListType;
            }
        },
        refetchOnMount: true,
    });
};
