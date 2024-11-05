import {ButtonBase} from '@components/layout/buttonBase';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import React, {ComponentProps, useContext} from 'react';
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
import {PopupContext} from 'src/popup/context';
import {getUserData} from 'src/selectors/common';
import {PopupWrapper} from './components/common';
import {stringToNumberValidation} from 'src/utils/validation';
import {z} from 'zod';
import {MISSING_VALUE} from '@constants/common';
import {Input} from '@components/layout/input';

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

export type PopupType = {
    inputs?: {
        label: string;
        placeholder: string;
        id: string;
        props?: Partial<ComponentProps<typeof Input>>;
    }[];
    buttons?: {
        label: string;
        isSubmitButton?: boolean;
        isDraftButton?: boolean;
    }[];
    validation?: z.ZodObject<any>;
    pretext?: string;
};

type MenuType = {
    icon: React.ReactNode;
    label: string;
    popup?: PopupType;
    link?: string;
};

const MENU_OPTIONS: {
    header: string;
    items: MenuType[];
}[] = [
    {
        header: 'Distance',
        items: [
            {icon: <List style={styles.icon} />, label: 'Presets'},
            {
                icon: <DashboardIcon style={styles.icon} />,
                label: 'Add Specific Distance',
                popup: {
                    inputs: [
                        {
                            label: 'Distance',
                            placeholder: 'Enter total distance',
                            id: 'distance',
                            props: {
                                keyboardType: 'number-pad',
                            },
                        },
                    ],
                    buttons: [{label: 'Add Distance', isSubmitButton: true}],
                    validation: z.object({
                        distance: stringToNumberValidation,
                    }),
                },
            },
            {
                icon: <Odometer style={styles.icon} />,
                label: 'Record Odometer',
                popup: {
                    inputs: [
                        {
                            label: 'Start Odometer',
                            placeholder: 'Enter start odometer',
                            id: 'odemeterStart',
                            props: {
                                keyboardType: 'number-pad',
                            },
                        },
                        {
                            label: 'End Odometer',
                            placeholder: 'Enter end odometer',
                            id: 'odemeterEnd',
                            props: {
                                keyboardType: 'number-pad',
                            },
                        },
                    ],
                    buttons: [{label: 'Add Distance', isSubmitButton: true, isDraftButton: true}],
                    validation: z.object({
                        odemeterStart: stringToNumberValidation,
                        odemeterEnd: z
                            .string()
                            .transform(val => (val === '' ? undefined : parseInt(val)))
                            .optional()
                            .pipe(
                                z
                                    .number({
                                        invalid_type_error: 'Please enter a valid number',
                                    })
                                    .nonnegative(MISSING_VALUE)
                                    .optional(),
                            ),
                    }),
                    pretext:
                        'The odometer, usually shown on the LED display behind the steering wheel, indicates the total distance the car has traveled.',
                },
            },
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
