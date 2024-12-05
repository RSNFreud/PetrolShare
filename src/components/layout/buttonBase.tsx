import {ComponentProps, FC} from 'react';
import {TouchableOpacity} from 'react-native';

type PropsType = ComponentProps<typeof TouchableOpacity>;

export const ButtonBase: FC<PropsType> = ({children, ...props}) => {
    return (
        <TouchableOpacity {...props} activeOpacity={0.6} touchSoundDisabled>
            {children}
        </TouchableOpacity>
    );
};
