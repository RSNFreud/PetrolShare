import Svg, { Path } from "react-native-svg";
import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 24 24" {...rest}>
    <Path
      fill="#fff"
      d="M0 10.5h18v3H0v-3zM0 3h24v3H0V3zm0 18h10.852v-3H0v3z"
    ></Path>
  </Svg>
);
