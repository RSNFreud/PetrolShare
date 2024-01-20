import Svg, { Path } from "react-native-svg";

import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg {...rest} width="20" height="20" viewBox="0 0 18 20" fill="none">
    <Path
      fill="#fff"
      d="M.111 20V6.667L9 0l8.889 6.667V20h-6.667v-7.778H6.778V20H.11z"
    />
  </Svg>
);
