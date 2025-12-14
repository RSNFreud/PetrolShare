export type FormatType = 'date' | 'currency' | 'distance' | 'petrol';
export type InvoiceGroupDataType = {currency: string; distance: string; petrol: string};

export const convertValue = (
    value: string | number,
    format?: FormatType,
    invoiceData?: InvoiceGroupDataType,
) => {
    if (!value) return;
    switch (format) {
        case 'date':
            return new Intl.DateTimeFormat('en-GB', {}).format(new Date(Number(value)));
        case 'currency':
            return `${Number(value).toLocaleString('en-US', {
                style: 'currency',
                currency: invoiceData?.currency,
            })}`;
        case 'distance':
            return `${value} ${invoiceData?.distance}`;
        case 'petrol':
            return `${value} ${invoiceData?.petrol === 'liters' ? 'liters' : 'gallons'}`;
        default:
            return value;
    }
};
