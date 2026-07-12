import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {Text} from '@components/layout/text';
import {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {GroupSettings} from './groupSettings';
import {JoinGroup} from './joinGroup';
import {PageContext, PageManager} from '@components/layout/pageManager';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    text: {
        lineHeight: 24,
    },
});

export const StartScreenContent = () => {
    const {setPopupData} = useContext(AppContext);
    const {setPage, page} = useContext(PageContext);

    const handleButtonPress = (screen: number) => {
        setPage(screen);
    };

    useEffect(() => {
        if (page !== 0) return;
        setPopupData({
            stickyButton: (
                <>
                    <Button onPress={() => handleButtonPress(1)}>Create Group</Button>
                    <Button onPress={() => handleButtonPress(2)}>Join Group</Button>
                </>
            ),
            minContentHeight: 456,
        });
    }, [page]);

    return null;
};

export const StartScreen = () => {
    const Default = () => (
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

    return (
        <PageManager pages={[<Default />, <GroupSettings isCreating />, <JoinGroup />]}>
            <StartScreenContent />
        </PageManager>
    );
};
