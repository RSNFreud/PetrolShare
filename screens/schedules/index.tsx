import { ActivityIndicator, View } from "react-native";
import Layout from "../../components/layout";
import { Breadcrumbs, Text } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { useState, useContext, useEffect, useRef } from "react";
import Popup from "../../components/Popup";
import Create from "./create";
import Button, { TouchableBase } from "../../components/button";
import axios from "axios";
import config from "../../config";
import { AuthContext } from "../../hooks/context";
import { useNavigation } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";
import Plus from "../../assets/icons/plus";
import ScheduleHeader from "./home/scheduleHeader";
import DateEntry from "./home/dateEntry";

export type ScheduleType = {
  allDay: string;
  startDate: Date;
  endDate: Date;
  summary?: string;
  fullName: string;
  emailAddress: string;
  userID: string;
};

export const resetTime = (date: Date) => {
  let temp = new Date(date);
  return new Date(temp.setHours(0, 0, 0, 0));
};

export const resetMonth = (date: Date) => {
  let temp = new Date(date);
  temp = new Date(temp.setHours(0, 0, 0, 0));
  temp = new Date(temp.setDate(1));
  return temp;
};
export const getInitialDate = (date: Date) => {
  let temp = new Date(date);
  temp = new Date(temp.setHours(0, 0, 0, 0));
  temp = new Date(temp.setDate(new Date().getDate()));
  return temp;
};

export default () => {
  const [visible, setVisible] = useState(false);
  const date = new Date();
  const [currentDate, setCurrentDate] = useState(
    getInitialDate(date).getTime()
  );
  const dateRef = useRef<ScrollView | null>(null);
  const [schedules, setSchedules] = useState<
    Record<number, Map<number, ScheduleType[]>[]> | []
  >([]);
  const { retrieveData, isPremium } = useContext(AuthContext);
  const [userColors, setUserColors] = useState<
    { userID: string; colour: string }[]
  >([]);
  const [isOpened, setIsOpened] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigation = useNavigation();

  const updateData = () => {
    setVisible(false);
    getSchedules();
  };

  useEffect(() => {
    if (!isPremium) return navigation.navigate("Dashboard");
  }, [isPremium]);

  useEffect(() => {
    if (retrieveData?.authenticationKey) getSchedules();

    navigation.addListener("focus", async () => {
      setTimeout(() => {
        getSchedules();
      }, 300);
      const date = new Date();
      setCurrentDate(getInitialDate(date).getTime());
    });
  }, [retrieveData]);

  const randomColour = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
  const getSchedules = () => {
    if (!retrieveData?.authenticationKey) return;
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/schedules/get?authenticationKey=${retrieveData?.authenticationKey}`
      )
      .then(({ data }: { data: ScheduleType[] }) => {
        setDataLoaded(true);
        const splitSchedules: Map<number, ScheduleType[]> = new Map();
        for (const schedule of data) {
          const startDate = resetTime(schedule.startDate);
          const endDate = resetTime(schedule.endDate);
          if (
            !userColors?.length ||
            !userColors?.filter((user) => user.userID === schedule.userID)
              .length
          ) {
            setUserColors((colours) => [
              ...colours,
              {
                userID: schedule.userID,
                colour: `${randomColour()}`,
              },
            ]);
          }

          if (!splitSchedules.has(startDate.getTime()))
            splitSchedules.set(startDate.getTime(), []);
          splitSchedules.get(startDate.getTime())!.push({ ...schedule });

          const amountOfDays = Math.round(
            (resetTime(endDate).getTime() - resetTime(startDate).getTime()) /
              (1000 * 3600 * 24)
          );
          if (amountOfDays <= 1) continue;

          for (let i = 0; i < amountOfDays; i++) {
            let newDate = resetTime(startDate);
            newDate = new Date(newDate.setDate(newDate.getDate() + i));

            // Remove possible duplicates
            if (
              splitSchedules
                .get(newDate.getTime())
                ?.some(
                  (e) =>
                    resetTime(new Date(e.startDate)).getTime() ===
                    startDate.getTime()
                )
            )
              continue;
            if (!splitSchedules.has(newDate.getTime()))
              splitSchedules.set(newDate.getTime(), []);
            splitSchedules.get(newDate.getTime())!.push({ ...schedule });
          }
        }

        const monthSorted: Record<number, Map<number, ScheduleType[]>[]> = {};
        const sorted = [...splitSchedules.entries()].sort(([a], [b]) => a - b);
        sorted.map(([key, value]) => {
          const month = resetMonth(new Date(key)).getTime();
          const map = new Map().set(key, value);

          if (
            !Object.keys(monthSorted).filter((e) => e === month.toString())
              .length
          )
            monthSorted[month] = [];
          monthSorted[month].push(map);
        });

        setSchedules(monthSorted);
      })
      .catch((err) => {
        console.log(err);
        setDataLoaded(true);
      });
  };

  const getCurrentData = Object.entries(schedules).filter(
    ([key, _]) => key === resetMonth(new Date(currentDate)).getTime().toString()
  )[0];
  const getCurrentDayData =
    getCurrentData &&
    getCurrentData[1].filter(([day, _]) => day[0] === currentDate);

  const expiredDate = currentDate < resetTime(date).getTime();

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

  const calculateDirection = (e: HandlerStateChangeEvent) => {
    if ((e.nativeEvent.translationX as number) > 0) changeDate("forwards");
    else changeDate("back");
  };

  const changeDate = (e: "forwards" | "back") => {
    const date = new Date(currentDate);
    if (e === "forwards") date.setDate(date.getDate() - 1);
    else date.setDate(date.getDate() + 1);
    if (date.getMonth() < new Date(currentDate).getMonth()) return;

    setCurrentDate(date.getTime());
  };

  const changeMonth = (e: "forwards" | "back") => {
    const date = new Date(currentDate);
    if (e === "forwards") {
      date.setMonth(date.getMonth() + 1, 1);
    } else {
      date.setMonth(date.getMonth(), 0);
    }

    if (e === "back" && date.getMonth() + 1 < new Date().getMonth()) return;

    setCurrentDate(date.getTime());
  };

  useEffect(() => {
    setInitialScroll(true);
    setIsOpened(0);
  }, [currentDate]);

  const backDisabled =
    new Date(currentDate).getMonth() === new Date().getMonth();

  if (!isPremium) return;

  return (
    <Layout homepage noScrollView>
      <View
        style={{
          paddingBottom: 15,
          backgroundColor: Colors.primary,
          paddingHorizontal: 25,
        }}
      >
        <Breadcrumbs
          style={{ marginBottom: 0 }}
          links={[
            {
              name: "Dashboard",
              screenName: "Home",
            },
            { name: "Schedules" },
          ]}
        />
      </View>
      {dataLoaded ? (
        <>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onEnded={calculateDirection} minDist={10}>
              <View style={{ flex: 1, display: "flex" }}>
                <ScheduleHeader
                  currentData={getCurrentData}
                  changeMonth={changeMonth}
                  userColours={userColors}
                  backDisabled={backDisabled}
                  currentDate={currentDate}
                  setCurrentDate={(e) => setCurrentDate(new Date(e).getTime())}
                />
                <View style={{ flex: 1 }}>
                  {getCurrentData &&
                    getCurrentDayData.map((e) =>
                      [...e].map(([day, schedule]) => {
                        const dayObj = new Date(day);

                        return (
                          <View key={day} style={{ flex: 1 }}>
                            <ScrollView
                              contentContainerStyle={{
                                width: "100%",
                                paddingVertical: 25,
                                display: "flex",
                                gap: 15,
                                flexDirection: "column",
                                flex: 1,
                              }}
                              style={{
                                marginHorizontal: 25,
                              }}
                            >
                              <>
                                {schedule
                                  .sort((a, b) =>
                                    a.startDate > b.startDate ? 1 : -1
                                  )
                                  .map((data, count) => {
                                    const startDate = new Date(data.startDate);
                                    const endDate = new Date(data.endDate);
                                    const amountOfDays = Math.round(
                                      (resetTime(endDate).getTime() -
                                        resetTime(startDate).getTime()) /
                                        (1000 * 3600 * 24)
                                    );
                                    const currentDayCount =
                                      resetTime(dayObj).getTime() ===
                                      resetTime(startDate).getTime()
                                        ? 1
                                        : (resetTime(dayObj).getTime() -
                                            resetTime(startDate).getTime()) /
                                            (1000 * 3600 * 24) +
                                          1;

                                    const hasMultipleDays = amountOfDays > 1;

                                    return (
                                      <DateEntry
                                        hasMultipleDays={hasMultipleDays}
                                        currentDayCount={currentDayCount}
                                        startDate={startDate}
                                        endDate={endDate}
                                        colour={
                                          userColors?.filter(
                                            (user) =>
                                              user.userID === data.userID
                                          )[0]?.colour
                                        }
                                        amountOfDays={amountOfDays}
                                        data={data}
                                        emailAddress={
                                          retrieveData?.emailAddress
                                        }
                                        key={`${count}-${day}`}
                                        onPress={() =>
                                          isOpened === startDate.getTime()
                                            ? setIsOpened(0)
                                            : setIsOpened(startDate.getTime())
                                        }
                                      />
                                    );
                                  })}
                              </>
                            </ScrollView>
                            {!expiredDate && (
                              <View
                                style={{
                                  position: "absolute",
                                  bottom: 15,
                                  right: 15,
                                }}
                              >
                                <TouchableBase
                                  handleClick={() => setVisible(true)}
                                >
                                  <View
                                    style={{
                                      paddingHorizontal: 20,
                                      paddingVertical: 10,
                                      backgroundColor: Colors.tertiary,
                                      borderRadius: 8,
                                      borderStyle: "solid",
                                      borderWidth: 1,
                                      borderColor: Colors.border,
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Plus width="14" height="14" />
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        marginLeft: 10,
                                      }}
                                    >
                                      Add
                                    </Text>
                                  </View>
                                </TouchableBase>
                              </View>
                            )}
                          </View>
                        );
                      })
                    )}
                  {!getCurrentDayData?.length && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "300",
                          textAlign: "center",
                          lineHeight: 24,
                          maxWidth: 325,
                        }}
                      >
                        There are no schedules for this date added.{" "}
                        {expiredDate
                          ? ""
                          : "Please add a new schedule by clicking the button below."}
                      </Text>
                      {!expiredDate && (
                        <Button
                          size="medium"
                          handleClick={() => setVisible(true)}
                          style={{
                            width: 153,
                            marginTop: 15,
                            borderRadius: 8,
                            height: 44,
                          }}
                          icon={<Plus width="14" height="14" />}
                          text="Add"
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>
            </PanGestureHandler>
          </GestureHandlerRootView>

          <Popup
            visible={visible}
            handleClose={() => setVisible(false)}
            title="Add a new schedule"
          >
            <Create currentDate={currentDate} onClose={updateData} />
          </Popup>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.tertiary} />
        </View>
      )}
    </Layout>
  );
};
