import { TouchableWithoutFeedback, View } from "react-native";
import Bin from "../../../assets/icons/bin";
import Pencil from "../../../assets/icons/pencil";
import SplitRow from "../../../components/splitRow";
import Colors from "../../../constants/Colors";
import { Text } from "../../../components/Themed";
import { ScheduleType } from "..";
import Button from "../../../components/button";

type PropsType = {
  onPress: () => void;
  emailAddress?: string;
  data: ScheduleType;
  hasMultipleDays?: boolean;
  currentDayCount: number;
  amountOfDays: number;
  startDate: Date;
  endDate: Date;
};

export default ({
  onPress,
  data,
  emailAddress,
  hasMultipleDays,
  currentDayCount,
  amountOfDays,
  startDate,
  endDate,
}: PropsType) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 4,
          gap: 5,
          backgroundColor:
            emailAddress === data.emailAddress ? Colors.primary : "",
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {data.summary || "New Schedule"}
          </Text>
          <Text
            style={{
              fontWeight: "300",
              fontSize: 14,
              marginTop: 5,
            }}
          >
            {data.fullName}{" "}
            {hasMultipleDays && (
              <>
                (Day {currentDayCount}/{amountOfDays})
              </>
            )}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            {(currentDayCount !== amountOfDays || !hasMultipleDays) && (
              <>
                {startDate.toLocaleString(undefined, {
                  minute: "2-digit",
                  hour: "2-digit",
                  hour12: true,
                })}
              </>
            )}
            {!hasMultipleDays && <> - </>}
            {(currentDayCount === amountOfDays || !hasMultipleDays) && (
              <>
                {endDate.toLocaleString(undefined, {
                  minute: "2-digit",
                  hour: "2-digit",
                  hour12: true,
                })}
              </>
            )}
          </Text>
        </View>
        <SplitRow
          gap={0}
          style={{
            marginTop: 0,
            backgroundColor: Colors.secondary,
            alignItems: "center",
          }}
          seperator={
            <View
              style={{
                width: 1,
                backgroundColor: Colors.border,
                height: "60%",
              }}
            />
          }
          elements={[
            <Button
              icon={<Pencil height={14} width={14} />}
              size="small"
              text="Edit"
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
            />,
            <Button
              color="red"
              icon={<Bin height={14} width={14} />}
              variant="ghost"
              size="small"
              text="Remove"
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
            />,
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
