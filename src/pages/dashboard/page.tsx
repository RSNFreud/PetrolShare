import {ButtonBase} from '@components/layout/buttonBase';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AddUser} from 'src/icons/add-user';
import {Cog} from 'src/icons/cog';
import {DashboardIcon} from 'src/icons/dashboard';
import {History} from 'src/icons/history';
import {Invoice} from 'src/icons/invoice';
import {List} from 'src/icons/list';
import {Odometer} from 'src/icons/odometer';
import {Pencil} from 'src/icons/pencil';
import {Petrol} from 'src/icons/petrol';
import {Plus} from 'src/icons/plus';
import {ResetArrow} from 'src/icons/reset-arrow';
import {Road} from 'src/icons/road';
import {getUserData} from 'src/selectors/common';

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
    icon: {
        height: 20,
        width: 'auto',
        color: 'white',
    },
});

const MENU_OPTIONS: {
    header: string;
    items: {
        icon: React.ReactNode;
        label: string;
    }[];
}[] = [
    {
        header: 'Distance',
        items: [
            {icon: <List style={styles.icon} />, label: 'Presets'},
            {icon: <DashboardIcon style={styles.icon} />, label: 'Add Specific Distance'},
            {icon: <Odometer style={styles.icon} />, label: 'Record Odometer'},
            {icon: <Road style={styles.icon} />, label: 'Assign Distance'},
            {icon: <ResetArrow style={styles.icon} />, label: 'Reset Distance'},
        ],
    },
    {
        header: 'Payments',
        items: [
            {icon: <Petrol style={styles.icon} />, label: 'Add Petrol'},
            {icon: <Invoice style={styles.icon} />, label: 'Invoices'},
            {icon: <History style={styles.icon} />, label: 'History'},
        ],
    },
    {
        header: 'Group',
        items: [
            {icon: <AddUser style={styles.icon} />, label: 'Invite User'},
            {icon: <Pencil style={styles.icon} />, label: 'Create Group'},
            {icon: <Plus style={styles.icon} />, label: 'Join Group'},
            {icon: <Cog style={styles.icon} />, label: 'Group Settings'},
        ],
    },
];

export const Dashboard = () => {
    const userData = useSelector(getUserData);

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
                                <ButtonBase key={menuItem.label} style={styles.menuItem}>
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
