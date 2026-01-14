import {Slot} from 'expo-router';
import {FC} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '@components/layout/text';

const styles = StyleSheet.create({
    logo: {marginTop: 30, fontSize: 26, textAlign: 'center', marginBottom: 20},
});

const Layout: FC = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <Text style={styles.logo} bold>
                    PetrolShare
                </Text>{' '}
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Layout;
