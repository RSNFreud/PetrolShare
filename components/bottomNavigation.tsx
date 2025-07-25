import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useRouter} from 'expo-router';
import React, {useContext, useRef} from 'react';
import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text} from './text';
import Colors from '../constants/Colors';
import {AuthContext} from '../hooks/context';

type BottonNavPropTypes = {
    icon?:
        | ((props: {focused: boolean; color: string; size: number}) => React.ReactNode)
        | undefined;
    text: string;
    active?: boolean;
    hidden?: boolean;
    handleClick?: () => void;
};

const BottomNavItem = ({icon: Icon, text, active, handleClick, hidden}: BottonNavPropTypes) => {
    if (hidden) return <></>;
    return (
        <TouchableWithoutFeedback onPress={handleClick}>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: active ? 1 : 0.5,
                    flex: 1,
                    paddingVertical: 15,
                    // paddingHorizontal: 45,
                }}
            >
                {Icon && <Icon focused={false} color="" size={0} />}
                <Text style={{marginTop: 10, fontSize: 14, fontWeight: 'bold'}}>{text}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ({state, descriptors, navigation}: BottomTabBarProps) => {
    const scrollRef = useRef<ScrollView>(null);
    const {isPremium} = useContext(AuthContext);
    const insets = useSafeAreaInsets();
    const {navigate} = useRouter();

    const setInitialScroll = (index: number) => {
        const ref = scrollRef.current;
        if (!ref) return;
        ref.scrollTo({y: 0, x: 30 * index, animated: true});
    };

    return (
        <View
            // ref={scrollRef}
            style={{
                backgroundColor: Colors.secondary,
                width: '100%',
                flexGrow: 0,
                paddingBottom: insets.bottom,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                minWidth: '100%',
            }}
            // horizontal
            // contentContainerStyle={{
            //   display: "flex",
            //   flexDirection: "row",
            //   paddingHorizontal: 0,
            //   justifyContent: "center",
            //   minWidth: "100%",
            // }}
        >
            {state?.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label =
                    typeof options.tabBarLabel !== 'string' ? route.name : options.tabBarLabel;
                const isFocused = state.index === index;

                const onPress = () => {
                    // @ts-expect-error
                    navigate(route.name !== 'index' ? route.name : '/');
                };

                if (isFocused) setInitialScroll(index);
                if (label === 'addPreset' || label === 'Schedules' || label === '[groupID]') return;
                // if (!route.path) return;

                return (
                    <BottomNavItem
                        hidden={label === 'Schedules' && !isPremium}
                        key={route.name}
                        active={isFocused}
                        text={label}
                        handleClick={onPress}
                        icon={options.tabBarIcon}
                    />
                );
            })}
        </View>
    );
};
