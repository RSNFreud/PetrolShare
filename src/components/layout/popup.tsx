import {Animated, Dimensions, Keyboard, Modal, Pressable, StyleSheet, View} from 'react-native';
import {Text} from './text';
import {ButtonBase} from './buttonBase';
import {Colors} from '@constants/colors';
import {Cross} from 'src/icons/cross';
import {useContext, useEffect, useRef, useState} from 'react';
import Constants from 'expo-constants';
import {AppContext} from '@components/appContext/context';

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(35, 35, 35, 0.8)',
        height: Dimensions.get('window').height,
    },
    header: {
        paddingLeft: 18,
        paddingVertical: 5,
        backgroundColor: Colors.primary,
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    close: {
        paddingHorizontal: 18,
        height: 40,
        color: 'white',
        alignContent: 'center',
        justifyContent: 'center',
    },
    popup: {
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 2,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    content: {
        paddingVertical: 30,
        paddingHorizontal: 18,
        backgroundColor: Colors.secondary,
    },
});

const TIME_TO_CLOSE = 300;

export const Popup = () => {
    const {popupData, setPopupData} = useContext(AppContext);
    const [isPopupOpen, setIsPopupOpen] = useState(popupData.isVisible);
    const position = useRef(new Animated.Value(1000)).current;
    const [keyboardPadding, setKeyboardPadding] = useState(0);
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showSubscriptionAndroid = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardPadding(e.endCoordinates.height);
        });
        const hideSubscriptionAndroid = Keyboard.addListener('keyboardDidHide', e => {
            setKeyboardPadding(0);
        });
        const showSubscription = Keyboard.addListener('keyboardWillShow', e => {
            setKeyboardPadding(e.endCoordinates.height);
        });
        const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardPadding(0);
        });

        return () => {
            showSubscriptionAndroid.remove();
            hideSubscriptionAndroid.remove();
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        const maxPopupHeight =
            Dimensions.get('window').height * 0.9 - Constants.statusBarHeight - keyboardPadding;
        Animated.sequence([
            Animated.timing(heightAnim, {
                toValue: maxPopupHeight,
                duration: 200,
                delay: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [keyboardPadding]);

    useEffect(() => {
        if (popupData.isVisible) {
            setIsPopupOpen(popupData.isVisible);
            open();
        } else {
            handleClose();
        }
    }, [popupData.isVisible]);

    const open = () => {
        position.setValue(1000);
        Animated.sequence([
            Animated.timing(position, {
                toValue: 0,
                duration: TIME_TO_CLOSE,
                delay: 300,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handleClose = () => {
        position.setValue(0);
        Animated.sequence([
            Animated.timing(position, {
                toValue: 1000,
                duration: TIME_TO_CLOSE,
                useNativeDriver: false,
            }),
        ]).start(_e => {
            setPopupData({isVisible: false});
            setIsPopupOpen(false);
            position.setValue(1000);
        });
    };

    return (
        <Modal animationType="fade" visible={isPopupOpen} transparent onRequestClose={handleClose}>
            <Pressable android_disableSound style={styles.overlay} onPress={handleClose} />
            <Animated.ScrollView
                style={[styles.popup, {transform: [{translateY: position}], maxHeight: heightAnim}]}
                stickyHeaderIndices={[0]}
                keyboardShouldPersistTaps="always"
            >
                <>
                    <View style={styles.header}>
                        <Text bold>{popupData.title}</Text>
                        <ButtonBase style={styles.close} onPress={handleClose}>
                            <Cross color="white" />
                        </ButtonBase>
                    </View>
                </>
                <View style={styles.content}>{popupData.content}</View>
            </Animated.ScrollView>
        </Modal>
    );
};
