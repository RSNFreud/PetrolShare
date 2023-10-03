import Svg, { Path } from "react-native-svg";
import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="14" height="68" fill="none" viewBox="0 0 16 18" {...rest}>
    <Path
      fill="#fff"
      d="M15.714 14.571v.858H.286v-.858L2 12.857V7.714a5.992 5.992 0 014.286-5.751v-.249a1.714 1.714 0 113.428 0v.249A5.992 5.992 0 0114 7.714v5.143l1.714 1.714zm-6 1.715a1.714 1.714 0 11-3.428 0"
    ></Path>
  </Svg>
);
