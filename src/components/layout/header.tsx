import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {Text} from './text';
import Constants from 'expo-constants';
import {Cog} from 'src/icons/cog';
import {Colors} from '@constants/colors';
import {useContext} from 'react';
import {PopupContext} from 'src/popup/context';
import {Settings} from '@components/settings/settings';

const styles = StyleSheet.create({
    logo: {
        fontSize: 26,
    },
    container: {
        marginTop: Constants.statusBarHeight + 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
    },
    button: {
        borderRadius: 4,
        borderColor: Colors.border,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    cog: {
        color: 'white',
        width: 14,
        height: 14,
    },
});

export const Header = () => {
    const {setPopupData} = useContext(PopupContext);

    const openSettings = () => {
        setPopupData({
            isVisible: true,
            title: 'Settings',
            content: <Settings />,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo} bold>
                PetrolShare
            </Text>
            <TouchableHighlight style={styles.button} onPress={openSettings}>
                <Cog style={styles.cog} />
            </TouchableHighlight>
        </View>
    );
};
