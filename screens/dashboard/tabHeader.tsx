import Colors from 'constants/Colors';
import React from 'react';
import {View, StyleSheet} from 'react-native';

import NavItem from './navItem';

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 25,
        backgroundColor: Colors.primary,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        flexDirection: 'row',
    },
    seperator: {
        backgroundColor: Colors.border,
        width: 1,
        height: 30,
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export type TabType = {
    title: string;
    icon: React.ReactNode;
    children?: (onClose?: () => void) => React.JSX.Element;
};

type PropsType = {
    tabs: TabType[];
    currentTab: TabType;
    onChange: (e: string) => void;
};

export const TabHeader = ({tabs, currentTab, onChange}: PropsType) => {
    return (
        <View style={styles.wrapper}>
            {tabs.map((tab, count) => (
                <View key={tab.title} style={styles.innerContainer}>
                    <NavItem
                        active={currentTab?.title === tab.title}
                        handleClick={e => onChange(e)}
                        text={tab?.title}
                        icon={tab.icon}
                    />
                    {count + 1 !== tabs.length && <View style={styles.seperator} />}
                </View>
            ))}
        </View>
    );
};
