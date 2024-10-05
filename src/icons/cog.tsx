import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const Cog = (props: SvgProps) => (
    <Svg width={15} height={15} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M7.503 5.594c-.494 0-.957.181-1.307.513-.349.332-.542.77-.542 1.238 0 .468.193.906.542 1.237.35.33.813.514 1.307.514s.956-.183 1.306-.514c.349-.331.542-.77.542-1.237 0-.468-.193-.906-.542-1.238a1.842 1.842 0 0 0-.599-.38 1.923 1.923 0 0 0-.707-.133Zm6.81 3.685-1.08-.875a5.333 5.333 0 0 0 0-1.806l1.08-.874a.499.499 0 0 0 .168-.253.476.476 0 0 0-.014-.298l-.014-.04a6.847 6.847 0 0 0-1.315-2.155l-.03-.033a.534.534 0 0 0-.266-.16.559.559 0 0 0-.314.011l-1.341.452a5.856 5.856 0 0 0-1.646-.9l-.26-1.328a.494.494 0 0 0-.146-.264.54.54 0 0 0-.28-.138L8.812.61a7.854 7.854 0 0 0-2.623 0l-.045.008a.54.54 0 0 0-.28.138.494.494 0 0 0-.146.264l-.261 1.335a5.925 5.925 0 0 0-1.634.897l-1.351-.456a.557.557 0 0 0-.315-.011.533.533 0 0 0-.265.16l-.03.033A6.898 6.898 0 0 0 .546 5.132l-.015.041a.485.485 0 0 0 .154.55l1.093.885a5.217 5.217 0 0 0 0 1.784l-1.09.884a.498.498 0 0 0-.167.252.476.476 0 0 0 .014.298l.014.041c.3.787.74 1.515 1.315 2.155l.03.033c.07.077.162.133.266.16a.56.56 0 0 0 .314-.012l1.351-.455c.493.383 1.041.687 1.634.897l.261 1.334c.02.1.071.192.147.264a.54.54 0 0 0 .28.138l.044.008a7.81 7.81 0 0 0 2.623 0l.045-.008a.54.54 0 0 0 .28-.138.494.494 0 0 0 .146-.264l.26-1.328a5.895 5.895 0 0 0 1.645-.9l1.341.452c.101.034.211.038.315.011a.534.534 0 0 0 .265-.16l.03-.032a6.9 6.9 0 0 0 1.315-2.155l.015-.04a.488.488 0 0 0-.157-.548Zm-6.81.816c-1.604 0-2.905-1.23-2.905-2.75s1.3-2.75 2.905-2.75c1.604 0 2.904 1.23 2.904 2.75s-1.3 2.75-2.904 2.75Z"
        />
    </Svg>
);