import { TouchableOpacity, StyleSheet } from "react-native";

type PropTypes = {
  children: JSX.Element;
  style?: TouchableOpacity["props"]["style"];
  colourTheme?: "regular" | "red";
  handleClick?: () => void;
};

export default ({ children, style, colourTheme, handleClick }: PropTypes) => {
  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: colourTheme !== "red" ? "#1196B0" : "#FA4F4F",
          borderWidth: 1,
          borderColor: colourTheme !== "red" ? "#22CCEE" : "#BA3737",
          borderStyle: "solid",
          borderRadius: 4,
          padding: 16,
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
