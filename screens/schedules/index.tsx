/* eslint-disable */

import Popup from '@components/Popup';
import {Breadcrumbs} from '@components/Themed';
import Button, {TouchableBase} from '@components/button';
import Layout from '@components/layout';
import {Text} from '@components/text';
import {usePathname} from 'expo-router';
import {useState, useContext, useEffect, useRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {GestureHandlerRootView, PanGestureHandler, ScrollView} from 'react-native-gesture-handler';

import Create, {DataType} from './create';
import DateEntry from './home/dateEntry';
import ScheduleHeader from './home/scheduleHeader';
import Plus from '../../assets/icons/plus';
import Colors from '../../constants/Colors';
import {Alert} from '../../hooks';
import {AuthContext} from '../../hooks/context';
import {sendRequestToBackend} from 'hooks/sendRequestToBackend';

export type ScheduleType = {
    allDay: boolean;
    startDate: Date;
    endDate: string;
    summary?: string;
    fullName: string;
    emailAddress: string;
    userID: string;
    repeating?: string;
    repeatingEndDate?: number;
    changeFuture?: boolean;
    linkedSessionID?: number;
    custom?: {
        number: string;
        repeatingFormat: string;
        repeatingDays: string[];
    };
};

export const resetTime = (date: Date | string) => {
    const temp = new Date(date);
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
    const focused = usePathname();
    const [visible, setVisible] = useState(false);
    const date = new Date();
    const [currentDate, setCurrentDate] = useState(getInitialDate(date).getTime());
    const dateRef = useRef<ScrollView | null>(null);
    const [schedules, setSchedules] = useState<Record<number, Map<number, ScheduleType[]>[]> | []>(
        [],
    );
    const {retrieveData, isPremium} = useContext(AuthContext);
    const [popupData, setPopupData] = useState<{
        title: string;
        data?: DataType;
    }>({
        title: 'Add a new schedule',
    });
    const [userColors, setUserColors] = useState<{userID: string; colour: string}[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    const updateData = () => {
        setVisible(false);
        getSchedules();
    };
    const getSchedules = async () => {
        if (!retrieveData?.authenticationKey) return;
        const res = await sendRequestToBackend({
            url: `schedules/get?authenticationKey=${retrieveData?.authenticationKey}`,
        });

        if (!res?.ok) return setDataLoaded(true);
        const data: ScheduleType[] = await res.json();

        const splitSchedules: Map<number, ScheduleType[]> = new Map();
        for (const schedule of data) {
            const startDate = resetTime(schedule.startDate);
            const endDate = resetTime(schedule.endDate);
            if (
                !userColors?.length ||
                !userColors?.filter(user => user.userID === schedule.userID).length
            ) {
                setUserColors(colours => [
                    ...colours,
                    {
                        userID: schedule.userID,
                        colour: `${randomColour()}`,
                    },
                ]);
            }

            if (!splitSchedules.has(startDate.getTime()))
                splitSchedules.set(startDate.getTime(), []);
            splitSchedules.get(startDate.getTime())!.push({...schedule});

            const amountOfDays = Math.round(
                (resetTime(endDate).getTime() - resetTime(startDate).getTime()) /
                    (1000 * 3600 * 24),
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
                            e => resetTime(new Date(e.startDate)).getTime() === startDate.getTime(),
                        )
                )
                    continue;
                if (!splitSchedules.has(newDate.getTime()))
                    splitSchedules.set(newDate.getTime(), []);
                splitSchedules.get(newDate.getTime())!.push({...schedule});
            }
        }

        const monthSorted: Record<number, Map<number, ScheduleType[]>[]> = {};
        const sorted = [...splitSchedules.entries()].sort(([a], [b]) => a - b);
        sorted.map(([key, value]) => {
            const month = resetMonth(new Date(key)).getTime();
            const map = new Map().set(key, value);

            if (!Object.keys(monthSorted).filter(e => e === month.toString()).length)
                monthSorted[month] = [];
            monthSorted[month].push(map);
        });
        setSchedules(monthSorted);
    };
    // useEffect(() => {
    //   if (!isPremium) return navigation.navigate("/");
    // }, [isPremium]);

    useEffect(() => {
        if (retrieveData?.authenticationKey) getSchedules();
        // const interval = setInterval(() => {
        //   getSchedules();
        // }, 1000 * 60);
        // return () => clearInterval(interval);
    }, [retrieveData]);

    const randomColour = () => {
        const randomColours = [
            '#98FF68',
            '#6FFFCB',
            '#6B53FF',
            '#654DFF',
            '#F4FF7B',
            '#FFB672',
            '#FF7B7B',
            '#92DE90',
            '#F49A46',
            '#FDA8FF',
        ];

        const availableColours = randomColours.map(
            colour => Boolean(!userColors.filter(user => user.colour === colour).length) && colour,
        );
        return availableColours[Math.floor(Math.random() * availableColours.length)];
    };

    const expiredDate = currentDate < resetTime(date).getTime();

    useEffect(() => {
        if (!visible) {
            setPopupData({title: 'Add a new schedule'});
        }
    }, [visible]);

    const backDisabled = new Date(currentDate).getMonth() === new Date().getMonth();

    const handleEdit = (data: ScheduleType) => {
        if (data.linkedSessionID) {
            Alert('Edit schedule', 'Would you like to edit just this event or all future events?', [
                {
                    text: 'Current Event',
                    onPress: () => {
                        openPopup(data);
                    },
                },
                {
                    text: 'All Events',
                    onPress: () => {
                        openPopup({...data, changeFuture: true});
                    },
                },
            ]);
        } else openPopup(data);
    };

    const openPopup = (data: ScheduleType) => {
        setPopupData({
            title: 'Edit a schedule',
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
        });
        setVisible(true);
    };

    // if (!isPremium) return;

    return (
        <>
            <View
                style={{
                    paddingBottom: 15,
                    backgroundColor: Colors.primary,
                    paddingHorizontal: 25,
                }}
            >
                <Breadcrumbs
                    style={{marginBottom: 0}}
                    links={[
                        {
                            name: 'Dashboard',
                            screenName: '/',
                        },
                        {name: 'Schedules'},
                    ]}
                />
            </View>
            <ScheduleHeader currentDate={currentDate} />
            <Agenda
                items={Object.entries(schedules).map(([key, value]) => ({
                    [key]: [{name: 'test'}],
                }))}
                calendarStyle={{backgroundColor: Colors.secondary}}
                headerStyle={{backgroundColor: Colors.secondary, gap: 15}}
                enableSwipeMonths
                allowSelectionOutOfRange
                stickyHeaderHiddenOnScroll={false}
                minDate={new Date().toDateString()}
                showClosingKnob
                showsHorizontalScrollIndicator
                onDayChange={e => setCurrentDate(e.timestamp)}
                onDayPress={e => setCurrentDate(e.timestamp)}
                theme={{
                    backgroundColor: Colors.secondary,
                    calendarBackground: Colors.secondary,
                    textDisabledColor: 'rgba(255,255,255,0.5)',
                    textDayStyle: {
                        opacity: expiredDate ? 0.5 : 1,
                        color: 'white',
                    },
                    selectedDayTextColor: 'white',
                    todayTextColor: 'white',
                    selectedDayBackgroundColor: Colors.tertiary,
                }}
                style={{backgroundColor: Colors.secondary}}
                renderEmptyData={() => (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: Colors.background,
                            justifyContent: 'center',
                            alignContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: '300',
                                textAlign: 'center',
                                lineHeight: 24,
                                maxWidth: 325,
                            }}
                        >
                            There are no schedules for this date added. Please add a new schedule by
                            clicking the button below.
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
            />
        </>
    );

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
                    style={{marginBottom: 0}}
                    links={[
                        {
                            name: 'Dashboard',
                            screenName: '/',
                        },
                        {name: 'Schedules'},
                    ]}
                />
            </View>
            {dataLoaded ? (
                <>
                    <GestureHandlerRootView style={{flex: 1}}>
                        <PanGestureHandler onEnded={calculateDirection} minDist={10}>
                            <View style={{flex: 1, display: 'flex'}}>
                                <ScheduleHeader
                                    currentData={getCurrentData}
                                    changeMonth={changeMonth}
                                    userColours={userColors}
                                    backDisabled={backDisabled}
                                    currentDate={currentDate}
                                    setCurrentDate={e => setCurrentDate(new Date(e).getTime())}
                                />
                                <View style={{flex: 1}}>
                                    {getCurrentData &&
                                        getCurrentDayData.map((e, count) =>
                                            [...e].map(([day, schedule]) => {
                                                const dayObj = new Date(day);
                                                return (
                                                    <View
                                                        key={`${day}-${count}}`}
                                                        style={{flex: 1}}
                                                    >
                                                        <ScrollView
                                                            contentContainerStyle={{
                                                                width: '100%',
                                                                paddingVertical: 25,
                                                                display: 'flex',
                                                                gap: 15,
                                                                flexDirection: 'column',
                                                                flex: 1,
                                                            }}
                                                            style={{
                                                                marginHorizontal: 25,
                                                            }}
                                                        >
                                                            <>
                                                                {schedule
                                                                    .sort((a, b) =>
                                                                        a.startDate > b.startDate
                                                                            ? 1
                                                                            : -1,
                                                                    )
                                                                    .map((data, count) => {
                                                                        const startDate = new Date(
                                                                            data.startDate,
                                                                        );
                                                                        const endDate = new Date(
                                                                            data.endDate,
                                                                        );
                                                                        const amountOfDays =
                                                                            Math.round(
                                                                                (resetTime(
                                                                                    endDate,
                                                                                ).getTime() -
                                                                                    resetTime(
                                                                                        startDate,
                                                                                    ).getTime()) /
                                                                                    (1000 *
                                                                                        3600 *
                                                                                        24),
                                                                            );
                                                                        const currentDayCount =
                                                                            resetTime(
                                                                                dayObj,
                                                                            ).getTime() ===
                                                                            resetTime(
                                                                                startDate,
                                                                            ).getTime()
                                                                                ? 1
                                                                                : (resetTime(
                                                                                      dayObj,
                                                                                  ).getTime() -
                                                                                      resetTime(
                                                                                          startDate,
                                                                                      ).getTime()) /
                                                                                      (1000 *
                                                                                          3600 *
                                                                                          24) +
                                                                                  1;

                                                                        const hasMultipleDays =
                                                                            amountOfDays > 1;

                                                                        return (
                                                                            <DateEntry
                                                                                hasMultipleDays={
                                                                                    hasMultipleDays
                                                                                }
                                                                                currentDayCount={
                                                                                    currentDayCount
                                                                                }
                                                                                startDate={
                                                                                    startDate
                                                                                }
                                                                                endDate={endDate}
                                                                                colour={
                                                                                    userColors?.filter(
                                                                                        user =>
                                                                                            user.userID ===
                                                                                            data.userID,
                                                                                    )[0]?.colour
                                                                                }
                                                                                amountOfDays={
                                                                                    amountOfDays
                                                                                }
                                                                                data={data}
                                                                                emailAddress={
                                                                                    retrieveData?.emailAddress
                                                                                }
                                                                                key={`${count}-${day}`}
                                                                                handleEdit={
                                                                                    handleEdit
                                                                                }
                                                                            />
                                                                        );
                                                                    })}
                                                            </>
                                                        </ScrollView>
                                                        {!expiredDate && (
                                                            <View
                                                                style={{
                                                                    position: 'absolute',
                                                                    bottom: 15,
                                                                    right: 15,
                                                                }}
                                                            >
                                                                <TouchableBase
                                                                    handleClick={() =>
                                                                        setVisible(true)
                                                                    }
                                                                >
                                                                    <View
                                                                        style={{
                                                                            paddingHorizontal: 20,
                                                                            paddingVertical: 10,
                                                                            backgroundColor:
                                                                                Colors.tertiary,
                                                                            borderRadius: 8,
                                                                            borderStyle: 'solid',
                                                                            borderWidth: 1,
                                                                            borderColor:
                                                                                Colors.border,
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                        }}
                                                                    >
                                                                        <Plus
                                                                            width="14"
                                                                            height="14"
                                                                        />
                                                                        <Text
                                                                            style={{
                                                                                fontSize: 16,
                                                                                fontWeight: 'bold',
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
                                            }),
                                        )}
                                    {!getCurrentDayData?.length && (
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '300',
                                                    textAlign: 'center',
                                                    lineHeight: 24,
                                                    maxWidth: 325,
                                                }}
                                            >
                                                There are no schedules for this date added.{' '}
                                                {expiredDate
                                                    ? ''
                                                    : 'Please add a new schedule by clicking the button below.'}
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
                        title={popupData.title}
                    >
                        <Create
                            currentDate={currentDate}
                            onClose={updateData}
                            previousData={popupData.data}
                        />
                    </Popup>
                </>
            ) : (
                <View
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ActivityIndicator size="large" color={Colors.tertiary} />
                </View>
            )}
        </Layout>
    );
};
