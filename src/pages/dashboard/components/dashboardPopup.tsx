import {createRef, FC, useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {PopupType} from '../page';
import {useSubmitRequest} from './useSubmitRequest';
import {defaultValues, FormValues} from '@constants/common';
import {Button} from '@components/layout/button';
import {Colors} from '@constants/colors';
import {Text} from '@components/layout/text';

type PropsType = {
    data: PopupType;
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    input: {
        gap: 15,
    },
    box: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 4,
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
    },
});

export const PopupWrapper: FC<PropsType> = ({data}) => {
    const [formData, setFormData] = useState<{[key: string]: FormValues}>({});
    const inputRefs = useRef(data.children?.map(() => createRef<TextInput>()));

    const setErrors = (errors: {[key: string]: string}) => {
        const newValues = Object.entries(formData).reduce(
            (prevData, [key, value]) => ({
                ...prevData,
                [key]: {
                    value: value.value,
                    error: errors ? errors?.[key] : '',
                },
            }),
            {} as {[key: string]: {value: string}},
        );
        setFormData(newValues);
    };

    const onInput = (key: string, value: string) => {
        setFormData(oldState => ({...oldState, [key]: {value, error: ''}}));
    };

    const {isLoading, handleValidate} = useSubmitRequest(setErrors, onInput, data.id, formData);

    useEffect(() => {
        if (!data.children) return;
        const inputs = data.children?.reduce(
            (original, input) => ({
                ...original,
                [input.props.id]: defaultValues,
            }),
            {},
        );
        setFormData(inputs);
    }, [data.children]);

    const handleKeyboardSubmit = (index: number) => {
        const nextEl = inputRefs?.current?.[index + 1];
        if (nextEl) {
            return nextEl.current?.focus();
        }
        handleValidate(data, setFormData);
    };

    const getButtonText = (button: {
        label: string;
        isSubmitButton?: boolean;
        isDraftButton?: boolean;
    }) => {
        if (button.isDraftButton && !formData['odemeterEnd']?.value) {
            return 'Save Draft';
        }
        return button.label;
    };

    return (
        <View style={styles.container}>
            {data.pretext && (
                <View style={styles.box}>
                    <Text style={styles.text}>{data.pretext}</Text>
                </View>
            )}
            {data.children && (
                <View style={styles.input}>
                    {data.children.map((child, index) => {
                        const id = child.props.id;
                        return (
                            <child.component
                                {...child.props}
                                innerRef={inputRefs?.current?.[index]}
                                value={formData[id]?.value || ''}
                                error={formData[id]?.error}
                                key={child.props.id}
                                onChangeText={(value: string) => onInput(id, value)}
                                onSubmitEditing={() => handleKeyboardSubmit(index)}
                            />
                        );
                    })}
                </View>
            )}
            {data.buttons && (
                <View>
                    {data.buttons.map(button => (
                        <Button
                            loading={isLoading}
                            key={button.label}
                            onPress={() =>
                                button.isSubmitButton ? handleValidate(data, setFormData) : null
                            }
                        >
                            {getButtonText(button)}
                        </Button>
                    ))}
                </View>
            )}
        </View>
    );
};
