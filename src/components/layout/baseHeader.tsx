import {StyleSheet} from 'react-native';
import {Text} from './text';

const styles = StyleSheet.create({
    logo: {marginTop: 100, fontSize: 26, textAlign: 'center', marginBottom: 20},
});

export const Header = () => (
    <Text style={styles.logo} bold>
        PetrolShare
    </Text>
);
