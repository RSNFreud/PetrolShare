import {StyleSheet} from 'react-native';
import {Text} from './text';
import Constants from 'expo-constants';

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
