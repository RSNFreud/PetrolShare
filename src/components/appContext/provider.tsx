import React, {FC, useEffect, useState} from 'react';
import {AlertBoxType, AppContext, PopupType, initialState} from './context';

type PropsType = {
    children: React.ReactNode;
};

export const AppProvider: FC<PropsType> = ({children}) => {
    const [popupData, setPopupData] = useState<PopupType>(initialState.popupData);
    const [alertBoxData, setAlertBoxData] = useState<AlertBoxType>(initialState.alertBoxData);

    useEffect(() => {
        return () => {
            setPopupData(initialState.popupData);
        };
    }, []);

    return (
        <AppContext.Provider
            value={{
                popupData,
                setPopupData: data =>
                    setPopupData(originalValues => ({...originalValues, ...data})),
                alertBoxData,
                setAlertBoxData: data =>
                    setAlertBoxData(originalValues => ({...originalValues, ...data})),
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
