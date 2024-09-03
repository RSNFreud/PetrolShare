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

export const Button: FC<PropsType> = ({children, style, variant, loading, ...rest}) => {
    const combinedStyles: ComponentProps<typeof TouchableOpacity>['style'] = [
        styles.button,
        {
            backgroundColor: variant === 'ghost' ? 'transparent' : Colors.tertiary,
            borderColor: variant === 'ghost' ? Colors.tertiary : Colors.border,
        },
        style,
    ];

    return (
        <ButtonBase style={combinedStyles} disabled={loading} {...rest}>
            <Text
                bold
                style={{fontSize: 18, color: variant === 'ghost' ? Colors.tertiary : 'white'}}
            >
                {loading ? <ActivityIndicator size="small" color="#fff" /> : children}
            </Text>
        </ButtonBase>
    );
};
