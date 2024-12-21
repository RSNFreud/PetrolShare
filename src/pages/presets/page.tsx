import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useFetchPresets} from './hooks';
import {PresetBox} from './components/presetBox';
import {PresetPopup} from './components/presetPopup';
import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Text} from '@components/layout/text';
import {FullHeightLoader} from '@components/layout/fullHeightLoader';
import {Colors} from '@constants/colors';
import {Button} from '@components/layout/button';
import {Plus} from 'src/icons/plus';
import {getDistanceFormat} from 'src/selectors/common';
import {AppContext} from '@components/appContext/context';

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
    const {data, isLoading} = useFetchPresets();
    const {setPopupData} = useContext(AppContext);

    const distanceFormat = useSelector(getDistanceFormat);

    const openPopup = (presetData?: {presetName: string; presetDistance: number}) => {
        setPopupData({
            isVisible: true,
            content: <PresetPopup presetData={presetData} />,
            title: 'Preset Management',
        });
    };

    const commonProps = {
        icon: <Plus color="white" height={18} width={18} />,
        onPress: () => openPopup(),
    };

    if (isLoading)
        return (
            <>
                <TopBreadcrumbs />
                <FullHeightLoader />
            </>
        );

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
                    <View>
                        {data.map(preset => (
                            <PresetBox
                                text={`${preset.presetName} (${preset.distance} ${distanceFormat})`}
                                key={preset.presetID}
                                onEdit={() =>
                                    openPopup({
                                        presetName: preset.presetName,
                                        presetDistance: preset.distance,
                                    })
                                }
                            />
                        ))}
                    </View>
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
