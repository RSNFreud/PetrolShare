import Svg, { Path } from "react-native-svg";

import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="8" height="14" fill="none" viewBox="0 0 8 14" {...rest}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 1l6 6-6 6"
    />
  </Svg>
);
