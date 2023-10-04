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
  isExpired: boolean;
};

export default ({
  onPress,
  data,
  emailAddress,
  hasMultipleDays,
  currentDayCount,
  amountOfDays,
  startDate,
  isExpired,
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
          backgroundColor: Colors.primary,
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
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: "300",
                  fontSize: 14,
                  marginTop: 10,
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
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.secondary,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {data.fullName.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <SplitRow
          gap={0}
          style={{
            marginTop: 0,
            backgroundColor: Colors.secondary,
            alignItems: "center",
            height: 35,
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
              disabled={isExpired || emailAddress !== data.emailAddress}
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
            />,
            <Button
              color="red"
              disabled={isExpired || emailAddress !== data.emailAddress}
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
