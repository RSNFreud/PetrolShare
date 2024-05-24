import {useEffect, useRef} from 'react';
import {Animated} from 'react-native';

export default ({children, open}: {children: React.ReactNode; open: boolean}) => {
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (open) expand();
        else minimise();
    }, [open]);

    const expand = () => {
        Animated.timing(heightAnim, {
            toValue: 1000,
            duration: 500,
            delay: 100,
            useNativeDriver: false,
        }).start();
    };

    const minimise = () => {
        Animated.timing(heightAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    return (
        <Animated.View style={{maxHeight: heightAnim, overflow: 'hidden'}}>
            {children}
        </Animated.View>
    );
};
