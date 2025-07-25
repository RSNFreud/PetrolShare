import {Text} from '@components/text';
import {useRoute} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

export default function NotFoundScreen() {
    const route = useRoute();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>The url {route.path} doesn't exist.</Text>
            <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Go to home screen!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20},
    title: {fontSize: 20, fontWeight: 'bold'},
    link: {marginTop: 15, paddingVertical: 15},
    linkText: {fontSize: 14, color: '#2e78b7'},
});
