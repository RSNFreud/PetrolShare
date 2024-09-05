import React, {FC, useEffect, useState} from 'react';
import {PopupContext, PopupType, initialState} from './context';

type PropsType = {
    children: React.ReactNode;
};

export const PopupProvider: FC<PropsType> = ({children}) => {
    const [popupData, setPopupData] = useState<PopupType>(initialState.popupData);

    useEffect(() => {
        return () => {
            setPopupData(initialState.popupData);
        };
    }, []);

    return (
        <PopupContext.Provider
            value={{
                popupData,
                setPopupData: data =>
                    setPopupData(originalValues => ({...originalValues, ...data})),
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};
