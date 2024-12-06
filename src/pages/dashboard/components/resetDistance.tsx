import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {Text} from '@components/layout/text';
import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        lineHeight: 27,
        marginBottom: 10,
    },
    text: {
        lineHeight: 24,
    },
    buttons: {
        flexDirection: 'row',
        alignContent: 'center',
        gap: 15,
        marginTop: 30,
    },
    button: {
        flex: 1,
    },
});

export const ResetDistance = () => {
    const {setPopupData} = useContext(AppContext);

    return (
        <>
            <Text bold style={styles.title}>
                Are you sure you want to reset{'\n'}your distance?
            </Text>
            <Text style={styles.text}>
                This action will reset the distance for the entire group back to 0 and start a new
                session.
                {'\n'}
                {'\n'}A session is the period during which the group tracks and manages distances.
                Resetting will clear all current data and begin a new period.
            </Text>
            <View style={styles.buttons}>
                <Button style={styles.button} color="red">
                    Yes
                </Button>
                <Button
                    style={styles.button}
                    variant="ghost"
                    onPress={() => setPopupData({isVisible: false})}
                >
                    No
                </Button>
            </View>
        </>
    );
};
