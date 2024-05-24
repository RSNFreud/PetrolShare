import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg width="16" height="16" fill="none" viewBox="0 0 24 23" {...rest}>
        <Path
            fill="#fff"
            d="M15.692 2.556H5.47a1.278 1.278 0 00-1.278 1.277v15.334a1.278 1.278 0 001.278 1.277h10.222a1.278 1.278 0 001.278-1.277v-3.834h-5.987a.639.639 0 110-1.277h5.987V3.833a1.278 1.278 0 00-1.278-1.277zM18.988 11.04a.638.638 0 00-.9.9l2.159 2.116H16.97v1.277h3.277l-2.16 2.21a.639.639 0 10.901.902l3.732-3.706-3.732-3.699z"
        />
    </Svg>
);
