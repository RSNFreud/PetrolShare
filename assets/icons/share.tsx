import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg width="25" height="25" fill="none" viewBox="0 0 18 15" {...rest}>
        <Path fill="#fff" d="M18 7l-7-7v4C4 5 1 10 0 15c2.5-3.5 6-5.1 11-5.1V14l7-7z" />
    </Svg>
);
