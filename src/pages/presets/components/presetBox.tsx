import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {ButtonBase} from '@components/layout/buttonBase';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {Pencil} from 'src/icons/pencil';
import {Delete} from 'src/icons/delete';

const styles = StyleSheet.create({
    container: {
        height: 40,
        boxSizing: 'border-box',
        borderRadius: 4,
        backgroundColor: Colors.primary,
        borderColor: Colors.border,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderStyle: 'solid',
        paddingRight: 2,
        paddingLeft: 17,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    text: {
        fontSize: 14,
    },
    buttons: {
        backgroundColor: Colors.secondary,
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    button: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 52,
        alignSelf: 'stretch',
    },
    verticalLine: {
        width: 1,
        height: 28,
        backgroundColor: Colors.border,
    },
    selected: {
        borderColor: Colors.tertiary,
    },
});

type PropsType = {
    text: string;
    selected?: boolean;
    onEdit: () => void;
    onSelect: () => void;
};
export const PresetBox: FC<PropsType> = ({text, onEdit, selected, onSelect}) => {
    return (
        <ButtonBase style={[styles.container, selected ? styles.selected : []]} onPress={onSelect}>
            <Text bold style={styles.text}>
                {text}
            </Text>
            <View style={styles.buttons}>
                <ButtonBase style={styles.button} onPress={onEdit}>
                    <Pencil color="white" />
                </ButtonBase>
                <View style={styles.verticalLine} />
                <ButtonBase style={styles.button}>
                    <Delete color="red" />
                </ButtonBase>
            </View>
        </ButtonBase>
    );
};
