import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserData} from 'src/selectors/common';

const styles = StyleSheet.create({
    userCard: {
        borderRadius: 8,
        borderColor: Colors.border,
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 10,
        paddingHorizontal: 18,
        gap: 5,
        marginTop: 20,
    },
    username: {
        fontSize: 18,
        fontWeight: 'medium',
    },
    distance: {
        fontWeight: '300',
    },
});

export const Dashboard = () => {
    const userData = useSelector(getUserData);

    return (
        <>
            <View style={styles.userCard}>
                <Text style={styles.username}>{userData.fullName}</Text>
                <Text style={styles.distance}>
                    {userData.currentMileage || 0} {userData.distance}
                </Text>
            </View>
        </>
    );
};
