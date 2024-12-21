import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const Delete = (props: SvgProps) => (
    <Svg width={11} height={14} viewBox="0 0 11 14" fill="none" {...props}>
        <Path
            d="M0.5 2.58105L1.77944 10.4011C1.84572 10.8062 2.02294 11.1851 2.29144 11.4957C2.55994 11.8062 2.90923 12.0364 3.30056 12.1605L3.48278 12.2183C4.79532 12.635 6.20468 12.635 7.51722 12.2183L7.69944 12.1605C8.0907 12.0364 8.43993 11.8064 8.70843 11.4959C8.97692 11.1854 9.15418 10.8067 9.22056 10.4016L10.5 2.58105"
            stroke="#FA4F4F"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M5.5 3.69195C8.26142 3.69195 10.5 3.19449 10.5 2.58084C10.5 1.96719 8.26142 1.46973 5.5 1.46973C2.73858 1.46973 0.5 1.96719 0.5 2.58084C0.5 3.19449 2.73858 3.69195 5.5 3.69195Z"
            stroke="#FA4F4F"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
