import {Colors} from '@constants/colors';
import React, {FC} from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {ButtonBase} from '../buttonBase';
import {Text} from '../text';
import Constants from 'expo-constants';

type PropsType = {
    isVisible: boolean;
    onRequestClose: () => void;
    onClick?: (value: string) => void;
    items: {value: string; label: string}[];
    value?: string;
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: Colors.background,
        opacity: 0.8,
        height: '100%',
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 2,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    dropdownContainer: {
        marginHorizontal: 25,
        marginVertical: 'auto',
        borderRadius: 8,
        backgroundColor: Colors.primary,
        maxHeight: Dimensions.get('window').height - 50 - Constants.statusBarHeight,
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 'auto',
    },
    dropdownItem: {
        padding: 10,
        borderRadius: 4,
    },
    active: {
        backgroundColor: Colors.tertiary,
    },
});

export const DropdownOverlay: FC<PropsType> = ({
    isVisible,
    onRequestClose,
    items,
    onClick,
    value,
}) => {
    return (
        <Modal transparent visible={isVisible} animationType="none" onRequestClose={onRequestClose}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onRequestClose} touchSoundDisabled>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.dropdownContainer}>
                <FlatList
                    data={items}
                    keyExtractor={({value}) => value}
                    extraData={value}
                    keyboardShouldPersistTaps="always"
                    renderItem={({item}) => (
                        <ButtonBase
                            style={{
                                ...styles.dropdownItem,
                                ...(value === item.value ? styles.active : {}),
                            }}
                            key={item.value}
                            onPress={() => onClick?.(item.value)}
                        >
                            <Text bold>{item.label}</Text>
                        </ButtonBase>
                    )}
                />
            </View>
        </Modal>
    );
};
