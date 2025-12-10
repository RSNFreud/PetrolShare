import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {z} from 'zod';
import {useRouter} from 'expo-router';
import {CUSTOM_POPUPS_ID, getCustomPopups, getMenuOptions, MenuType, POPUP_IDS} from './constants';
import {PopupWrapper} from './components/dashboardPopup';
import {dropdown, input} from './components/popupHelpers';
import {useMemberRequest} from './hooks';
import {ApplicationStoreType} from 'src/reducers';
import {AppContext} from '@components/appContext/context';
import {Colors} from '@constants/colors';
import {Text} from '@components/layout/text';
import {ButtonBase} from '@components/layout/buttonBase';

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
    menuTextContainer: {
        flexDirection: 'row',
        gap: 5,
        alignContent: 'center',
        alignItems: 'center',
    },
    notificationDot: {
        width: 10,
        height: 10,
        borderRadius: 1000,
        backgroundColor: Colors.tertiary,
    },
});

export type PopupType = {
    id: string;
    children: {
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
    const {navigate} = useRouter();
    const {userData, hasSavedOdometer} = useSelector(
        (store: ApplicationStoreType) => ({
            userData: store.auth,
            hasSavedOdometer: Boolean(store.odometer.odometerStart),
        }),
        shallowEqual,
    );
    const {setPopupData, popupData} = useContext(AppContext);
    const [selectedPopupID, setSelectedPopupID] = React.useState<string | null>(null);
    const memberList = useMemberRequest(
        userData.userID,
        popupData.isVisible && selectedPopupID === POPUP_IDS.ASSIGN_DISTANCE,
    );
    const data = getMenuOptions();

    const validatePopupData = async (popup: PopupType): Promise<PopupType> => {
        switch (popup.id) {
            case POPUP_IDS.ASSIGN_DISTANCE:
                return {
                    ...popup,
                    children: [
                        dropdown('User:', 'Choose a username', 'username', memberList || []),
                        input('Distance to apply:', 'Enter total distance', 'totalDistance', {
                            keyboardType: 'number-pad',
                        }),
                    ],
                };

            default:
                return popup;
        }
    };

    const onClick = async ({label, popup, link, customPopupId}: MenuType) => {
        setSelectedPopupID(popup?.id || null);
        switch (true) {
            case Boolean(popup):
                const popupData = await validatePopupData(popup as PopupType);
                setPopupData({
                    isVisible: true,
                    title: label,
                    content: <PopupWrapper data={popupData} />,
                });
                break;
            case Boolean(link):
                navigate({pathname: `./${link}`});
                break;
            case Boolean(customPopupId):
                setPopupData({
                    isVisible: true,
                    title: label,
                    content: getCustomPopups(
                        customPopupId as (typeof CUSTOM_POPUPS_ID)[keyof typeof CUSTOM_POPUPS_ID],
                    ),
                });
                break;
            default:
                break;
        }
    };

    const shouldShowNotificationDot = (popupID?: string) => {
        switch (true) {
            case popupID === POPUP_IDS.ODOMETER && hasSavedOdometer:
                return true;

            default:
                return false;
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
                {data?.map(menuTab => (
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
                                        <View style={styles.menuTextContainer}>
                                            <Text bold style={styles.menuText}>
                                                {menuItem.label}
                                            </Text>
                                            {shouldShowNotificationDot(menuItem?.popup?.id) && (
                                                <View style={styles.notificationDot} />
                                            )}
                                        </View>
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
