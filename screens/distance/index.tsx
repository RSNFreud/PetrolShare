import Popup from '@components/Popup';
import {LongButton} from '@components/Themed';
import {useRouter} from 'expo-router';
import {sendPostRequest} from 'hooks/sendFetchRequest';
import React, {JSX, useContext, useState} from 'react';
import Toast from 'react-native-toast-message';

import AssignDistance from './assignDistance';
import Manual from './manual';
import Odometer from './odometer';
import Keypad from '../../assets/icons/keypad';
import List from '../../assets/icons/list';
import OdomoterIcon from '../../assets/icons/odometer';
import Reset from '../../assets/icons/reset';
import Road from '../../assets/icons/road';
import {deleteItem, getItem, Alert, sendCustomEvent} from '../../hooks';
import {AuthContext} from '../../hooks/context';

export default ({onUpdate}: {onUpdate?: () => void}) => {
    const [popupData, setPopupData] = useState(<></>);
    const [title, setTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({startValue: '', endValue: ''});
    const {retrieveData} = useContext(AuthContext);
    const {navigate} = useRouter();
    const [isDraft, setIsDraft] = useState(false);

    const openPopup = (element: JSX.Element, title: string) => {
        setPopupData(element);
        setVisible(true);
        setTitle(title);
    };

    const getDraft = async () => {
        const draft = getItem('draft');

        if (draft && draft != null) {
            setData({...JSON.parse(draft)});
            Toast.show({type: 'default', text1: 'Recovered draft data!'});
            setIsDraft(true);
            openPopup(
                <Odometer
                    previousData={{...JSON.parse(draft)}}
                    handleClose={() => handleClose()}
                />,
                'Record Odometer',
            );
        } else {
            openPopup(
                <Odometer previousData={data} handleClose={handleClose} />,
                'Record Odometer',
            );
        }
    };

    const resetDistance = async () => {
        Alert(
            'Are you sure you want to reset your distance?',
            'This will reset your distance back to 0 without creating a payment log!',
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        const res = await sendPostRequest(`distance/reset`, {
                            authenticationKey: retrieveData?.authenticationKey,
                        });
                        if (res?.ok) {
                            sendCustomEvent('sendAlert', 'Reset your distance back to 0!');
                            if (onUpdate) onUpdate();
                        }
                    },
                },
                {text: 'No', style: 'cancel'},
            ],
        );
    };
    const sendAlert = (text: string) => {
        Toast.show({text1: text, type: 'default'});
    };

    const handleClose = (alert?: string) => {
        const draft = getItem('draft');
        if (alert) sendAlert(alert);

        if (!isDraft) {
            if (onUpdate) onUpdate();
            return setVisible(false);
        }
        if (draft)
            Alert('Do you want to delete this draft?', undefined, [
                {
                    text: 'Yes',
                    onPress: async () => {
                        deleteItem('draft');
                        setVisible(false);
                        setIsDraft(false);
                        sendAlert('Draft deleted!');
                        setData({startValue: '', endValue: ''});
                    },
                },
                {
                    text: 'Save for later',
                    onPress: () => {
                        setVisible(false);
                    },
                    style: 'cancel',
                },
            ]);
    };

    return (
        <>
            <LongButton
                handleClick={() =>
                    openPopup(<Manual handleClose={handleClose} />, 'Add Specfic Distance')
                }
                text="Add Specific Distance"
                icon={<Keypad width="20" height="20" />}
            />
            <LongButton
                handleClick={() => getDraft()}
                text="Record Odometer"
                icon={<OdomoterIcon width="20" height="20" />}
            />

            <LongButton
                text="Presets"
                icon={<List width="20" height="20" />}
                // @ts-expect-error
                handleClick={() => navigate('addPreset')}
            />
            <LongButton
                text="Assign Distance"
                icon={<Road width="20" height="20" />}
                handleClick={() =>
                    openPopup(<AssignDistance handleClose={handleClose} />, 'Assign Distance')
                }
            />
            <LongButton
                last
                handleClick={resetDistance}
                text="Reset Distance"
                icon={<Reset width="20" height="20" />}
            />
            <Popup
                visible={visible}
                handleClose={() => handleClose()}
                children={popupData}
                animate={!isDraft}
                title={title}
            />
        </>
    );
};
