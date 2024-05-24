import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg {...rest} width="14" height="14" fill="none" viewBox="0 0 10 10">
        <Path
            fill="#fff"
            d="M10 .875L9.125 0 5 4.125.875 0 0 .875 4.125 5 0 9.125.875 10 5 5.875 9.125 10 10 9.125 5.875 5 10 .875z"
        />
    </Svg>
);
