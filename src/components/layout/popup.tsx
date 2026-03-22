import {Animated, Dimensions, Modal, Pressable, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

import React, {useContext, useEffect, useRef, useState} from 'react';
import Constants from 'expo-constants';
import {Text} from './text';
import {ButtonBase} from './buttonBase';
import {Colors} from '@constants/colors';
import {Cross} from 'src/icons/cross';
import {AppContext} from '@components/appContext/context';
import {PopupFooter} from './popupFooter';

const styles = StyleSheet.create({
    overlay: {backgroundColor: 'rgba(35, 35, 35, 0.8)', height: Dimensions.get('window').height},
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
        flex: 1,
    },
    stickyButtonContainer: {
        padding: 16,
        backgroundColor: Colors.primary,
        borderTopColor: Colors.border,
        gap: 10,
    },
});

const TIME_TO_CLOSE = 300;

export const Popup = () => {
    const {popupData, setPopupData} = useContext(AppContext);
    const [isPopupOpen, setIsPopupOpen] = useState(popupData.isVisible);
    const position = useRef(new Animated.Value(1000)).current;
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const maxPopupHeight = Dimensions.get('window').height * 0.9 - Constants.statusBarHeight;
        Animated.sequence([
            Animated.timing(heightAnim, {
                toValue: maxPopupHeight,
                duration: 200,
                delay: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

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
            setPopupData({isVisible: false, stickyButton: null, minContentHeight: null});
            setIsPopupOpen(false);
            position.setValue(1000);
        });
    };

    return (
        <Modal
            animationType="fade"
            visible={isPopupOpen}
            statusBarTranslucent
            transparent
            onRequestClose={handleClose}
        >
            {popupData.hasClose ? (
                <Pressable android_disableSound style={styles.overlay} onPress={handleClose} />
            ) : (
                <View style={styles.overlay} />
            )}
            <Animated.View
                style={[
                    styles.popup,
                    {
                        transform: [{translateY: position}],
                        maxHeight: heightAnim,
                        ...(popupData.minContentHeight && {
                            minHeight: popupData.minContentHeight || 0,
                        }),
                    },
                ]}
            >
                <KeyboardAwareScrollView
                    stickyHeaderIndices={[0]}
                    scrollToOverflowEnabled={false}
                    overScrollMode="never"
                    keyboardShouldPersistTaps="always"
                    style={{backgroundColor: Colors.secondary}}
                >
                    <View>
                        <View style={styles.header}>
                            <Text bold>{popupData.title}</Text>
                            {popupData.hasClose ? (
                                <ButtonBase style={styles.close} onPress={handleClose}>
                                    <Cross color="white" />
                                </ButtonBase>
                            ) : (
                                <View style={styles.close} />
                            )}
                        </View>
                    </View>
                    <View style={styles.content}>{popupData.content}</View>
                </KeyboardAwareScrollView>
                {popupData.stickyButton && <PopupFooter>{popupData.stickyButton}</PopupFooter>}
            </Animated.View>
        </Modal>
    );
};
