import {MISSING_VALUE} from '@constants/common';
import {z} from 'zod';

export const commonValidation = z.string().trim().min(1, MISSING_VALUE);

export const createCommonValidation = (keys: string[]): {[key: string]: z.ZodString} =>
    keys.reduce(
        (previousValue, key) => ({
            ...previousValue,
            [key]: commonValidation,
        }),
        {} as {[key: string]: z.ZodString},
    );

export const stringToNumberValidation = z
    .string()
    .transform(val => parseInt(val))
    .pipe(
        z.coerce
            .number({
                invalid_type_error: 'Please enter a valid number',
            })
            .min(0.1, 'Please enter a valid number above 0')
            .nonnegative(MISSING_VALUE),
    );
