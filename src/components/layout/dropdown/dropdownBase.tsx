import {StyleSheet, View} from 'react-native';
import {Text} from '../text';
import {FC, useState} from 'react';
import {Colors} from '@constants/colors';
import {Chevron} from 'src/icons/chevron';
import {ButtonBase} from '../buttonBase';
import {DropdownOverlay} from './dropdownOverlay';

const styles = StyleSheet.create({
    label: {
        marginBottom: 6,
    },
    dropdownContainer: {
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 15,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 4,
    },
    input: {
        fontSize: 18,
        opacity: 0.8,
    },
    activeInput: {
        opacity: 1,
    },
    icon: {
        color: 'white',
        height: 7,
    },
});

type PropsType = {
    label: string;
    placeholder: string;
    value?: string;
    onChangeText?: (value: string) => void;
    items: {value: string; label: string}[];
};

export const DropdownBase: FC<PropsType & {onRequestOpen: () => void}> = ({
    label,
    placeholder,
    value,
    onRequestOpen,
    items,
}) => {
    const selectedItem = items.find(item => item.value === value);
    return (
        <>
            <View>
                <Text bold style={styles.label}>
                    {label}
                </Text>
                <ButtonBase style={styles.dropdownContainer} onPress={onRequestOpen}>
                    <Text style={{...styles.input, ...(value ? styles.activeInput : {})}}>
                        {selectedItem?.label || placeholder}
                    </Text>
                    <Chevron style={styles.icon} />
                </ButtonBase>
            </View>
        </>
    );
};

export const Dropdown: FC<PropsType> = ({value, onChangeText, items, ...rest}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (value: string) => {
        setIsOpen(false);
        onChangeText?.(value);
    };

    return (
        <>
            <DropdownBase
                value={value}
                items={items}
                {...rest}
                onRequestOpen={() => setIsOpen(true)}
            />
            <DropdownOverlay
                isVisible={isOpen}
                onClick={handleClick}
                onRequestClose={() => setIsOpen(false)}
                items={items}
                value={value}
            />
        </>
    );
};
