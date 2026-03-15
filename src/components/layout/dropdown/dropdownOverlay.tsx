import React, {FC, useMemo, useState} from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Constants from 'expo-constants';
import {ButtonBase} from '../buttonBase';
import {Text} from '../text';
import {Input} from '../input';
import {Colors} from '@constants/colors';

type PropsType = {
    isVisible: boolean;
    hasSearchBar?: boolean;
    onRequestClose: () => void;
    onSubmitEditing?: () => void;
    onClick?: (value: string) => void;
    items?: {value: string; label: string}[];
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
    const [searchText, setSearchText] = useState('');
    const filteredItems = useMemo(() => {
        return items?.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()));
    }, [items, searchText]);

    const handleClick = (value: string) => {
        onSubmitEditing?.();
        onClick?.(value);
    };

    return (
        <Modal transparent visible={isVisible} animationType="none" onRequestClose={onRequestClose}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onRequestClose} touchSoundDisabled>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.dropdownContainer}>
                {hasSearchBar && (
                    <View style={styles.searchBox}>
                        <Input
                            placeholder="Enter name"
                            style={styles.input}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                )}
                <FlatList
                    data={filteredItems}
                    keyExtractor={({value}) => value}
                    extraData={value}
                    keyboardShouldPersistTaps="handled"
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
