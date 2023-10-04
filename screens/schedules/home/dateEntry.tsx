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
  colour: string;
};

export default ({
  onPress,
  data,
  emailAddress,
  hasMultipleDays,
  currentDayCount,
  amountOfDays,
  colour,
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
          backgroundColor: Colors.primary,
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <View>
              <View
                style={{
                  gap: 4,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 2,
                    height: 12,
                    backgroundColor: colour,
                  }}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  {data.summary || "New Schedule"}
                </Text>
              </View>
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
              <Text style={{ fontWeight: "bold", fontSize: 14, color: colour }}>
                {data.fullName.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          </View>
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
            height: 44,
          }}
          seperator={
            <View
              style={{
                width: 1,
                backgroundColor: Colors.border,
                height: 34,
              }}
            />
          }
          elements={[
            <Button
              icon={<Pencil height={14} width={14} />}
              size="medium"
              text="Edit"
              disabled={
                endDate.getTime() > Date.now() ||
                emailAddress !== data.emailAddress
              }
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
            />,
            <Button
              color="red"
              disabled={
                endDate.getTime() > Date.now() ||
                emailAddress !== data.emailAddress
              }
              textStyle={{ color: Colors.red }}
              icon={<Bin height={14} width={14} color={Colors.red} />}
              size="medium"
              text="Delete"
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
