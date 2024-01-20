import Svg, { Path } from "react-native-svg";

import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="15" height="15" fill="none" viewBox="0 0 24 23" {...rest}>
    <Path
      fill="#fff"
      d="M11.549 9.693l-4.474 4.014-4.473-4.014C1.717 8.9 1.115 7.887.872 6.786a5.142 5.142 0 01.36-3.281c.479-1.038 1.29-1.924 2.33-2.548A6.848 6.848 0 017.074 0a6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.142 5.142 0 01.36 3.28c-.244 1.102-.846 2.114-1.73 2.908zM7.075 7.742a2.44 2.44 0 001.626-.605 1.96 1.96 0 00.674-1.46 1.96 1.96 0 00-.674-1.46 2.44 2.44 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.44 2.44 0 001.626.605zm14.823 11.244L17.425 23l-4.474-4.015c-.884-.795-1.486-1.806-1.73-2.908a5.142 5.142 0 01.36-3.28c.48-1.038 1.29-1.925 2.33-2.549a6.848 6.848 0 013.514-.957 6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.141 5.141 0 01.36 3.281c-.244 1.101-.846 2.113-1.73 2.908zm-4.473-1.952c.61 0 1.195-.217 1.626-.605a1.96 1.96 0 00.674-1.46c0-.547-.242-1.073-.674-1.46a2.439 2.439 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.439 2.439 0 001.626.605z"
    />
  </Svg>
);
