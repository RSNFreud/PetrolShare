import {ComponentProps, FC} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {ButtonBase} from './buttonBase';
import {Colors} from '@constants/colors';
import {Text} from './text';

type PropsType = ComponentProps<typeof TouchableOpacity> & {
    variant?: 'ghost' | 'filled';
    loading?: boolean;
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const Button: FC<PropsType> = ({children, style, variant, loading, disabled, ...rest}) => {
    const backgroundColour = () => {
        if (disabled) return '#242B42';
        if (variant === 'ghost') return 'transparent';
        return Colors.tertiary;
    };

    const borderColor = () => {
        if (variant === 'ghost') return Colors.highlight;
        return Colors.border;
    };

    const textColor = () => {
        if (variant === 'ghost') return Colors.highlight;
        if (disabled) return '#7A7E93';
        return 'white';
    };

    const combinedStyles: ComponentProps<typeof TouchableOpacity>['style'] = [
        styles.button,
        {
            backgroundColor: backgroundColour(),
            borderColor: borderColor(),
        },
        style,
    ];

    return (
        <ButtonBase style={combinedStyles} disabled={loading || disabled} {...rest}>
            <Text bold style={{fontSize: 18, color: textColor()}}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : children}
            </Text>
        </ButtonBase>
    );
};
