import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const Chevron = (props: SvgProps) => (
    <Svg width={8} height={12} fill="none" viewBox="0 0 8 12" {...props}>
        <Path fill="currentColor" d="M.5 1.41 4.827 6 .5 10.59 1.832 12 7.5 6 1.832 0 .5 1.41Z" />
    </Svg>
);
