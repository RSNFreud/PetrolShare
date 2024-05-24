import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg width="16" height="16" fill="none" viewBox="0 0 18 20" {...rest}>
        <Path
            fill="#fff"
            d="M4.685 5.23a4.318 4.318 0 004.312 4.312 4.318 4.318 0 004.313-4.313A4.318 4.318 0 008.997.917a4.318 4.318 0 00-4.312 4.312zm11.979 13.895h.958v-.958a6.717 6.717 0 00-6.708-6.709H7.081c-3.7 0-6.709 3.01-6.709 6.709v.958h16.292z"
        />
    </Svg>
);
