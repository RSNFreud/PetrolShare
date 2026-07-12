import {createContext, FC, ReactNode, useState} from 'react';

type PropsType = {
    pages: ReactNode[];
    children?: ReactNode;
};

type PageContextType = {
    page: number;
    setPage: (page: number) => void;
};

export const PageContext = createContext<PageContextType>({
    page: 0,
    setPage: (page: number) => {},
});

export const PageManager: FC<PropsType> = ({pages, children}) => {
    const [page, setPage] = useState(0);

    return (
        <PageContext.Provider value={{page, setPage}}>
            {pages[page]}
            {children}
        </PageContext.Provider>
    );
};
