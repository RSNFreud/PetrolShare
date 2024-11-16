export const MISSING_VALUE = 'Please fill out this required field';

export type FormValues = {
    error?: string;
    value: string;
};
export const defaultValues = {
    error: '',
    value: '',
};
