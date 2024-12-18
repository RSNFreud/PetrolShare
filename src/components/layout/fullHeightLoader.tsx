import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {FC} from 'react';
import {Colors} from '@constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
    },
});

export const FullHeightLoader: FC = () => (
    <View style={styles.container}>
        <ActivityIndicator color={Colors.tertiary} size={'large'} />
    </View>
);
