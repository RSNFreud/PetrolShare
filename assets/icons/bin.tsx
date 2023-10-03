import Svg, { Path } from "react-native-svg";
import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg
    width="12"
    height="14"
    fill="none"
    viewBox="0 0 12 14"
    color={"#FA4F4F"}
    {...rest}
  >
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1 2.58l1.28 7.82a2.223 2.223 0 001.52 1.76l.183.058a6.666 6.666 0 004.034 0l.182-.058a2.222 2.222 0 001.522-1.759L11 2.581"
    ></Path>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 3.692c2.761 0 5-.498 5-1.111 0-.614-2.239-1.111-5-1.111s-5 .497-5 1.11c0 .614 2.239 1.112 5 1.112z"
    ></Path>
  </Svg>
);
