import React, {createContext} from 'react';

export type UserDataType = {
    emailAddress: string;
    fullName: string;
    authenticationKey: string;
    currentMileage: string;
    groupID: string;
    distance?: string;
    petrol?: string;
    currency?: string;
    premium?: number;
};

export type PopupType = {
    title: string;
    hasClose: boolean;
    content?: React.ReactNode;
    isVisible: boolean;
};

export type AlertBoxType = {
    title: string;
    isVisible: boolean;
    content: React.ReactNode;
    buttons: {text: string; onClick?: () => void; isError?: boolean}[];
};

type AppContextType = {
    popupData: PopupType;
    setPopupData: (data: {[K in keyof PopupType]?: PopupType[K]}) => void;
    alertBoxData: AlertBoxType;
    setAlertBoxData: (data: {[K in keyof AlertBoxType]?: AlertBoxType[K]}) => void;
};

export const initialState: AppContextType = {
    popupData: {
        isVisible: false,
        title: '',
        hasClose: true,
        content: <></>,
    },
    alertBoxData: {
        isVisible: false,
        content: '',
        title: '',
        buttons: [],
    },
    setPopupData: () => {},
    setAlertBoxData: () => {},
};

export const AppContext = createContext<AppContextType>(initialState);
