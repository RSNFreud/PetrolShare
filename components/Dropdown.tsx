import Constants from 'expo-constants';
import {useEffect, useRef, useState} from 'react';
import {View, ViewProps, Dimensions, Modal, TouchableWithoutFeedback, FlatList} from 'react-native';

import Input from './input';
import {Text} from './text';
import ChevronRight from '../assets/icons/chevronRight';
import Colors from '../constants/Colors';

export type item = {name: string; value: string; symbol?: string};

type PropsType = {
    data: item[];
    value?: string;
    handleSelected: (e: {label: string; value: string}) => void;
    errorMessage?: string;
    placeholder: string;
    inputStyle?: ViewProps['style'];
    style?: ViewProps['style'];
    hiddenValue?: boolean;
    hasBottomMargin?: boolean;
    label?: string;
    search?: boolean;
};

export default ({
    data,
    value,
    search,
    handleSelected,
    errorMessage,
    placeholder,
    hiddenValue,
    label,
    style,
    hasBottomMargin = true,
    inputStyle,
}: PropsType) => {
    const [selected, setSelected] = useState<{
        label: string;
        value: string;
        index?: number;
    }>({label: '', value: ''});
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState(data);
    const [searchInput, setSearchInput] = useState('');
    const ref = useRef<FlatList>(null);

    useEffect(() => {
        if (!data || !value) return;
        const current = data.filter(
            e => e.value.toString() === value || e.name.toString() === value,
        )[0];
        if (!current) return;
        setSelected({label: current?.name || '', value: current.value});
    }, [data, value]);

    useEffect(() => {
        setList(data);
    }, [data]);

    useEffect(() => {
        if (!search) return;
        setList(data.filter(e => e.name.includes(searchInput)));
    }, [searchInput]);

    const click = ({label, value}: {label: string; value: string}) => {
        setVisible(false);
        handleSelected({label, value});
        setSelected({label, value});
    };

    const scrollIntoView = () => {
        if (scrollIndex <= 0 || !ref.current || searchInput.length) return;
        ref.current.scrollToIndex({
            index: scrollIndex || 0,
            animated: true,
            viewPosition: 0.5,
            viewOffset: search ? -50 : 0,
        });
    };

    const scrollIndex = data.findIndex(value => value.value === selected.value);

    const handleSearchInput = (e: string) => {
        setSearchInput(e);
    };

    const _renderDropdown = () => (
        <>
            {search ? (
                <View style={{backgroundColor: Colors.primary}}>
                    <Input
                        placeholder="Search..."
                        value={searchInput}
                        handleInput={handleSearchInput}
                        inputStyle={{
                            backgroundColor: Colors.secondary,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderWidth: 0,
                            marginBottom: 10,
                        }}
                    />
                </View>
            ) : (
                <></>
            )}
            <FlatList
                onLayout={scrollIntoView}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                    <Text style={{textAlign: 'center'}}>
                        There are no results for that search request!
                    </Text>
                )}
                ref={ref}
                style={{
                    flex: 1,
                }}
                onScrollToIndexFailed={scrollIntoView}
                getItemLayout={(_, index) => ({
                    length: 39,
                    offset: 44 * index + 30,
                    index,
                })}
                data={list}
                renderItem={({item}) => {
                    return (
                        <View
                            style={{backgroundColor: Colors.primary, height: 44}}
                            key={item.value}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => click({label: item.name, value: item.value})}
                            >
                                <View
                                    style={{
                                        padding: 10,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        borderColor:
                                            selected.value === item.value
                                                ? Colors.tertiary
                                                : Colors.primary,
                                        borderWidth: 1,
                                        borderStyle: 'solid',
                                        backgroundColor:
                                            selected.value === item.value
                                                ? Colors.tertiary
                                                : Colors.primary,
                                    }}
                                >
                                    <Text>
                                        {item.name}{' '}
                                        {!hiddenValue && item.value ? `(${item.value})` : ''}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    );
                }}
            />
        </>
    );
    return (
        <>
            <View
                style={[
                    {
                        position: 'relative',
                        marginBottom: hasBottomMargin ? 25 : 0,
                    },
                    style,
                ]}
            >
                {!!label && (
                    <Text
                        style={{
                            fontWeight: '700',
                            fontSize: 16,
                            lineHeight: 16,
                            marginBottom: 10,
                            color: 'white',
                        }}
                    >
                        {label}
                    </Text>
                )}
                <Modal
                    transparent
                    visible={visible}
                    animationType="none"
                    onRequestClose={() => setVisible(false)}
                >
                    <View
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 25,
                            flex: 1,
                            height:
                                (Dimensions.get('window').height - Constants.statusBarHeight) * 0.8,
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            elevation: 2,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                height: Dimensions.get('window').height,
                                width: Dimensions.get('window').width,
                                position: 'absolute',
                                left: 0,
                                top: 0,
                            }}
                        />
                        <View
                            style={{
                                backgroundColor: Colors.primary,
                                width: '100%',
                                borderWidth: 0,
                                paddingHorizontal: 10,
                                paddingVertical: 15,
                                borderRadius: 8,
                                flex: 1,
                                maxHeight:
                                    (Dimensions.get('window').height - Constants.statusBarHeight) *
                                    0.9,
                            }}
                        >
                            {_renderDropdown()}
                        </View>
                    </View>
                </Modal>
                <TouchableWithoutFeedback onPress={() => setVisible(() => true)}>
                    <View
                        style={[
                            {
                                height: 53,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignContent: 'center',
                                borderRadius: 4,
                                backgroundColor: Colors.primary,
                                paddingHorizontal: 13,
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: Colors.border,
                            },
                            inputStyle,
                        ]}
                    >
                        <Text>{selected.label || placeholder}</Text>
                        <ChevronRight />
                    </View>
                </TouchableWithoutFeedback>
                {!!errorMessage && (
                    <Text
                        style={{
                            marginTop: 10,
                            fontSize: 14,
                            fontWeight: '400',
                            color: '#FA4F4F',
                        }}
                    >
                        {errorMessage}
                    </Text>
                )}
            </View>
        </>
    );
};
