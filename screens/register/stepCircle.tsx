import React from 'react';
import {View, StyleSheet, DimensionValue} from 'react-native';

import Tick from '../../assets/icons/tick';
import Colors from '../../constants/Colors';

type PropTypes = {
    active?: boolean;
    width: DimensionValue;
    withBar?: boolean;
    barHighlight?: boolean;
};

export const StepCircle = ({active, width, withBar = true, barHighlight = true}: PropTypes) => {
    const styles = StyleSheet.create({
        circle: {
            height: 30,
            width: 30,
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            backgroundColor: active ? Colors.tertiary : Colors.secondary,
        },
        bar: {
            height: 4,
            backgroundColor: active && barHighlight ? Colors.tertiary : Colors.secondary,
            width,
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return (
        <View style={styles.wrapper}>
            {withBar && <View style={styles.bar} />}
            <View style={styles.circle}>{active && <Tick width="16" height="16" />}</View>
        </View>
    );
};
