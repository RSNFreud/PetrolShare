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

type PopupContextType = {
    popupData: PopupType;
    setPopupData: (data: {[K in keyof PopupType]?: PopupType[K]}) => void;
};

export const initialState: PopupContextType = {
    popupData: {
        isVisible: false,
        title: '',
        hasClose: true,
        content: <></>,
    },
    setPopupData: () => {},
};

export const PopupContext = createContext<PopupContextType>(initialState);
