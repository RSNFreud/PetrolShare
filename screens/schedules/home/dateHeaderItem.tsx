import { TouchableWithoutFeedback, View } from "react-native";
import Colors from "../../../constants/Colors";
import { Text } from "../../../components/Themed";

type PropsType = {
  dayObj: {
    date: Date;
    active: boolean;
  };
  setCurrentDate: (date: number) => void;
  currentDate: number;
};

export default ({ dayObj, setCurrentDate, currentDate }: PropsType) => {
  const getDayString = (date: Date) => {
    const day = date.getDay();
    switch (day) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
    }
  };
  return (
    <TouchableWithoutFeedback
      touchSoundDisabled
      key={dayObj.date.toString()}
      onPress={() => setCurrentDate(dayObj.date.getTime())}
    >
      <View>
        <View
          style={{
            gap: 2,
            justifyContent: "center",
            opacity: dayObj.date.getTime() === currentDate ? 1 : 0.5,
            width: 32,
          }}
        >
          <Text
            style={{
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            {getDayString(dayObj.date)}
          </Text>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 100,
              backgroundColor:
                currentDate === dayObj.date.getTime()
                  ? Colors.tertiary
                  : "transparent",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              {dayObj.date.getDate()}
            </Text>
          </View>
        </View>
        {dayObj.active && Boolean(dayObj.date.getTime() !== currentDate) ? (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 100,
              backgroundColor: Colors.tertiary,
              position: "absolute",
              bottom: -2,
              left: 14,
            }}
          />
        ) : (
          <></>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
