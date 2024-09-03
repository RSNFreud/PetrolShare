import {FC, useEffect, useState} from 'react';
import {PopupType, RootContext, UserDataType, initialState} from 'src/context/rootContext';

type PropsType = {
    children: React.ReactNode;
};

export const RootProvider: FC<PropsType> = ({children}) => {
    const [popupData, setPopupData] = useState<PopupType>(initialState.popupData);
    const [userData, setUserData] = useState<UserDataType>(initialState.userData);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialState.isLoggedIn);

    useEffect(() => {
        return () => {
            setPopupData(initialState.popupData);
        };
    }, []);

    return (
        <RootContext.Provider
            value={{
                ...initialState,
                userData,
                setUserData: data => setUserData(originalValues => ({...originalValues, ...data})),
                popupData,
                isLoggedIn,
                setIsLoggedIn: setIsLoggedIn,
                setPopupData: data =>
                    setPopupData(originalValues => ({...originalValues, ...data})),
            }}
        >
            {children}
        </RootContext.Provider>
    );
};
