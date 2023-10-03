import Svg, { Path } from "react-native-svg";

import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg {...rest} width="20" height="20" fill="none">
    <Path
      fill="#fff"
      d="M8.857 18v-6.857H2V8.857h6.857V2h2.286v6.857H18v2.286h-6.857V18H8.857z"
    ></Path>
  </Svg>
);
