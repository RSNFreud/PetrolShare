import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useContext} from 'react';
import {Text} from '../layout/text';
import {Logout} from './logout';
import {Chevron} from 'src/icons/chevron';
import {Colors} from '@constants/colors';
import {convertToSentanceCase} from 'src/hooks/common';
import {AppContext} from '@components/appContext/context';

const POPUP_IDS = {
    LOGOUT: 'logout',
    DEFAULT: '',
} as const;

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        color: 'white',
        width: 12,
    },
    items: {
        gap: 15,
        marginBottom: 30,
    },
    horizontalLine: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.border,
        marginTop: 10,
    },
    destructionActions: {
        gap: 15,
    },
    actionText: {
        fontSize: 14,
    },
    destructionText: {
        color: Colors.red,
        fontSize: 14,
    },
});
type PopupIDType = (typeof POPUP_IDS)[keyof typeof POPUP_IDS];

type ItemType = {
    title: string;
    id: PopupIDType;
};

const items: ItemType[] = [
    {
        title: 'My Details',
        id: POPUP_IDS.DEFAULT,
    },
    {title: 'Change Password', id: POPUP_IDS.DEFAULT},
];

const destructionItems: ItemType[] = [
    {
        title: 'Sign out',
        id: POPUP_IDS.LOGOUT,
    },
    {title: 'Delete your account', id: POPUP_IDS.DEFAULT},
];

const getPopup = (id: PopupIDType) =>
    ({
        [POPUP_IDS.LOGOUT]: <Logout />,
        [POPUP_IDS.DEFAULT]: <></>,
    })[id];

export const Settings = () => {
    const {setPopupData} = useContext(AppContext);

    const handleClick = (item: ItemType) => {
        const sentanceTitle = item.title
            .split(' ')
            .map(str => convertToSentanceCase(str))
            .join(' ');
        setPopupData({isVisible: true, title: sentanceTitle, content: getPopup(item.id)});
    };

    return (
        <>
            <View style={styles.items}>
                {items.map(item => (
                    <View key={item.title}>
                        <TouchableOpacity style={styles.item} onPress={() => handleClick(item)}>
                            <Text style={styles.actionText} bold>
                                {item.title}
                            </Text>
                            <Chevron style={styles.icon} />
                        </TouchableOpacity>
                        <View style={styles.horizontalLine} />
                    </View>
                ))}
            </View>
            <View style={styles.destructionActions}>
                {destructionItems.map(item => (
                    <View key={item.title}>
                        <TouchableOpacity style={styles.item} onPress={() => handleClick(item)}>
                            <Text style={styles.destructionText} bold>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </>
    );
};
