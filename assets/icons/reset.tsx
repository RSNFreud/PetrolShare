import Svg, { Path } from "react-native-svg";
import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 23 18" {...rest}>
    <Path
      fill="#fff"
      d="M13.5 18a9 9 0 10-9-9v4.65l-2.7-2.7L.75 12l4.5 4.5 4.5-4.5-1.05-1.05-2.7 2.7V9a7.5 7.5 0 117.5 7.5V18z"
    ></Path>
  </Svg>
);
