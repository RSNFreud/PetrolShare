const REACT_APP_ADDRESS = 'https://petrolshare.freud-online.co.uk/';
// eslint-disable-next-line no-unused-vars
const REACT_API_ADDRESS = `https://petrolshare.freud-online.co.uk/api`;
const DEV_ADDRESS = 'http://10.0.2.2:3434/api';

export default {
    REACT_APP_ADDRESS,
    REACT_APP_API_ADDRESS: REACT_API_ADDRESS,
    REACT_APP_EMAIL_API_ADDRESS: `https://petrolshare.freud-online.co.uk/email`,
};

export const postValues = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

export const postHeaders = postValues;

export const API_ADDRESS = REACT_API_ADDRESS;
export const APP_ADDRESS = REACT_APP_ADDRESS;
export const EMAIL_ADRESS = `https://petrolshare.freud-online.co.uk/email`;
