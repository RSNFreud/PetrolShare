import React, {FC, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './layout/text';
import {Button} from './layout/button';
import {AppContext} from './appContext/context';

type PropsType = {
    onDelete: () => void;
    title: React.ReactNode;
    content: React.ReactNode;
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        lineHeight: 26,
    },
    buttons: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 30,
    },
    button: {
        flex: 1,
    },
});

export const DeletePopup: FC<PropsType> = ({onDelete, title, content}) => {
    const {setPopupData} = useContext(AppContext);

    const handleClose = () => {
        setPopupData({isVisible: false});
    };

    return (
        <>
            <Text style={styles.title} bold>
                {title}
            </Text>
            <Text style={styles.text}>{content}</Text>
            <View style={styles.buttons}>
                <Button style={styles.button} color="red" onPress={onDelete}>
                    Yes
                </Button>
                <Button style={styles.button} onPress={handleClose}>
                    No
                </Button>
            </View>
        </>
    );
};
