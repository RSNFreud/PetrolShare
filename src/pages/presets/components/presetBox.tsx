import {FC, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ButtonBase} from '@components/layout/buttonBase';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {Pencil} from 'src/icons/pencil';
import {Delete} from 'src/icons/delete';
import {AppContext} from '@components/appContext/context';
import {DeletePopup} from '@components/deletePopup';
import {ENDPOINTS} from '@constants/endpoints';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';

const styles = StyleSheet.create({
    container: {
        height: 40,
        boxSizing: 'border-box',
        borderRadius: 4,
        backgroundColor: Colors.primary,
        borderColor: Colors.border,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
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
    onDelete: () => void;
    onSelect: () => void;
    presetID: number;
};
export const PresetBox: FC<PropsType> = ({
    text,
    onEdit,
    selected,
    onSelect,
    onDelete,
    presetID,
}) => {
    const {setPopupData} = useContext(AppContext);

    const deletePreset = async () => {
        const res = await sendPostRequest(ENDPOINTS.DELETE_PRESET, {presetID});
        if (!res?.ok) return;
        onDelete();

        setPopupData({
            isVisible: true,
            content: (
                <Text style={{lineHeight: 26}}>
                    The preset has been successfully deleted and all associated records have been
                    removed.
                </Text>
            ),
        });
    };

    const handleDelete = () => {
        setPopupData({
            title: 'Delete Preset',
            isVisible: true,
            content: (
                <DeletePopup
                    title="Are you sure you want to delete this preset?"
                    content="Once deleted, the preset and its settings will be permanently removed and cannot be recovered."
                    onDelete={deletePreset}
                />
            ),
        });
    };

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
                <ButtonBase style={styles.button} onPress={handleDelete}>
                    <Delete color="red" />
                </ButtonBase>
            </View>
        </ButtonBase>
    );
};
