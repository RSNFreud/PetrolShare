import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import {Text} from './text';

const styles = StyleSheet.create({
    logo: {
        marginTop: Constants.statusBarHeight + 60,
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export const Header = () => (
    <Text style={styles.logo} bold>
        PetrolShare
    </Text>
);
