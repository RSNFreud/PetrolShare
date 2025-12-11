export type InvoiceListType = {
    invoiceID: number;
    sessionEnd: string;
}[];

export type InvoiceType = {
    emailAddress: string;
    fullName: string;
    invoiceData: string;
    sessionEnd: string;
    totalPrice: string;
    totalDistance: string;
    pricePerLiter: number;
    uniqueURL: string;
    currency: string;
    distance: string;
    petrol: string;
};
