import { TouchableOpacity, StyleSheet } from "react-native";

type PropTypes = {
  children: JSX.Element;
  style?: TouchableOpacity["props"]["style"];
  colourTheme?: "regular" | "red";
  disabled?: boolean;
  handleClick?: () => void;
};

export default ({
  children,
  style,
  colourTheme,
  handleClick,
  disabled,
}: PropTypes) => {
  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        {
          backgroundColor: colourTheme !== "red" ? "#1196B0" : "#FA4F4F",
          borderWidth: 1,
          borderColor: colourTheme !== "red" ? "#22CCEE" : "#BA3737",
          borderStyle: "solid",
          borderRadius: 4,
          opacity: disabled ? 0.4 : 1,
          paddingVertical: 16,
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};
