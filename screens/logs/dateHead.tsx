import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { convertToDate } from "../../hooks";
import { Button, Text } from "../../components/Themed";

type PropsType = {
    data: any;
    handleNext: () => void;
    handlePrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

export default ({
    data,
    handleNext,
    handlePrevious,
    hasNext,
    hasPrevious,
}: PropsType) => {
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: 30,
        },
        button: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 0,
            paddingVertical: 0,
            minHeight: 0,
            width: 28,
            height: 28,
        },
        text: {
            fontSize: 16,
            fontWeight: "700",
        },
    });

    return (
        <View style={styles.container}>
            <Button
                noText
                styles={styles.button}
                handleClick={handlePrevious}
                disabled={!hasPrevious}
            >
                <Svg width="12" height="10" fill="none" viewBox="0 0 12 10">
                    <Path
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.313.5L.5 5l4.813 4.5M.5 5h11"
                    ></Path>
                </Svg>
            </Button>
            <Text style={styles.text}>
                {convertToDate(data ? data["sessionStart"] : Date.now())} -&nbsp;
                {convertToDate(data ? data["sessionEnd"] || Date.now() : Date.now())}
            </Text>
            <Button
                disabled={!hasNext}
                noText
                styles={styles.button}
                handleClick={handleNext}
            >
                <Svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <Path
                        d="M6.6875 9.5L11.5 5L6.6875 0.5M11.5 5L0.5 5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </Button>
        </View>
    );
};