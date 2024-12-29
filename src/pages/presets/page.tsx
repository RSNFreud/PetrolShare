import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'expo-router';
import {useFetchPresets} from './hooks';
import {PresetBox} from './components/presetBox';
import {PresetPopup} from './components/presetPopup';
import {PresetType} from './types';
import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Text} from '@components/layout/text';
import {FullHeightLoader} from '@components/layout/fullHeightLoader';
import {Colors} from '@constants/colors';
import {Button} from '@components/layout/button';
import {Plus} from 'src/icons/plus';
import {getDistanceFormat} from 'src/selectors/common';
import {AppContext} from '@components/appContext/context';
import {sendPostRequest} from 'src/hooks/sendRequestToBackend';
import {ENDPOINTS} from '@constants/api-routes';
import {updateData} from '@pages/login/reducers/auth';
import {ApplicationStoreType} from 'src/reducers';

const styles = StyleSheet.create({
    box: {
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingHorizontal: 18,
        paddingVertical: 20,
        borderRadius: 4,
        gap: 15,
        backgroundColor: Colors.secondary,
    },
    button: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    horizontalLine: {
        backgroundColor: Colors.border,
        height: 1,
        flex: 1,
    },
    orText: {
        fontSize: 18,
    },
    orLine: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        gap: 10,
    },
});

const TopBreadcrumbs = () => (
    <Breadcrumbs pages={[{label: 'Dashboard', href: '..'}, {label: 'Presets'}]} />
);

export const Presets = () => {
    const {data, isLoading: isDataLoading, refetch} = useFetchPresets();
    const [selectedPreset, setSelectedPreset] = useState<PresetType | null>();
    const [isLoading, setIsLoading] = useState(false);
    const {navigate} = useRouter();
    const {setPopupData} = useContext(AppContext);
    const dispatch = useDispatch();

    const {distanceFormat, distance} = useSelector(
        (store: ApplicationStoreType) => ({
            distanceFormat: getDistanceFormat(store),
            distance: store.auth.currentMileage,
        }),
        shallowEqual,
    );

    const openPopup = (presetData?: PresetType) => {
        setPopupData({
            isVisible: true,
            content: <PresetPopup presetData={presetData} fetchPresets={refetch} />,
            title: 'Preset Management',
        });
    };

    useEffect(() => {
        if (!selectedPreset) return;
        const selectedPresetData = data?.find(
            preset => preset.presetID === selectedPreset.presetID,
        );
        setSelectedPreset(selectedPresetData);
    }, [data]);

    const commonProps = {
        icon: <Plus color="white" height={18} width={18} />,
        onPress: () => openPopup(),
    };

    if (isDataLoading)
        return (
            <>
                <TopBreadcrumbs />
                <FullHeightLoader />
            </>
        );

    const handleSelect = (preset: PresetType) => {
        if (selectedPreset?.presetID === preset.presetID) return setSelectedPreset(null);
        setSelectedPreset(preset);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const res = await sendPostRequest(ENDPOINTS.ADD_DISTANCE, {
            distance: selectedPreset?.distance,
        });

        if (res?.ok) {
            setTimeout(() => setIsLoading(false), 300);
            dispatch(updateData());
            const newDistance = Number(distance) + Number(selectedPreset?.distance);
            navigate('/');
            setPopupData({
                isVisible: true,
                title: 'Distance Added',
                content: (
                    <Text style={{lineHeight: 24}}>
                        {selectedPreset?.distance} {distanceFormat} has been successfully added to
                        your account! Your current total distance is now {newDistance}{' '}
                        {distanceFormat}.
                    </Text>
                ),
            });
        }
    };

    return (
        <>
            <TopBreadcrumbs />

            {data?.length ? (
                <>
                    <Button
                        style={{...styles.button, backgroundColor: Colors.secondary}}
                        {...commonProps}
                    >
                        Create New Preset
                    </Button>
                    <View style={styles.orLine}>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.orText} bold>
                            OR
                        </Text>
                        <View style={styles.horizontalLine} />
                    </View>
                    <ScrollView contentContainerStyle={{gap: 10}}>
                        {data.map(preset => (
                            <PresetBox
                                selected={selectedPreset?.presetID === preset.presetID}
                                onSelect={() => handleSelect(preset)}
                                text={`${preset.presetName} (${preset.distance} ${distanceFormat})`}
                                key={preset.presetID}
                                onEdit={() =>
                                    openPopup({
                                        presetName: preset.presetName,
                                        distance: preset.distance,
                                        presetID: preset.presetID,
                                    })
                                }
                            />
                        ))}
                    </ScrollView>
                    <Button
                        disabled={!selectedPreset?.distance}
                        loading={isLoading}
                        onPress={handleSubmit}
                    >
                        {selectedPreset?.distance ? (
                            <>
                                Add Distance ({selectedPreset?.distance} {distanceFormat})
                            </>
                        ) : (
                            'Select Distance'
                        )}
                    </Button>
                </>
            ) : (
                <View style={styles.box}>
                    <Text style={{lineHeight: 26}}>
                        You have no saved presets! Create some by clicking the button below.
                    </Text>
                    <Button style={styles.button} {...commonProps}>
                        Create New Preset
                    </Button>
                </View>
            )}
        </>
    );
};
