import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const Cross = (props: SvgProps) => (
    <Svg width={15} height={16} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M15 1.813 13.687.5 7.5 6.688 1.312.5 0 1.813 6.188 8 0 14.188 1.313 15.5 7.5 9.312l6.188 6.188L15 14.187 8.812 8 15 1.812Z"
        />
    </Svg>
);
