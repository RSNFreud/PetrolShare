import {createRef, FC, useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {PopupType} from '../page';
import {Input} from '@components/layout/input';
import {defaultValues, FormValues} from '@constants/common';
import {Button} from '@components/layout/button';
import {Colors} from '@constants/colors';
import {Text} from '@components/layout/text';
import {useSubmitRequest} from './submitRequest';
import {POPUP_IDS} from '../constants';

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
    const inputRefs = useRef(data.inputs?.map(() => createRef<TextInput>()));

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

    const {handleSubmit, isLoading} = useSubmitRequest(setErrors);

    useEffect(() => {
        if (!data.inputs) return;
        const inputs = data.inputs?.reduce(
            (original, input) => ({
                ...original,
                [input.id]: defaultValues,
            }),
            {},
        );
        setFormData(inputs);
    }, [data.inputs]);

    const onInput = (key: string, value: string) => {
        setFormData(oldState => ({...oldState, [key]: {value, error: ''}}));
    };

    const onSubmit = () => {
        if (!data.validation) return;

        const values = Object.entries(formData).reduce(
            (prevData, [key, value]) => ({
                ...prevData,
                [key]: value.value,
            }),
            {},
        );

        const validate = data.validation.safeParse(values);

        const errors = validate.error?.format();

        const newValues = Object.entries(formData).reduce(
            (prevData, [key, value]) => ({
                ...prevData,
                [key]: {
                    value: value.value,
                    error: errors ? errors[key]?._errors[0] : '',
                },
            }),
            {} as {[key: string]: {value: string}},
        );

        setFormData(newValues);
        if (data.id === POPUP_IDS.ODOMETER && !formData['odemeterEnd']?.value) {
            // Handle draft logic
            return;
        }
        if (validate.success) handleSubmit(values, data);
    };

    const handleKeyboardSubmit = (index: number) => {
        const nextEl = inputRefs?.current?.[index + 1];
        if (nextEl) {
            return nextEl.current?.focus();
        }
        onSubmit();
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
            {data.inputs && (
                <View style={styles.input}>
                    {data.inputs.map((input, index) => (
                        <Input
                            ref={inputRefs?.current?.[index]}
                            label={input.label}
                            placeholder={input.placeholder}
                            key={input.id}
                            value={formData[input.id]?.value || ''}
                            error={formData[input.id]?.error}
                            onChangeText={value => onInput(input.id, value)}
                            onSubmitEditing={() => handleKeyboardSubmit(index)}
                            {...input.props}
                        />
                    ))}
                </View>
            )}
            {data.buttons && (
                <View>
                    {data.buttons.map(button => (
                        <Button
                            loading={isLoading}
                            key={button.label}
                            onPress={() => (button.isSubmitButton ? onSubmit() : null)}
                        >
                            {getButtonText(button)}
                        </Button>
                    ))}
                </View>
            )}
        </View>
    );
};
