import { Dimensions, ImageBackground, Animated, Platform } from "react-native"
import { useEffect, useRef, useState } from 'react'
import Colors from "../constants/Colors"
import SplashImage from '../assets/images/splash.png'
import { EventRegister } from "react-native-event-listeners"

export default () => {
    const [visible, setVisible] = useState(true)
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        EventRegister.addEventListener('closeSplash', () => {
            fadeOut()
        })
        EventRegister.addEventListener('openSplash', () => {
            setVisible(true)
            fadeAnim.setValue(1)
        })

        return () => {
            EventRegister.removeEventListener('closeSplash')
            EventRegister.removeEventListener('openSplash')
        }
    }, [])

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            delay: 600,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false)
        });
    }

    if (!visible) return <></>

    const screen = Platform.OS === "web" ? Dimensions.get('window') : Dimensions.get('screen')

    return <Animated.View style={{ width: Dimensions.get('window').width, opacity: fadeAnim, height: screen.height, position: 'absolute', top: 0, left: 0, zIndex: 1000, backgroundColor: Colors.background, justifyContent: 'center', alignContent: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <ImageBackground source={SplashImage} style={{ width: 400, height: 400 }} />
    </Animated.View>
}