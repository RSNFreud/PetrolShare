import { View, StyleSheet } from "react-native";
import { convertToDate } from "../../hooks";
import { Text } from "../../components/Themed";
import Button from "../../components/button";
import ChevronRight from "../../assets/icons/chevronRight";

type PropsType = {
  data: any;
  handleNext: () => void;
  handlePrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

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
      marginBottom: 25,
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
        style={styles.button}
        handleClick={handlePrevious}
        disabled={!hasPrevious}
        analyticsLabel="Previous Log"
      >
        <ChevronRight
          width="12"
          height="10"
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </Button>
      <Text style={styles.text}>
        {convertToDate(data ? data["sessionStart"] : Date.now())} -&nbsp;
        {convertToDate(data ? data["sessionEnd"] || Date.now() : Date.now())}
      </Text>
      <Button
        disabled={!hasNext}
        noText
        style={styles.button}
        analyticsLabel="Next Log"
        handleClick={handleNext}
      >
        <ChevronRight width="12" height="10" />
      </Button>
    </View>
  );
};
