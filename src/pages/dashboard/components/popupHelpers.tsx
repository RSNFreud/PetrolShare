import {ComponentProps} from 'react';
import {View} from 'react-native';
import {Dropdown} from '@components/layout/dropdown/dropdown';
import {Input} from '@components/layout/input';
import {DescriptionBox} from '@components/layout/descriptionBox';

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
        submitBehavior: 'submit',
        id,
        ...props,
    },
});

export const descriptionBox = (content: string) => ({
    component: DescriptionBox,
    props: {
        content,
        id: 'descriptionBox',
    },
});

export const seperator = (distance: number) => ({
    component: () => <View style={{height: distance}} />,
    props: {
        id: 'seperator',
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
