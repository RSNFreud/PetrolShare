import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useFetchPresets} from './hooks';
import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Text} from '@components/layout/text';
import {FullHeightLoader} from '@components/layout/fullHeightLoader';
import {Colors} from '@constants/colors';
import {Button} from '@components/layout/button';

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
    },
});

export const Presets = () => {
    const {data, isLoading} = useFetchPresets();

    if (isLoading) return <FullHeightLoader />;

    return (
        <>
            <Breadcrumbs pages={[{label: 'Dashboard', href: '..'}, {label: 'Presets'}]} />

            {data?.length ? (
                <></>
            ) : (
                <View style={styles.box}>
                    <Text style={{lineHeight: 26}}>
                        You have no saved presets! Create some by clicking the button below.
                    </Text>
                    <Button style={styles.button}>Create New Preset</Button>
                </View>
            )}
        </>
    );
};
