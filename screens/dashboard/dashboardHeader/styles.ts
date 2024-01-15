import Colors from "constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 25,
        paddingBottom: 35,
    },
    innerWrapper: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderColor: Colors.border,
        borderStyle: "solid",
        borderWidth: 1,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    distanceRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    rowWrapper: {
        gap: 5
    },
    distanceText: {
        fontWeight: "300"
    }
})