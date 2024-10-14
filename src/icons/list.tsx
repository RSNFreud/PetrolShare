import * as React from 'react';

import Svg, {SvgProps, Path} from 'react-native-svg';

export const List = (props: SvgProps) => (
    <Svg width={27} height={20} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M3 8.25h15v2.5H3v-2.5ZM3 2h20v2.5H3V2Zm0 15h9.044v-2.5H3V17Z"
        />
    </Svg>
);
