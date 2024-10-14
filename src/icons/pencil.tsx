import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const Pencil = (props: SvgProps) => (
    <Svg width={20} height={21} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M2.333 14.375V17.5h3.125l9.215-9.215L11.55 5.16l-9.216 9.215ZM17.09 5.868a.83.83 0 0 0 0-1.175l-1.95-1.95a.83.83 0 0 0-1.175 0L12.44 4.269l3.125 3.125 1.525-1.525Z"
        />
    </Svg>
);
