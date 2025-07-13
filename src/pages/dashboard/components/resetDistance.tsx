import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {Text} from '@components/layout/text';
import {ENDPOINTS} from '@constants/endpoints';
import {updateData} from '@pages/login/reducers/auth';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {getDistanceFormat, getUserData} from 'src/selectors/common';

const styles = StyleSheet.create({
    title: {fontSize: 18, lineHeight: 27, marginBottom: 10},
    text: {lineHeight: 24},
    buttons: {flexDirection: 'row', alignContent: 'center', gap: 15, marginTop: 30},
    button: {flex: 1},
});

export const ResetDistance = () => {
    const {setPopupData} = useContext(AppContext);
    const distance = useSelector(getDistanceFormat);
    const {groupID} = useSelector(getUserData);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleReset = async () => {
        setIsLoading(true);
        const res = await sendPostRequest(ENDPOINTS.RESET_DISTANCE, {groupID});
        let content = <></>;
        if (!res?.ok) {
            content = <>We couldn't reset the distance right now. Please try again shortly.</>;
        } else {
            content = (
                <>
                    Your group distance has been successfully{'\n'}reset to 0 {distance}.
                </>
            );
        }
        setPopupData({content: <Text style={{lineHeight: 24}}>{content}</Text>});
        setIsLoading(false);
        dispatch(updateData());
    };

    return (
        <>
            <Text bold style={styles.title}>
                Are you sure you want to reset{'\n'}the group distance?
            </Text>
            <Text style={styles.text}>
                This action will reset the distance for the entire group back to 0 and start a new
                session.
                {'\n'}
                {'\n'}A session is the period during which the group tracks and manages distances.
                Resetting will clear all current data and begin a new period.
            </Text>
            <View style={styles.buttons}>
                <Button loading={isLoading} style={styles.button} color="red" onPress={handleReset}>
                    Yes
                </Button>
                <Button
                    loading={isLoading}
                    style={styles.button}
                    onPress={() => setPopupData({isVisible: false})}
                >
                    No
                </Button>
            </View>
        </>
    );
};
