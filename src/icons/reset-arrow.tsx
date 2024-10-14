import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const ResetArrow = (props: SvgProps) => (
    <Svg width={21} height={18} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M12.057 17.052a8.275 8.275 0 1 0-8.275-8.276v4.276l-2.483-2.483-.966.965 4.138 4.138 4.138-4.138-.965-.965-2.483 2.483V8.776a6.896 6.896 0 1 1 6.896 6.896v1.38Z"
        />
    </Svg>
);
