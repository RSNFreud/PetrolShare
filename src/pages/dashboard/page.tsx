import {ButtonBase} from '@components/layout/buttonBase';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {PopupContext} from 'src/popup/context';
import {getUserData} from 'src/selectors/common';
import {PopupWrapper} from './components/dashboardPopup';
import {z} from 'zod';
import {MENU_OPTIONS, MenuType} from './constants';

const styles = StyleSheet.create({
    userCard: {
        borderRadius: 8,
        borderColor: Colors.border,
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 10,
        paddingHorizontal: 18,
        gap: 5,
        marginTop: 20,
        marginBottom: 30,
    },
    username: {
        fontSize: 18,
        fontWeight: 'medium',
    },
    distance: {
        fontWeight: '300',
    },
    menuHeader: {
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 10,
    },
    menuContainer: {
        gap: 30,
    },
    menuItem: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 90,
        borderColor: Colors.border,
        backgroundColor: Colors.primary,
        color: 'white',
        borderWidth: 1,
        gap: 10,
        alignItems: 'center',
        borderStyle: 'solid',
        flexDirection: 'row',
        width: 'auto',
        height: 37,
        alignContent: 'center',
        justifyContent: 'center',
    },
    menuItemsContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 10,
    },
    menuText: {
        fontSize: 14,
    },
});

export type PopupType = {
    id: string;
    children?: {
        component: React.FC<any>;
        props: {
            id: string;
        };
    }[];
    buttons?: {
        label: string;
        isSubmitButton?: boolean;
        isDraftButton?: boolean;
    }[];
    validation?: z.ZodObject<any>;
    pretext?: string;
    successText: string;
};

export const Dashboard = () => {
    const userData = useSelector(getUserData);
    const {setPopupData} = useContext(PopupContext);

    const onClick = ({label, popup, link}: MenuType) => {
        switch (true) {
            case Boolean(popup):
                setPopupData({
                    isVisible: true,
                    title: label,
                    content: <PopupWrapper data={popup as PopupType} />,
                });
                break;
            case Boolean(link):
                break;
            default:
                break;
        }
    };

    return (
        <>
            <View style={styles.userCard}>
                <Text style={styles.username}>{userData.fullName}</Text>
                <Text style={styles.distance}>
                    {userData.currentMileage || 0} {userData.distance}
                </Text>
            </View>
            <View style={styles.menuContainer}>
                {MENU_OPTIONS.map(menuTab => (
                    <View key={menuTab.header}>
                        <Text bold style={styles.menuHeader}>
                            {menuTab.header.toUpperCase()}
                        </Text>
                        <View style={styles.menuItemsContainer}>
                            {menuTab.items.map(menuItem => (
                                <ButtonBase
                                    key={menuItem.label}
                                    style={styles.menuItem}
                                    onPress={() => onClick(menuItem)}
                                >
                                    <>
                                        {menuItem.icon}
                                        <Text bold style={styles.menuText}>
                                            {menuItem.label}
                                        </Text>
                                    </>
                                </ButtonBase>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </>
    );
};
