import Constants from 'expo-constants';
import {JSX, useEffect, useRef, useState} from 'react';
import {
    Animated,
    DimensionValue,
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    View,
} from 'react-native';

import AlertBox from './alertBox';
import {Text} from './text';
import Exit from '../assets/icons/exit';
import Colors from '../constants/Colors';
import {sendCustomEvent} from '../hooks';

const TIME_TO_CLOSE = 200;

type ModalType = {
    visible: boolean;
    handleClose: () => void;
    children: JSX.Element | JSX.Element[];
    height?: DimensionValue;
    animate?: boolean;
    showClose?: boolean;
    title?: string;
};

export default ({
    visible,
    handleClose,
    children,
    showClose = true,
    height = 'auto',
    animate = true,
    title,
}: ModalType) => {
    const [opened, setOpened] = useState(false);
    const [modalHeight, setModalHeight] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [keyboardPadding, setKeyboardPadding] = useState(0);
    const position = useRef(new Animated.Value(modalHeight)).current;
    const heightAnim = useRef(new Animated.Value(0)).current;

    const containerRef = useRef<View>(null);

    const getHeight = () => {
        containerRef.current?.measure((_x, _y, _width, height) => {
            setModalHeight(height);
        });
    };

    useEffect(() => {
        const showSubscriptionAndroid = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardPadding(e.endCoordinates.height);
        });
        const hideSubscriptionAndroid = Keyboard.addListener('keyboardDidHide', e => {
            setKeyboardPadding(0);
        });
        const showSubscription = Keyboard.addListener('keyboardWillShow', e => {
            setKeyboardPadding(e.endCoordinates.height);
            if (Platform.OS !== 'ios') return;
            Animated.sequence([
                Animated.timing(position, {
                    toValue: -e.endCoordinates.height,
                    duration: TIME_TO_CLOSE,
                    delay: 200,
                    useNativeDriver: false,
                }),
            ]).start();
        });
        const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardPadding(0);
            if (Platform.OS !== 'ios') return;
            Animated.sequence([
                Animated.timing(position, {
                    toValue: 0,
                    delay: 200,
                    duration: TIME_TO_CLOSE,
                    useNativeDriver: false,
                }),
            ]).start();
        });

        return () => {
            showSubscriptionAndroid.remove();
            hideSubscriptionAndroid.remove();
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [keyboardPadding]);

    const open = () => {
        Animated.sequence([
            Animated.timing(position, {
                toValue: 0,
                duration: TIME_TO_CLOSE,
                delay: 200,
                useNativeDriver: false,
            }),
        ]).start(_e => {
            if (isVisible || visible) setOpened(true);
        });
    };

    const close = () => {
        position.setValue(0);
        setOpened(true);
        Animated.sequence([
            Animated.timing(position, {
                toValue: modalHeight,
                duration: TIME_TO_CLOSE,
                useNativeDriver: false,
            }),
        ]).start(_e => {
            setIsVisible(false);
            setOpened(false);
            setTimeout(() => {
                handleClose();
            }, 300);
            sendCustomEvent('popupVisible', visible);
        });
    };

    useEffect(() => {
        Animated.timing(heightAnim, {
            toValue:
                Dimensions.get('window').height * 0.9 - Constants.statusBarHeight - keyboardPadding,
            duration: TIME_TO_CLOSE,
            useNativeDriver: false,
            delay: 100,
        }).start();
    }, [keyboardPadding]);

    useEffect(() => {
        if (!isVisible || opened) return;
        position.setValue(modalHeight || 1000);

        if (!animate) return position.setValue(0);
        if (modalHeight >= 1) open();
    }, [isVisible, modalHeight]);

    useEffect(() => {
        if (!visible && isVisible) {
            try {
                Keyboard.dismiss();
            } catch {}
            setTimeout(() => {
                close();
            }, 400); // Hide keyboard
            return;
        }
        sendCustomEvent('popupVisible', visible);
        setIsVisible(visible);
    }, [visible]);

    return (
        <Modal
            animationType="fade"
            visible={isVisible}
            transparent
            accessibilityLabel="popup"
            onRequestClose={() => showClose && close()}
        >
            <AlertBox />
            <Pressable
                onPress={() => showClose && close()}
                android_disableSound
                style={{
                    backgroundColor: 'rgba(35, 35, 35, 0.8)',
                    height: Dimensions.get('window').height,
                }}
            />
            <Animated.View
                ref={containerRef}
                onLayout={getHeight}
                style={{
                    backgroundColor: Colors.secondary,
                    height,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    transform: [{translateY: position}],
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    maxHeight: heightAnim,
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: Colors.border,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        flexDirection: 'row',
                        paddingHorizontal: 25,
                        paddingVertical: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.border,
                        backgroundColor: Colors.primary,
                    }}
                >
                    <View>
                        {!!title && (
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{title} </Text>
                        )}
                    </View>
                    {showClose && (
                        <Pressable
                            android_disableSound
                            onPress={close}
                            accessibilityHint="closes the popup"
                            style={{
                                width: 40,
                                height: 40,
                                alignContent: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Exit />
                        </Pressable>
                    )}
                </View>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    style={{marginTop: 51, flex: 1}}
                    contentContainerStyle={{paddingVertical: 30, paddingHorizontal: 25}}
                >
                    {children}
                </ScrollView>
            </Animated.View>
        </Modal>
    );
};
