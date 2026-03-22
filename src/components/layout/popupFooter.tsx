import {Colors} from '@constants/colors';
import {FC, ReactNode, useRef} from 'react';
import {Animated, LayoutChangeEvent, StyleSheet, View} from 'react-native';

type PropsType = {
    children: ReactNode;
};

const styles = StyleSheet.create({
    stickyButtonContainer: {
        padding: 16,
        backgroundColor: Colors.primary,
        borderTopColor: Colors.border,
        gap: 10,
    },
});

export const PopupFooter: FC<PropsType> = ({children}) => {
    const heightAnim = useRef(new Animated.Value(0)).current;

    const onLayout = (event: LayoutChangeEvent) => {
        const {clientHeight} = event.target;

        Animated.timing(heightAnim, {
            toValue: clientHeight,
            duration: 100,
            useNativeDriver: false, // height can't use native driver
        }).start();
    };

    return (
        <>
            <View
                style={[
                    {
                        position: 'absolute',
                        opacity: 0,
                        zIndex: -1,
                    },
                    styles.stickyButtonContainer,
                ]}
                onLayout={onLayout}
            >
                {children}
            </View>
            <Animated.View style={[{height: heightAnim}, styles.stickyButtonContainer]}>
                {children}
            </Animated.View>
        </>
    );
};
