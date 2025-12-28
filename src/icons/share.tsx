import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const Share = (props: SvgProps) => (
    <Svg width={22} height={18} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M22 8.4 13.444 0v4.8C4.89 6 1.222 12 0 18c3.056-4.2 7.333-6.12 13.444-6.12v4.92L22 8.4Z"
        />
    </Svg>
);
