import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg {...rest} width="26" height="26" fill="none" viewBox="0 0 26 26" {...rest}>
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4.469 14.219l5.687 5.687L21.531 7.72"
        />
    </Svg>
);
