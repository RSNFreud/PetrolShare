import Svg, { Path } from "react-native-svg";

import { IconType } from "./icon";

export default ({ ...rest }: IconType) => (
  <Svg width="15" height="15" fill="none" viewBox="0 0 24 23" {...rest}>
    <Path
      fill="#fff"
      d="M2.188 2.875A2.875 2.875 0 015.062 0h8.625a2.875 2.875 0 012.876 2.875v11.5a2.875 2.875 0 012.875 2.875v.719a.719.719 0 101.437 0V11.5h-.719a.719.719 0 01-.718-.719V6.29a.719.719 0 01.718-.719h2.15c-.017-.684-.077-1.285-.29-1.756a1.394 1.394 0 00-.566-.659c-.264-.158-.667-.28-1.294-.28a.719.719 0 010-1.438c.811 0 1.487.159 2.03.484.55.327.911.792 1.141 1.303.424.942.423 2.106.423 2.992v4.565a.719.719 0 01-.719.719h-.718v6.469a2.157 2.157 0 01-4.313 0v-.719a1.438 1.438 0 00-1.438-1.438v5.75h.72a.719.719 0 110 1.438H1.468a.719.719 0 110-1.438h.718V2.875zm3.593 0a.719.719 0 00-.718.719v7.187a.719.719 0 00.718.719h7.188a.719.719 0 00.719-.719V3.594a.719.719 0 00-.72-.719H5.782z"
    />
  </Svg>
);
