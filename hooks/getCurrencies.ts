import {setItem} from 'hooks';

type CurrencyType = {
    currencies: {
        [code: string]: {
            name: string;
            symbol: string;
        };
    };
};

export const getAllCurrencies = async () => {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=currencies');

    const cleanList: {
        [code: string]: {
            name: string;
            symbol: string;
        };
    } = {};
    if (!res.ok) return cleanList;

    const data: CurrencyType[] = await res.json();
    data.map(e => {
        Object.keys(e.currencies).map(key => {
            const q = e.currencies[key];
            cleanList[key] = {...q};
        });
    });
    return cleanList;
};

export const convertCurrency = async (code: string) => {
    const data: string | null | object = await getAllCurrencies();

    let cleanList: any = {};
    if (typeof data === 'string' || !data) return;
    Object.entries(data).map(([key, data]) => {
        if (key === code) cleanList = {...data};
    });

    if (
        (cleanList.name.includes('dollar') && code !== 'USD') ||
        (cleanList.name.includes('pound') && code !== 'GBP')
    ) {
        setItem('currencySymbol', code.toString());
        return `${code}`;
    }
    setItem('currencySymbol', cleanList.symbol);
    return cleanList.symbol;
};
