import * as React from 'react';
import Svg, {SvgProps, Path, ClipPath, Defs, G} from 'react-native-svg';

export const AddUser = (props: SvgProps) => (
    <Svg width={20} height={21} fill="none" {...props}>
        <G clipPath="url(#a)">
            <Path
                fill="currentColor"
                d="M16.167 14.5v1.667h-10V14.5s0-3.333 5-3.333 5 3.333 5 3.333Zm-2.5-7.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm2.666 4.217a4.667 4.667 0 0 1 1.5 3.283v1.667h2.5V14.5s0-2.875-4-3.283Zm-1-6.717c-.251 0-.502.04-.741.117a4.166 4.166 0 0 1 0 4.766c.24.078.49.117.741.117a2.5 2.5 0 0 0 0-5ZM7 8.667H4.5v-2.5H2.833v2.5h-2.5v1.666h2.5v2.5H4.5v-2.5H7V8.667Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="currentColor" d="M0 .5h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
