import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {ButtonBase} from '@components/layout/buttonBase';
import {Text} from '@components/layout/text';
import {APP_ADDRESS} from '@constants/api-routes';
import {FC, useContext, useEffect} from 'react';
import {Share, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Share as ShareIcon} from 'src/icons/share';
import {getUserData} from 'src/selectors/common';

type PropsType = {
    groupID: string;
    isSticky?: boolean;
    isGroupCreation?: boolean;
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
        marginBottom: 25,
    },
    groupID: {
        gap: 10,
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'center',
    },
    groupIDText: {
        fontSize: 32,
    },
    text: {
        lineHeight: 26,
    },
});

export const GroupInformation: FC<PropsType> = ({groupID, isGroupCreation, isSticky}) => {
    const userInfo = useSelector(getUserData);
    const {setPopupData} = useContext(AppContext);

    const StartDriving = () => (
        <Button onPress={() => setPopupData({isVisible: false})}>Start Driving</Button>
    );

    useEffect(() => {
        if (!isSticky) return;

        setPopupData({stickyButton: <StartDriving />});
    }, [isSticky]);
    return (
        <>
            <View style={styles.container}>
                {isGroupCreation && (
                    <Text style={styles.text}>
                        Thank you for creating a group with PetrolShare {userInfo.fullName}.
                    </Text>
                )}
                <Text>Your Group ID number is:</Text>
                <View style={styles.groupID}>
                    <Text style={styles.groupIDText} bold>
                        {groupID}
                    </Text>
                    <ButtonBase
                        onPress={() =>
                            Share.share({
                                message: `Hey! Let’s track our petrol expenses together on PetrolShare.\nUse this link to join my group:\n${APP_ADDRESS}short/referral?groupID=${groupID}`,
                                title: 'Invite to PetrolShare',
                            })
                        }
                    >
                        <ShareIcon width={26} height={26} color={'white'} />
                    </ButtonBase>
                </View>
                <Text style={styles.text}>
                    Share this ID number with other group members to add them to your account. You
                    can invite other people to your group at any time by clicking the “Invite User”
                    button.
                </Text>
            </View>
            {!isSticky && <StartDriving />}
        </>
    );
};
