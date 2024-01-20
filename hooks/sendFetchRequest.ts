import { postHeaders } from "@constants";

export const sendPostRequest = async (url: string, body: object) => {
  try {
    return await fetch(url, {
      ...postHeaders,
      body: JSON.stringify(body),
    });
  } catch {}
};
