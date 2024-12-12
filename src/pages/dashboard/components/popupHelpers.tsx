import {Dropdown} from '@components/layout/dropdown/dropdown';
import {Input} from '@components/layout/input';
import {ComponentProps} from 'react';

export const input = (
    label: string,
    placeholder: string,
    id: string,
    props?: Partial<ComponentProps<typeof Input>>,
) => ({
    component: Input,
    props: {
        placeholder,
        label,
        id,
        ...props,
    },
});

export const dropdown = (
    label: string,
    placeholder: string,
    id: string,
    items: {value: string; label: string}[],
    props?: Partial<ComponentProps<typeof Dropdown>>,
) => ({
    component: Dropdown,
    props: {
        placeholder,
        label,
        items,
        id,
        ...props,
    },
});
