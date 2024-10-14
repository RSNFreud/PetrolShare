import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const Plus = (props: SvgProps) => (
    <Svg width={20} height={21} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M8.762 17.5v-6.429H2.333V8.93h6.429V2.5h2.143v6.429h6.428v2.142h-6.428V17.5H8.762Z"
        />
    </Svg>
);
