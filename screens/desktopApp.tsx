import Button from '@components/button';
import SplitRow from '@components/splitRow';
import {Text} from '@components/text';
import {Linking, StyleSheet, View} from 'react-native';

export const DesktopApp = () => {
    const openPlay = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.rsnfreud.PetrolShare');
    };
    const openIOS = () => {
        Linking.openURL('https://testflight.apple.com/join/uzat04AX');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>This app is not available on the web.</Text>
            <Text style={styles.text}>Please download the app from the app store!</Text>
            <SplitRow
                style={{width: '100%', gap: 15, marginTop: 25}}
                elements={[
                    <Button size="medium" handleClick={openPlay}>
                        Google Play
                    </Button>,
                    <Button size="medium" handleClick={openIOS}>
                        Apple
                    </Button>,
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 20,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
    },
});
