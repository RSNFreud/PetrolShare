import Popup from '@components/Popup';
import {Breadcrumbs, Seperator} from '@components/Themed';
import Button, {TouchableBase} from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import {Text} from '@components/text';
import {useRouter} from 'expo-router';
import {sendPostRequest} from 'hooks/sendFetchRequest';
import {useContext, useEffect, useRef, useState} from 'react';
import {TouchableWithoutFeedback, View, ActivityIndicator, ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';

import SubmitButton from './submitButton';
import Bin from '../../assets/icons/bin';
import Pencil from '../../assets/icons/pencil';
import Plus from '../../assets/icons/plus';
import Colors from '../../constants/Colors';
import {deleteItem, getItem, sendCustomEvent, setItem} from '../../hooks';
import {AuthContext} from '../../hooks/context';
import {sendRequestToBackend} from 'hooks/sendRequestToBackend';

type PresetType = {
    presetName: string;
    distance: string;
    presetID: number;
};
export default () => {
    const [data, setData] = useState<{selectedPreset: null | number}>({
        selectedPreset: null,
    });
    const [errors, setErrors] = useState('');
    const [distance, setDistance] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const {retrieveData} = useContext(AuthContext);
    const navigation = useRouter();
    const [presets, setPresets] = useState<PresetType[] | null>(null);
    const [presetFormData, setPresetFormData] = useState({
        presetID: '',
        presetName: '',
        distance: '',
    });
    const [presetFormErrors, setPresetFormErrors] = useState({
        presetName: '',
        distance: '',
    });
    const [popupType, setPopupType] = useState('new');
    const selectedToDelete = useRef('');
    const getPresets = async () => {
        const currentPresets = getItem('presets');

        if (currentPresets) {
            setPresets(JSON.parse(currentPresets));
        }

        if (retrieveData) {
            const res = await sendRequestToBackend({
                url: `preset/get?authenticationKey=${retrieveData?.authenticationKey}`,
            });

            if (res?.ok) {
                const data = await res.json();
                setPresets(data);
                setItem('presets', JSON.stringify(data));
            }
        }
    };

    useEffect(() => {
        if (data.selectedPreset && presets) {
            const filtered: PresetType[] = presets.filter(
                (e: any) => e.presetID === data.selectedPreset,
            );
            setDistance(filtered[0].distance);
        } else {
            setDistance('');
        }
    }, [data, presets]);

    useEffect(() => {
        if (retrieveData && retrieveData?.authenticationKey) getPresets();
        const getDraft = async () => {
            const draft = getItem('draft');
            if (draft) {
                setData({...JSON.parse(draft)});
            }
        };
        getDraft();
    }, [retrieveData]);

    const handleSubmit = async () => {
        setErrors('');
        if (!data.selectedPreset) {
            return setErrors('Please select a preset');
        }

        let distance;

        if (data.selectedPreset && presets) {
            const filtered: PresetType[] = presets.filter(
                (e: any) => e.presetID === data.selectedPreset,
            );
            distance = filtered[0].distance;
        }
        if (!distance || parseInt(distance, 10) <= 0)
            return setErrors('Please enter a distance above 0!');

        if (!retrieveData) return;
        setLoading(true);
        const res = await sendPostRequest(`distance/add`, {
            distance,
            authenticationKey: retrieveData?.authenticationKey,
        });
        if (res?.ok) {
            setLoading(false);
            deleteItem('draft');
            sendCustomEvent('sendAlert', 'Distance successfully updated!');
            navigation.navigate('/');
        }
    };
    const openPopup = (type?: string, id?: string) => {
        setPopupType(type || 'new');
        setVisible(true);
        if (id) selectedToDelete.current = id;
    };

    const deletePreset = async () => {
        const res = await sendPostRequest('preset/delete', {
            presetID: selectedToDelete.current,
            authenticationKey: retrieveData?.authenticationKey,
        });
        if (res?.ok) {
            setVisible(false);
            Toast.show({
                type: 'default',
                text1: 'Preset successfully deleted!',
            });
            setTimeout(() => {
                getPresets();
            }, 300);
        }
    };

    const handleEdit = (id: number) => {
        if (!presets) return;
        const item: any = presets.filter((e: PresetType) => e.presetID === id);
        if (!item) return;
        setPresetFormData(item[0]);
        openPopup('new');
    };

    const handlePresetSubmit = async () => {
        const errors: any = {};
        Object.entries(presetFormData).map(([key, value]) => {
            if (key === 'presetID') return;
            if (!value) errors[key] = 'Please complete this field!';

            if (key === 'distance' && !/^[0-9.]*$/.test(value)) {
                errors[key] = 'Please enter a valid numerical value!';
            }
        });
        setPresetFormErrors(errors);

        if (!Object.keys(errors).length && retrieveData) {
            if (presetFormData.presetID) {
                const res = await sendPostRequest('preset/edit', {
                    presetID: presetFormData.presetID,
                    presetName: presetFormData.presetName,
                    distance: presetFormData.distance,
                    authenticationKey: retrieveData?.authenticationKey,
                });
                if (res?.ok) {
                    setVisible(false);
                    Toast.show({
                        type: 'default',
                        text1: 'Preset successfully edited!!',
                    });
                    getPresets();
                }
            } else {
                const res = await sendPostRequest('preset/add', {
                    presetName: presetFormData.presetName,
                    distance: presetFormData.distance,
                    authenticationKey: retrieveData?.authenticationKey,
                });
                if (res?.ok) {
                    setVisible(false);
                    Toast.show({
                        type: 'default',
                        text1: 'Preset successfully added!',
                    });
                    getPresets();
                }
            }
        }
    };
    return (
        <Layout noScrollView noBottomPadding>
            <Breadcrumbs
                links={[
                    {
                        name: 'Dashboard',
                        screenName: '/',
                    },
                    {
                        name: 'Presets',
                    },
                ]}
            />
            <View
                style={{
                    position: 'relative',
                    flex: 1,
                }}
            >
                <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 55}}>
                    <View
                        style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <View>
                            <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 25}}>
                                Presets:
                            </Text>
                            <Button
                                style={{backgroundColor: Colors.secondary}}
                                icon={<Plus width="11" height="11" />}
                                handleClick={() => {
                                    setPresetFormData({
                                        presetID: '',
                                        presetName: '',
                                        distance: '',
                                    });
                                    openPopup('new');
                                }}
                                text="Add Preset"
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <View
                                style={{
                                    position: 'relative',
                                    marginVertical: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        height: 20,
                                        backgroundColor: Colors.background,
                                        zIndex: 2,
                                        position: 'relative',
                                        width: 'auto',
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    OR
                                </Text>
                                <Seperator style={{position: 'absolute', top: 10}} />
                            </View>
                            {presets === null && (
                                <ActivityIndicator size="large" color={Colors.tertiary} />
                            )}
                            {presets &&
                                Boolean(presets.length) &&
                                presets.map((e: PresetType) => {
                                    return (
                                        <TouchableWithoutFeedback
                                            onPress={() =>
                                                setData({
                                                    ...data,
                                                    selectedPreset:
                                                        data.selectedPreset === e.presetID
                                                            ? null
                                                            : e.presetID,
                                                })
                                            }
                                            key={e.presetName}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: Colors.primary,
                                                    borderStyle: 'solid',
                                                    borderWidth: 1,
                                                    borderColor:
                                                        data.selectedPreset === e.presetID
                                                            ? Colors.tertiary
                                                            : Colors.border,
                                                    borderRadius: 4,
                                                    height: 50,
                                                    marginBottom: 15,
                                                    padding: 2,
                                                    paddingLeft: 15,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View style={{paddingVertical: 12}}>
                                                    <Text
                                                        style={{fontSize: 16, fontWeight: 'bold'}}
                                                    >
                                                        {e.presetName} ({e.distance}{' '}
                                                        {retrieveData?.distance})
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        height: '100%',
                                                        backgroundColor: Colors.secondary,
                                                    }}
                                                >
                                                    <TouchableBase
                                                        style={{
                                                            flexDirection: 'row',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignContent: 'center',
                                                            paddingHorizontal: 15,
                                                            alignItems: 'center',
                                                            height: '100%',
                                                            width: 49,
                                                        }}
                                                        handleClick={() => handleEdit(e.presetID)}
                                                        analyticsLabel="Edit"
                                                    >
                                                        <Pencil width="16" height="16" />
                                                    </TouchableBase>
                                                    <View
                                                        style={{
                                                            width: 1,
                                                            height: 28,
                                                            backgroundColor: Colors.border,
                                                        }}
                                                    />
                                                    <TouchableBase
                                                        style={{
                                                            paddingHorizontal: 15,
                                                            flexDirection: 'row',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            height: '100%',
                                                            width: 49,
                                                            alignItems: 'center',
                                                            alignContent: 'center',
                                                        }}
                                                        handleClick={() =>
                                                            openPopup(
                                                                'delete',
                                                                e.presetID.toString(),
                                                            )
                                                        }
                                                        analyticsLabel="Delete"
                                                    >
                                                        <Bin
                                                            width="16"
                                                            height="16"
                                                            color={Colors.red}
                                                        />
                                                    </TouchableBase>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    );
                                })}
                            {presets && Boolean(presets?.length === 0) && (
                                <Text style={{fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                                    You have no saved presets! Create some by clicking the button
                                    above.
                                </Text>
                            )}
                            {Boolean(presets?.length) && (
                                <SubmitButton
                                    disabled={!distance}
                                    loading={loading}
                                    handleClick={handleSubmit}
                                    errors={errors}
                                    distance={distance}
                                />
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>

            <Popup
                visible={visible}
                title="Preset Management"
                handleClose={() => {
                    setVisible(false);
                }}
            >
                {popupType !== 'new' ? (
                    <>
                        <Text style={{marginBottom: 20, fontSize: 18, fontWeight: 'bold'}}>
                            Are you sure you want to delete this preset?
                        </Text>
                        <Button
                            handleClick={() => deletePreset()}
                            style={{marginBottom: 15}}
                            text="Yes"
                        />
                        <Button variant="ghost" handleClick={() => setVisible(false)} text="No" />
                    </>
                ) : (
                    <>
                        <Input
                            label="Preset Name"
                            handleInput={e => setPresetFormData({...presetFormData, presetName: e})}
                            value={presetFormData.presetName}
                            errorMessage={presetFormErrors.presetName}
                            placeholder="Enter name"
                            style={{marginBottom: 20}}
                        />
                        <Input
                            label="Preset distance"
                            value={presetFormData.distance.toString()}
                            placeholder="Enter distance"
                            handleInput={e => setPresetFormData({...presetFormData, distance: e})}
                            errorMessage={presetFormErrors.distance}
                            style={{marginBottom: 30}}
                        />
                        <Button handleClick={handlePresetSubmit} text="Save Preset" />
                    </>
                )}
            </Popup>
        </Layout>
    );
};
