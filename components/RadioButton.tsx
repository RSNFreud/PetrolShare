import {useEffect, useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {Text} from './text';
import Colors from '../constants/Colors';

type PropsType = {
    buttons: {
        name: string;
        value: string;
        rightSideElement?: React.ReactNode;
    }[];
    value: string;
    handleChange: (value: string) => void;
    errorMessage?: string;
};

const Button = ({active}: {active: boolean}) => {
    const styles = StyleSheet.create({
        box: {
            borderRadius: 300,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: Colors.border,
            width: 16,
            backgroundColor: Colors.primary,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        dot: {
            width: 6,
            height: 6,
            borderRadius: 100,
            backgroundColor: Colors.tertiary,
        },
    });

    return <View style={styles.box}>{active && <View style={styles.dot} />}</View>;
};

export default ({buttons, value, handleChange, errorMessage}: PropsType) => {
    const [activeRadio, setActiveRadio] = useState(value);

    useEffect(() => {
        if (activeRadio) handleChange(activeRadio);
    }, [activeRadio]);

    useEffect(() => {
        setActiveRadio(value);
    }, [value]);

    return (
        <View>
            {buttons.map((e, c) => {
                const RadioButton = () => (
                    <TouchableWithoutFeedback onPress={() => setActiveRadio(e.value)}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: c + 1 === buttons.length ? 0 : 7,
                            }}
                        >
                            <Button active={activeRadio === e.value} />
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 24,
                                    fontWeight: '400',
                                    paddingLeft: 10,
                                    color: 'white',
                                }}
                            >
                                {e.name}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                );

                return e.rightSideElement ? (
                    <View
                        key={`${c}-radio`}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                        }}
                    >
                        <RadioButton />
                        {e.rightSideElement}
                    </View>
                ) : (
                    <RadioButton key={`${c}-radio`} />
                );
            })}
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
    );
};
