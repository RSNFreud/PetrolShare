import { Dimensions, View, ImageBackground, Animated } from "react-native"
import { useEffect, useRef, useState } from 'react'
import Colors from "../constants/Colors"
import SplashImage from '../assets/images/splash.png'
import { EventRegister } from "react-native-event-listeners"

export default () => {
    const [visible, setVisible] = useState(true)
    const [fading, setFading] = useState(false)
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        EventRegister.addEventListener('closeSplash', () => {

            setFading(true)
        })
        EventRegister.addEventListener('openSplash', () => {
            setVisible(true)
            setFading(false)
            fadeAnim.setValue(1)
        })

        return () => {
            EventRegister.removeEventListener('closeSplash')
            EventRegister.removeEventListener('openSplash')
        }
    }, [])

    useEffect(() => {
        if (!fading) return
        Animated.timing(fadeAnim, {
            toValue: 0,
            delay: 500,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false)
        });
    }, [fading])

    if (!visible) return <></>

    return <Animated.View style={{ width: '100%', opacity: fadeAnim, height: Dimensions.get('screen').height, position: 'absolute', top: 0, left: 0, zIndex: 1000, backgroundColor: Colors.background }}>
        <ImageBackground source={SplashImage} style={{ width: '100%', height: '100%' }} />
    </Animated.View>
}