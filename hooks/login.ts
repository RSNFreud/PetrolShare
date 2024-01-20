import config from "config";
import { StoreData } from "./context";

export const logIn = async (email: string, password: string) => {
    const res = await fetch(`${config.REACT_APP_API_ADDRESS}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            emailAddress: email,
            password: password,
        }),
    });
    if (res && res.ok && res.status === 200) {
        return (await res.json()) as StoreData;
    } else return null;
};
