import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg width="20" height="20" fill="none" viewBox="0 0 24 24" {...rest}>
        <Path
            fill="#fff"
            d="M5 2a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 6 3 3 0 000-6zm7 6a3 3 0 100-6 3 3 0 000 6zM5 9a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 6 3 3 0 000-6zM5 16a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 5.999A3 3 0 0012 16zm7 0a3 3 0 100 5.999A3 3 0 0019 16z"
        />
    </Svg>
);
