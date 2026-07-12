import {ComponentProps, FC, forwardRef, Ref, useState} from 'react';
import {StyleSheet, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from './text';
import {Colors} from '@constants/colors';
import {EyeClosed} from 'src/icons/eyeClosed';
import {EyeOpen} from 'src/icons/eyeOpen';

type PropsType = ComponentProps<typeof TextInput> & {
    label?: string;
    error?: string;
    ref?: Ref<TextInput> | undefined;
    innerRef?: Ref<TextInput> | undefined;
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        height: 52,
        borderColor: Colors.border,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
        backgroundColor: Colors.primary,
        color: 'white',
        fontSize: 18,
        lineHeight: 20,
        alignItems: 'center',
    },
    error: {
        fontSize: 14,
        color: Colors.red,
        marginTop: 8,
    },
    label: {
        marginBottom: 6,
    },
    passwordToggle: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 48,
        paddingHorizontal: 10,
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
    },
});

export const Input: FC<PropsType> = forwardRef(
    ({label, error, style, innerRef, secureTextEntry, ...rest}, ref) => {
        const combinedStyles: ComponentProps<typeof TextInput>['style'] = [styles.container, style];
        const [passwordShown, setPasswordShown] = useState(secureTextEntry);

        const handlePassword = () => {
            setPasswordShown(showPassword => !showPassword);
        };

        return (
            <View>
                {!!label && (
                    <Text bold style={styles.label}>
                        {label}
                    </Text>
                )}
                <View>
                    <TextInput
                        {...rest}
                        secureTextEntry={passwordShown}
                        ref={innerRef || ref}
                        style={combinedStyles}
                        placeholderTextColor="rgba(255,255,255,0.6)"
                    />
                    {secureTextEntry && (
                        <TouchableWithoutFeedback onPress={() => handlePassword()}>
                            <View style={styles.passwordToggle}>
                                {passwordShown ? <EyeOpen /> : <EyeClosed />}
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
                {!!error && <Text style={styles.error}>{error}</Text>}
            </View>
        );
    },
);

Input.displayName = 'Input';
