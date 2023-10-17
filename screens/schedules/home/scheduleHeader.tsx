import { View, ScrollView } from "react-native";
import ChevronRight from "../../../assets/icons/chevronRight";
import { TouchableBase } from "@components/button";
import DateTimePicker from "@components/dateTimePicker";
import Colors from "../../../constants/Colors";
import DateHeaderItem from "./dateHeaderItem";
import { useEffect, useRef } from "react";
import { ScheduleType, resetMonth } from "..";

export type UserColourType = { userID: string; colour: string };

type PropsType = {
  changeMonth: (e: "forwards" | "back") => void;
  backDisabled: boolean;
  currentDate: number;
  currentData: [string, Map<number, ScheduleType[]>[]];
  setCurrentDate: (date: number) => void;
  userColours: UserColourType[];
};

export default ({
  changeMonth,
  backDisabled,
  currentDate,
  currentData,
  userColours,
  setCurrentDate,
}: PropsType) => {
  const dateRef = useRef<ScrollView | null>(null);

  const setInitialScroll = (animate: boolean = false) => {
    const ref = dateRef.current;
    const date = new Date(currentDate);
    if (!ref) return;
    ref.scrollTo({
      y: 0,
      x: (date.getDate() - 4) * 32 + (date.getDate() - 4) * 25,
      animated: animate,
    });
  };

  const getDaysInMonth = () => {
    let date = resetMonth(new Date(currentDate));
    const targetMonth = date.getMonth();
    let dates = [];
    let i = 0;

    while (date.getMonth() === targetMonth) {
      const hasData = currentData
        ? Boolean(
            currentData[1].filter(([day, _]) => day[0] === date.getTime())
              .length
          )
        : false;
      dates.push({ date: new Date(date), active: hasData });
      date = new Date(date.setDate(date.getDate() + 1));
      i++;
    }
    return dates;
  };

  const getDots = () => {
    if (!currentData || !userColours) return [];
    const dotsPerDay: { date: number; dots: string[] }[] = [];
    const [_, data] = currentData;
    data.map((e) =>
      [...e].map(([date, schedule]) => {
        dotsPerDay.push({
          date: date,
          dots: removeDuplicates(
            schedule.map(
              (q) =>
                userColours?.filter((user) => user.userID === q.userID)[0]
                  .colour
            )
          ),
        });
      })
    );
    return dotsPerDay;
  };

  const removeDuplicates = (array: string[]) => {
    const arr: string[] = [];
    array.map((e) => {
      if (arr.includes(e)) return;
      arr.push(e);
    });
    return arr;
  };

  useEffect(() => {
    setInitialScroll(true);
  }, [currentDate]);

  return (
    <View
      style={{
        backgroundColor: Colors.secondary,
        paddingVertical: 20,
        paddingBottom: 0,
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <TouchableBase
          handleClick={() => changeMonth("back")}
          style={{
            opacity: backDisabled ? 0.5 : 1,
            width: 25,
            height: 25,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={Boolean(backDisabled)}
        >
          <ChevronRight
            width="12"
            height="10"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableBase>
        <DateTimePicker
          mode="date"
          value={new Date(currentDate)}
          setValue={(e) => setCurrentDate(new Date(e).getTime())}
          format={{ month: "long", year: "numeric" }}
          textStyle={{ fontWeight: "bold" }}
        />
        <TouchableBase
          handleClick={() => changeMonth("forwards")}
          style={{
            width: 25,
            height: 25,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronRight width="12" height="10" />
        </TouchableBase>
      </View>
      <ScrollView
        snapToInterval={32 + 15}
        ref={dateRef}
        onLayout={() => setInitialScroll()}
        style={{ width: "100%" }}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 25,
          paddingBottom: 20,
          gap: 25,
        }}
      >
        {getDaysInMonth()?.map((dayObj, count) => (
          <DateHeaderItem
            userColours={getDots()}
            dayObj={dayObj}
            key={`${dayObj.date}-${count}`}
            setCurrentDate={(e) => setCurrentDate(e)}
            currentDate={currentDate}
          />
        ))}
      </ScrollView>
    </View>
  );
};
