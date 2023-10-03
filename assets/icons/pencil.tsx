import Svg, { Path } from "react-native-svg";

import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20" {...rest}>
    <Path
      fill="#fff"
      d="M3 15.667V19h3.333l9.83-9.83-3.333-3.333L3 15.667zm15.74-9.074a.885.885 0 000-1.253l-2.08-2.08a.886.886 0 00-1.253 0l-1.626 1.626 3.333 3.333 1.626-1.626z"
    ></Path>
  </Svg>
);
