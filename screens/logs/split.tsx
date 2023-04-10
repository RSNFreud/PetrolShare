import { useState } from "react";
import { View } from "react-native";

export default ({ children }: { children: JSX.Element[] }) => {
    const [buttonWidth, setButtonWidth] = useState<string | number>("49%");
    const handleWidth = ({ nativeEvent }: any) => {
        const { width } = nativeEvent.layout;
        setButtonWidth(width / 2 - 5);
    };

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 15,
                justifyContent: "space-between",
            }}
            onLayout={handleWidth}
        >
            {children.map((e, c) => (
                <View key={c} style={{ width: buttonWidth }}>
                    {e}
                </View>
            ))}
        </View>
    );
};
