import {FormValues} from '@constants/common';

export type CommonPropsType = {
    data: {
        [key: string]: FormValues;
    };
    setData: (data: {[key: string]: FormValues}) => void;
};
