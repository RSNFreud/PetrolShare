import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const Tick = (props: SvgProps) => (
    <Svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
        <Path
            fill="currentColor"
            d="m13.666.938-7.332 9.665L2 6.272l-2 2 6.666 6.665 9.334-12-2.334-2Z"
        />
    </Svg>
);
