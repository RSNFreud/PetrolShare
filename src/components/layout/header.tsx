import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {useContext} from 'react';
import {Text} from './text';
import {Cog} from 'src/icons/cog';
import {Colors} from '@constants/colors';
import {Settings} from '@components/settings/settings';
import {AppContext} from '@components/appContext/context';

const styles = StyleSheet.create({
    logo: {
        fontSize: 26,
    },
    container: {
        marginTop: 30,
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
    const {setPopupData} = useContext(AppContext);

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
