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
    signOut: () => void
}

export const AuthContext = createContext<Partial<AuthContextType>>({});