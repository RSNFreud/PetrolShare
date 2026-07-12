import {AppContext} from '@components/appContext/context';
import {PageContext} from '@components/layout/pageManager';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {useContext} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {convertToSentanceCase} from 'src/hooks/common';
import {Chevron} from 'src/icons/chevron';
import {SETTINGS} from './constants';

type ItemType = {
    title: string;
    id: number;
};

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

const items: ItemType[] = [
    {
        title: 'My Details',
        id: SETTINGS.MY_DETAILS,
    },
    {title: 'Change Password', id: SETTINGS.CHANGE_PASSWORD},
];

const destructionItems: ItemType[] = [
    {
        title: 'Sign out',
        id: SETTINGS.LOGOUT,
    },
    {title: 'Delete your account', id: SETTINGS.DEFAULT},
];

export const DefaultSettings = () => {
    const {setPopupData} = useContext(AppContext);
    const {setPage} = useContext(PageContext);
    const handleClick = (item: ItemType) => {
        const sentanceTitle = item.title
            .split(' ')
            .map(str => convertToSentanceCase(str))
            .join(' ');
        setPopupData({isVisible: true, title: sentanceTitle});
        setPage(item.id);
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
