import {useQuery, UseQueryResult} from '@tanstack/react-query';

type CurrencyType = {
    currencies: {
        [code: string]: {
            name: string;
            symbol: string;
        };
    };
};

export const useCurrencies = (): UseQueryResult<{
    [code: string]: {
        name: string;
        symbol: string;
    };
}> =>
    useQuery({
        queryKey: ['currencies'],
        queryFn: async () => {
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
        },
    });
