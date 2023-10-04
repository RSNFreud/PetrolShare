import Svg, { Path } from "react-native-svg";
import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="18" height="19" fill="none" viewBox="0 0 18 19" {...rest}>
    <Path
      fill="currentColor"
      d="M16.904 3.75h-2.875V1.953c0-.793-.645-1.437-1.438-1.437H5.404c-.793 0-1.438.644-1.438 1.437V3.75H1.091a.718.718 0 00-.719.719v.718c0 .1.081.18.18.18h1.357l.554 11.747c.036.766.67 1.37 1.436 1.37h10.197c.768 0 1.4-.602 1.435-1.37l.555-11.747h1.357a.18.18 0 00.18-.18V4.47a.718.718 0 00-.72-.719zm-4.493 0H5.583V2.133h6.828V3.75z"
    ></Path>
  </Svg>
);
