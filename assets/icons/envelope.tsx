import Svg, {Path} from 'react-native-svg';

import {IconType} from './icon';

export default ({...rest}: IconType) => (
    <Svg width="24" height="23" fill="none" viewBox="0 0 24 23" {...rest}>
        <Path
            fill="#fff"
            d="M20.164 3.833H4.83A1.914 1.914 0 002.924 5.75l-.01 11.5c0 1.054.862 1.917 1.917 1.917h15.333a1.922 1.922 0 001.917-1.917V5.75a1.922 1.922 0 00-1.917-1.917zm0 3.834l-7.667 4.791-7.666-4.791V5.75l7.666 4.792 7.667-4.792v1.917z"
        />
    </Svg>
);
