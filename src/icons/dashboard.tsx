import React from 'react';

import Svg, {SvgProps, Path} from 'react-native-svg';

export const DashboardIcon = (props: SvgProps) => (
    <Svg width={20} height={21} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M3 .5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-14 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-14 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7 0a3 3 0 1 0 0 5.999 3 3 0 0 0 0-5.999Z"
        />
    </Svg>
);
