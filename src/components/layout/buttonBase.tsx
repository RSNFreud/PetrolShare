import {ComponentProps, FC} from 'react';
import {TouchableOpacity, View} from 'react-native';

type PropsType = ComponentProps<typeof TouchableOpacity>;

export const ButtonBase: FC<PropsType> = ({children, onPress, disabled, ...props}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.6}
            touchSoundDisabled
        >
            <View {...props}>{children}</View>
        </TouchableOpacity>
    );
};
