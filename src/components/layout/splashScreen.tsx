import {useEffect, useRef, useState} from 'react';
import {Dimensions, ImageBackground, Animated} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';

import SplashImage from 'src/assets/images/splash.png';
import {Colors} from 'src/constants/colors';

export const SplashScreen: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        EventRegister.addEventListener('closeSplash', () => {
            fadeOut();
        });
        EventRegister.addEventListener('openSplash', () => {
            setVisible(true);
            fadeAnim.setValue(1);
        });

        return () => {
            EventRegister.removeEventListener('closeSplash');
            EventRegister.removeEventListener('openSplash');
        };
    }, []);

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            delay: 600,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
        });
    };

    if (!visible) return <></>;

    return (
        <Animated.View
            style={{
                width: Dimensions.get('screen').width,
                opacity: fadeAnim,
                height: Dimensions.get('screen').height,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 10000,
                backgroundColor: Colors.background,
                justifyContent: 'center',
                alignContent: 'center',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <ImageBackground source={SplashImage} style={{width: 400, height: 400}} />
        </Animated.View>
    );
};
