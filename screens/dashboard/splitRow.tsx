import { useState } from "react";
import { View } from "react-native";
import { Text } from "../../components/Themed";
import DashboardButton from "./dashboardButton";

type PropTypes = {
  buttons: Array<{
    text: string;
    icon: JSX.Element;
    colourTheme?: "regular" | "red";
    handleClick?: () => void;
    disabled?: boolean;
  }>;
  style?: View["props"]["style"];
};

export default ({ buttons, style }: PropTypes) => {
  const [buttonWidth, setButtonWidth] = useState(0);
  const handleWidth = ({ nativeEvent }: any) => {
    const { width } = nativeEvent.layout;
    setButtonWidth(width / 2 - 12);
  };

  return (
    <View
      onLayout={handleWidth}
      style={[
        {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      {buttons.map((e) => (
        <DashboardButton
          style={{ width: buttonWidth }}
          handleClick={e.handleClick}
          disabled={e.disabled}
          key={e.text}
          colourTheme={e.colourTheme}
        >
          <>
            {e.icon}
            <Text style={{ fontSize: 16, fontWeight: "700", marginTop: 10 }}>
              {e.text}
            </Text>
          </>
        </DashboardButton>
      ))}
    </View>
  );
};
