import {useEffect, useRef, useState} from 'react';
import {Dimensions, ImageBackground, Animated} from 'react-native';
import {connect} from 'react-redux';

import SplashImage from 'src/assets/images/splash.png';
import {Colors} from 'src/constants/colors';
import {ApplicationStoreType} from 'src/reducers';
import {setLoading as setLoadingAction} from 'src/reducers/loadingScreen';

type PropsType = {
    isLoading: boolean;
    setLoading: (state: boolean) => void;
};

export const SplashScreen: React.FC<PropsType> = ({isLoading, setLoading}) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            return fadeOut();
        }
        setIsVisible(isLoading);
        fadeAnim.setValue(1);
    }, [isLoading]);

    const fadeOut = () => {
        setIsVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 0,
            delay: 600,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setIsVisible(false);
        });
    };

    if (!isVisible) return <></>;

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

const mapStateToProps = (store: ApplicationStoreType) => ({
    isLoading: store.loadingScreen,
});

export const SplashScreenConnected = connect(mapStateToProps, {setLoading: setLoadingAction})(
    SplashScreen,
);
