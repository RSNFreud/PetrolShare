import {createContext} from 'react';

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

type RootContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    popupData: PopupType;
    userData: UserDataType;
    setUserData: (data: {[K in keyof UserDataType]?: UserDataType[K]}) => void;
    setPopupData: (data: {[K in keyof PopupType]?: PopupType[K]}) => void;
};

export const initialState: RootContextType = {
    isLoggedIn: false,
    popupData: {
        isVisible: false,
        title: '',
        hasClose: true,
        content: <></>,
    },
    userData: {
        emailAddress: '',
        fullName: '',
        authenticationKey: '',
        currentMileage: '',
        groupID: '',
    },
    setPopupData: () => {},
    setUserData: () => {},
    setIsLoggedIn: () => {},
};

export const RootContext = createContext<RootContextType>(initialState);
