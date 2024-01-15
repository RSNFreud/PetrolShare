import React from "react";
import { createContext } from "react";

export type StoreData = {
    emailAddress: string,
    fullName: string,
    authenticationKey: string,
    currentMileage: string,
    groupID: string
}

export type AuthContextType = {
    signIn: (e: { emailAddress: string, password: string }) => Promise<StoreData | unknown>
    setData: (e: StoreData) => void
    register: (e: { emailAddress: string, password: string }) => void
    retrieveData: StoreData
    isLoading: boolean
    isLoggedIn: boolean
    isPremium: boolean
    setPremiumStatus: (e: boolean) => void
    signOut: () => void
}

export const AuthContext = createContext<Partial<AuthContextType>>({});

export const useSession = () => {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}