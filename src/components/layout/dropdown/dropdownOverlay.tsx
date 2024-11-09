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
import {Input} from '../input';

type PropsType = {
    isVisible: boolean;
    hasSearchBar?: boolean;
    onRequestClose: () => void;
    onSubmitEditing?: () => void;
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
        zIndex: 2,
        position: 'relative',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 3,
    },
    dropdownItem: {
        padding: 10,
        borderRadius: 4,
    },
    active: {
        backgroundColor: Colors.tertiary,
    },
    searchBox: {
        paddingBottom: 10,
    },
    input: {
        backgroundColor: Colors.secondary,
    },
});

export const DropdownOverlay: FC<PropsType> = ({
    isVisible,
    onRequestClose,
    items,
    onSubmitEditing,
    onClick,
    value,
    hasSearchBar,
}) => {
    const handleClick = (value: string) => {
        onSubmitEditing?.();
        onClick?.(value);
    };

    const renderSearchbox = () => {
        if (!hasSearchBar) return null;
        return (
            <View style={styles.searchBox}>
                <Input placeholder="Enter name" style={styles.input} />
            </View>
        );
    };

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
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={renderSearchbox}
                    stickyHeaderIndices={hasSearchBar ? [0] : undefined}
                    showsVerticalScrollIndicator
                    renderItem={({item}) => (
                        <View>
                            <ButtonBase
                                style={{
                                    ...styles.dropdownItem,
                                    ...(value === item.value ? styles.active : {}),
                                }}
                                key={item.value}
                                onPress={() => handleClick(item.value)}
                            >
                                <Text bold>{item.label}</Text>
                            </ButtonBase>
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
};
