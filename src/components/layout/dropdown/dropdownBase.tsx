import {StyleSheet, View} from 'react-native';
import {FC} from 'react';
import {Text} from '../text';
import {ButtonBase} from '../buttonBase';
import {Colors} from '@constants/colors';
import {Chevron} from 'src/icons/chevron';

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
    error: {
        fontSize: 14,
        color: Colors.red,
        marginTop: 8,
    },
    disabled: {
        backgroundColor: '#292E46',
    },
    disabledText: {
        color: '#7A7E93',
    },
});

type PropsType = {
    label: string;
    placeholder: string;
    value?: string;
    error?: string;
    items: {value: string; label: string}[];
    onRequestOpen: () => void;
};

export const DropdownBase: FC<PropsType> = ({
    label,
    error,
    placeholder,
    value,
    onRequestOpen,
    items,
}) => {
    const selectedItem = items.find(item => item.value === value);
    const isDisabled = !items.length;
    return (
        <>
            <View>
                <Text bold style={styles.label}>
                    {label}
                </Text>
                <ButtonBase
                    style={{...styles.dropdownContainer, ...(isDisabled ? styles.disabled : {})}}
                    onPress={onRequestOpen}
                    disabled={isDisabled}
                >
                    <Text
                        style={{
                            ...styles.input,
                            ...(value ? styles.activeInput : {}),
                            ...(isDisabled ? styles.disabledText : {}),
                        }}
                    >
                        {selectedItem?.label || placeholder}
                    </Text>
                    <Chevron style={{...styles.icon, ...(isDisabled ? styles.disabledText : {})}} />
                </ButtonBase>
                {!!error && <Text style={styles.error}>{error}</Text>}
            </View>
        </>
    );
};
