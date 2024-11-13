import {Dimensions, Modal, Pressable, StyleSheet, View} from 'react-native';
import {Text} from './text';
import {Colors} from '@constants/colors';
import {useContext} from 'react';
import {AppContext} from '@components/appContext/context';
import {ButtonBase} from './buttonBase';

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(35, 35, 35, 0.8)',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    content: {
        gap: 10,
    },
    alertBox: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 15,
        gap: 20,
        marginHorizontal: 25,
        flex: 1,
    },
    wrapper: {
        height: Dimensions.get('window').height,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 4,
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        lineHeight: 24,
    },
    buttons: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: 25,
    },
    buttonText: {
        fontSize: 14,
    },
});

export const Alertbox = () => {
    const {alertBoxData, setAlertBoxData} = useContext(AppContext);

    const handleClose = () => {
        setAlertBoxData({isVisible: false});
    };

    return (
        <Modal
            animationType="fade"
            visible={alertBoxData.isVisible}
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.wrapper}>
                <Pressable android_disableSound style={styles.overlay} onPress={handleClose} />
                <View style={styles.alertBox}>
                    <View style={styles.content}>
                        <Text style={styles.text} bold>
                            {alertBoxData.title}
                        </Text>
                        <Text style={styles.text}>{alertBoxData.content}</Text>
                    </View>
                    <View style={styles.buttons}>
                        {alertBoxData.buttons.map(button => (
                            <ButtonBase
                                key={button.text}
                                onPress={() => button?.onClick?.() || handleClose()}
                            >
                                <Text bold style={styles.buttonText}>
                                    {button.text.toUpperCase()}
                                </Text>
                            </ButtonBase>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
