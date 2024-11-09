import {StyleSheet, View} from 'react-native';
import {Text} from '../text';
import {FC} from 'react';
import {Colors} from '@constants/colors';
import {Chevron} from 'src/icons/chevron';
import {ButtonBase} from '../buttonBase';

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
    items: {value: string; label: string}[];
    onRequestOpen: () => void;
};

export const DropdownBase: FC<PropsType> = ({label, placeholder, value, onRequestOpen, items}) => {
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
