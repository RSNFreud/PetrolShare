import {ComponentProps, FC, forwardRef, LegacyRef} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Text} from './text';
import {Colors} from '@constants/colors';

type PropsType = ComponentProps<typeof TextInput> & {
    label: string;
    error?: string;
    ref?: LegacyRef<TextInput> | undefined;
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
});

export const Input: FC<PropsType> = forwardRef(({label, error, style, ...rest}, ref) => {
    const combinedStyles: ComponentProps<typeof TextInput>['style'] = [styles.container, style];

    return (
        <View>
            <Text bold style={styles.label}>
                {label}
            </Text>
            <TextInput
                {...rest}
                ref={ref}
                style={combinedStyles}
                placeholderTextColor="rgba(255,255,255,0.6)"
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});
