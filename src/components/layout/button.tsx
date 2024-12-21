import {ComponentProps, FC, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {ButtonBase} from './buttonBase';
import {Text} from './text';
import {Colors} from '@constants/colors';

type PropsType = ComponentProps<typeof TouchableOpacity> & {
    variant?: 'ghost' | 'filled';
    color?: 'red';
    loading?: boolean;
    icon?: React.ReactNode;
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

export const Button: FC<PropsType> = ({
    children,
    style,
    variant,
    loading,
    disabled,
    color,
    icon,
    ...rest
}) => {
    const [isLoading, setIsLoading] = useState(loading);

    useEffect(() => {
        if (loading) setIsLoading(loading);
        setTimeout(() => setIsLoading(false), 300);
    }, [loading]);

    const backgroundColour = () => {
        if (disabled) return '#242B42';
        if (variant === 'ghost') return 'transparent';
        if (color === 'red') return Colors.red;
        return Colors.tertiary;
    };

    const borderColor = () => {
        if (color === 'red') return Colors.red;
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
        <ButtonBase style={combinedStyles} disabled={isLoading || disabled} {...rest}>
            {icon}
            <Text bold style={{fontSize: 18, color: textColor()}}>
                {isLoading ? <ActivityIndicator size="small" color="#fff" /> : children}
            </Text>
        </ButtonBase>
    );
};
