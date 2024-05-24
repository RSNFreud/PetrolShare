import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg {...rest} width="26" height="26" fill="none" viewBox="0 0 26 26">
        <Path
            fill="#fff"
            d="M21.306 5.056H7.583A1.083 1.083 0 006.5 6.139v17.333a1.084 1.084 0 001.083 1.084h13.723a1.084 1.084 0 001.083-1.084V6.14a1.083 1.083 0 00-1.083-1.083zm-.362 18.055h-13V6.5h13v16.611z"
        />
        <Path
            fill="#fff"
            d="M18.778 2.528a1.083 1.083 0 00-1.083-1.084H3.972A1.083 1.083 0 002.89 2.528V19.86a1.083 1.083 0 001.083 1.083h.361V2.89h14.445v-.361z"
        />
    </Svg>
);
