const REACT_APP_ADDRESS = 'https://petrolshare.freud-online.co.uk/';

const REACT_API_ADDRESS = `https://petrolshare.freud-online.co.uk/api`;
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const DEV_ADDRESS = 'http://10.0.2.2:3434/api';

export default {
    REACT_APP_ADDRESS,
    REACT_APP_EMAIL_API_ADDRESS: `https://petrolshare.freud-online.co.uk/email`,
};

export const postValues = {method: 'POST', headers: {'Content-Type': 'application/json'}};

export const postHeaders = postValues;

export const APP_ADDRESS = REACT_APP_ADDRESS;
export const EMAIL_ADRESS = `https://petrolshare.freud-online.co.uk/email`;
