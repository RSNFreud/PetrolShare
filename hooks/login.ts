import { API_ADDRESS } from "@constants";

import { StoreData } from "./context";

export const logIn = async (email: string, password: string) => {
  const res = await fetch(`${API_ADDRESS}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailAddress: email,
      password,
    }),
  });
  if (res && res.ok && res.status === 200) {
    return ({ valid: true, data: await res.json() as StoreData });
  } else return { valid: false, errors: await res.text() };
};
