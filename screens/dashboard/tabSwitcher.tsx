import analytics from '@react-native-firebase/analytics';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, ScrollView} from 'react-native';

import {TabHeader, TabType} from './tabHeader';

type PropsType = {
    tabs: TabType[];
};

export default ({tabs}: PropsType) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [currentTab, setCurrentTab] = useState(tabs[0].title);

    useEffect(() => {
        fadeAnim.setValue(0);
        sendAnalytics(currentTab);
        if (currentTab === 'Petrol') return;
        Animated.timing(fadeAnim, {
            toValue: 1,
            delay: 200,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [currentTab]);

    const getCurrentTab = (tabName: string) => {
        return tabs.filter(tab => tab?.title === tabName)[0];
    };

    const sendAnalytics = async (name: string) => {
        await analytics().logScreenView({
            screen_name: name,
            screen_class: name,
        });
    };

    const switchTab = (e: string) => {
        fadeAnim.setValue(0);
        setCurrentTab(e);
    };

    const TabEl = () => {
        const child = getCurrentTab(currentTab)?.children;
        if (child) {
            return child(() => switchTab(tabs[0].title));
        }
        return <></>;
    };

    return (
        <>
            <TabHeader tabs={tabs} currentTab={getCurrentTab(currentTab)} onChange={switchTab} />
            <Animated.View style={{opacity: fadeAnim, flex: 1}}>
                <ScrollView
                    overScrollMode="always"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingHorizontal: 25,
                        paddingBottom: 55,
                        paddingTop: 30,
                    }}
                >
                    <TabEl />
                </ScrollView>
            </Animated.View>
        </>
    );
};
