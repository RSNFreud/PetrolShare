import {FC, useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {DropdownBase} from './dropdownBase';
import {DropdownOverlay} from './dropdownOverlay';

type PropsType = {
    label: string;
    placeholder: string;
    value?: string;
    onChangeText?: (value: string) => void;
    onSubmitEditing?: () => void;
    hasSearchBar?: boolean;
    items?: {value: string; label: string}[];
};

export const Dropdown: FC<PropsType> = ({
    value,
    onChangeText,
    items,
    onSubmitEditing,
    hasSearchBar,
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (value: string) => {
        setIsOpen(false);
        onChangeText?.(value);
    };

    useEffect(() => {
        if (!items || items.length > 1) return;
        onChangeText?.(items[0].value);
    }, [items]);

    return (
        <>
            <DropdownBase
                value={value}
                items={items}
                {...rest}
                onRequestOpen={() => {
                    Keyboard.dismiss();
                    setIsOpen(true);
                }}
            />
            <DropdownOverlay
                isVisible={isOpen}
                onClick={handleClick}
                onSubmitEditing={onSubmitEditing}
                onRequestClose={() => setIsOpen(false)}
                items={items}
                hasSearchBar={hasSearchBar}
                value={value}
            />
        </>
    );
};
