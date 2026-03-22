import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {Text} from '@components/layout/text';
import {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {GroupSettings} from './groupSettings';
import {JoinGroup} from './joinGroup';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    text: {
        lineHeight: 24,
    },
});

export const StartScreen = () => {
    const {setPopupData} = useContext(AppContext);

    const setScreen = (screen: 'join' | 'create') => {
        switch (screen) {
            case 'create':
                return <GroupSettings isCreating />;
            case 'join':
            default:
                return <JoinGroup />;
        }
    };

    const handleButtonPress = (screen: 'join' | 'create') => {
        setPopupData({
            content: setScreen(screen),
        });
    };

    useEffect(() => {
        setPopupData({
            stickyButton: (
                <>
                    <Button onPress={() => handleButtonPress('create')}>Create Group</Button>
                    <Button onPress={() => handleButtonPress('join')}>Join Group</Button>
                </>
            ),
        });
    }, []);

    return (
        <>
            <Text style={styles.title} bold>
                Welcome to PetrolShare!
            </Text>
            <Text style={styles.text}>
                To start using the app, either select "Join Group" and enter the code or link
                provided by a group member (obtained by clicking the "Invite User" button on the
                dashboard), or choose "Create Group."
            </Text>
        </>
    );
};
