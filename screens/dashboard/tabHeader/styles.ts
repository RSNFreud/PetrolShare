import Colors from "constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 25,
        backgroundColor: Colors.primary,
        display: "flex",
        justifyContent: "center",
        gap: 20,
        flexDirection: "row",
    },
    seperator: {
        backgroundColor: Colors.border,
        width: 1,
        height: 30,
    },
    innerContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 20,
        alignItems: 'center',
        justifyContent: "center",
    }
})