import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

type PropsType = {
    children: JSX.Element,
    currentTab: string,
}

export default ({ children, currentTab }: PropsType) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeAnim.setValue(0)
        if (currentTab === "Petrol") return
        Animated.timing(fadeAnim, {
            toValue: 1,
            delay: 200,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [currentTab])

    return <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>
}
