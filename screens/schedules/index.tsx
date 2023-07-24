
import { ActivityIndicator, TouchableWithoutFeedback, View } from "react-native"
import Layout from "../../components/layout"
import { Breadcrumbs, Text } from "../../components/Themed"
import Colors from "../../constants/Colors"
import Svg, { Path } from "react-native-svg"
import { useState, useContext, useEffect, useRef } from "react"
import Popup from "../../components/Popup"
import Create from "./create"
import Button, { TouchableBase } from "../../components/button"
import axios from "axios"
import config from "../../config"
import { AuthContext } from "../../hooks/context"
import { useNavigation } from "@react-navigation/native"
import { GestureHandlerRootView, HandlerStateChangeEvent, PanGestureHandler, ScrollView } from "react-native-gesture-handler"

type ScheduleType = {
    allDay: string, startDate: Date, endDate: Date, summary?: string, fullName: string, emailAddress: string
}


const resetTime = (date: Date) => {
    let temp = new Date(date)
    return new Date(temp.setHours(0, 0, 0, 0))
}

const resetMonth = (date: Date) => {
    let temp = new Date(date)
    temp = new Date(temp.setHours(0, 0, 0, 0))
    temp = new Date(temp.setDate(1))
    return temp
}
const getInitialDate = (date: Date) => {
    let temp = new Date(date)
    temp = new Date(temp.setHours(0, 0, 0, 0))
    temp = new Date(temp.setDate(new Date().getDate()))
    return temp
}


export default () => {
    const [visible, setVisible] = useState(false)
    const date = new Date()
    const [currentDate, setCurrentDate] = useState(getInitialDate(date).getTime())
    const dateRef = useRef<ScrollView | null>(null)
    const gestureRef = useRef<PanGestureHandler | null>(null)
    const [schedules, setSchedules] = useState<Record<number, Map<number, ScheduleType[]>[]> | []>([])
    const { retrieveData } = useContext(AuthContext)
    const [dataLoaded, setDataLoaded] = useState(false);
    const navigation = useNavigation()

    const updateData = () => {
        setVisible(false)
        getSchedules()
    }

    useEffect(() => {
        if (retrieveData?.authenticationKey)
            getSchedules()

        navigation.addListener("focus", async () => {
            getSchedules();
            const date = new Date()
            setCurrentDate(getInitialDate(date).getTime())
        });
    }, [retrieveData])

    const getSchedules = () => {
        if (!retrieveData?.authenticationKey) return
        axios.get(config.REACT_APP_API_ADDRESS + `/schedules/get?authenticationKey=${retrieveData?.authenticationKey}`
        ).then(({ data }: { data: ScheduleType[] }) => {
            setDataLoaded(true)
            const splitSchedules: Map<number, ScheduleType[]> = new Map;
            for (const schedule of data) {
                const startDate = resetTime(schedule.startDate);
                const endDate = resetTime(schedule.endDate);

                // if (new Date().getTime() > new Date(schedule.endDate).getTime()) continue

                if (!splitSchedules.has(startDate.getTime())) splitSchedules.set(startDate.getTime(), []);
                splitSchedules.get(startDate.getTime())!.push({ ...schedule });

                const amountOfDays = Math.round((resetTime(endDate).getTime() - resetTime(startDate).getTime()) / (1000 * 3600 * 24))
                if (amountOfDays <= 1) continue;

                for (let i = 0; i < amountOfDays; i++) {
                    let newDate = resetTime(startDate);
                    newDate = new Date(newDate.setDate(newDate.getDate() + i));

                    // Remove possible duplicates
                    if (splitSchedules.get(newDate.getTime())?.some(e => resetTime(new Date(e.startDate)).getTime() === startDate.getTime())) continue;
                    if (!splitSchedules.has(newDate.getTime())) splitSchedules.set(newDate.getTime(), []);
                    splitSchedules.get(newDate.getTime())!.push({ ...schedule });
                }
            }

            const monthSorted: Record<number, Map<number, ScheduleType[]>[]> = {}
            const sorted = [...splitSchedules.entries()].sort(([a], [b]) => a - b);
            sorted.map(([key, value]) => {
                const month = resetMonth(new Date(key)).getTime()
                const map = new Map().set(key, value)

                if (!Object.keys(monthSorted).filter(e => e === month.toString()).length) monthSorted[month] = []
                monthSorted[month].push(map)
            })

            setSchedules(monthSorted)
        }).catch((err) => {
            console.log(err);
            setDataLoaded(true)
        })
    }

    const getCurrentData = Object.entries(schedules).filter(([key, _]) => key === resetMonth(new Date(currentDate)).getTime().toString())[0]
    const getCurrentDayData = getCurrentData && getCurrentData[1].filter(([day, _]) => day[0] === currentDate)

    const getDaysInMonth = () => {
        let date = resetMonth(new Date(currentDate));
        const targetMonth = date.getMonth()
        let dates = [];
        let i = 0;

        while (date.getMonth() === targetMonth) {
            const hasData = getCurrentData && getCurrentData[1].filter(([day, _]) => day[0] === date.getTime()).length
            dates.push({ date: new Date(date), active: hasData });
            date = new Date(date.setDate(date.getDate() + 1))
            i++;
        }
        return dates
    }

    const setInitialScroll = (animate: boolean = false) => {
        const ref = dateRef.current
        const date = new Date(currentDate)
        if (!ref) return
        ref.scrollTo({ y: 0, x: (date.getDate() - 4) * 32 + ((date.getDate() - 4) * 25), animated: animate })
    }

    const changeDate = (e: HandlerStateChangeEvent) => {
        const date = new Date(currentDate)
        if ((e.nativeEvent.translationX as number) > 0) date.setDate(date.getDate() - 1);
        else date.setDate(date.getDate() + 1);
        setCurrentDate(date.getTime())
    }

    useEffect(() => {
        setInitialScroll(true)
    }, [currentDate])

    const getDayString = (date: Date) => {
        const day = date.getDay()
        switch (day) {
            case 0:
                return 'Sun'
            case 1:
                return 'Mon'
            case 2:
                return 'Tue'
            case 3:
                return 'Wed'
            case 4:
                return 'Thu'
            case 5:
                return 'Fri'
            case 6:
                return 'Sat'
        }
    }


    return <Layout homepage noScrollView>
        <View style={{ paddingBottom: 15, backgroundColor: Colors.secondary, paddingHorizontal: 25 }}>
            <Breadcrumbs style={{ marginBottom: 0 }} links={[{
                name: 'Dashboard'
            }, { name: 'Schedules' }]} />
        </View>
        {dataLoaded ? <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler ref={gestureRef} onEnded={changeDate} >
                <View style={{ flex: 1, display: 'flex' }}>
                    <View style={{ backgroundColor: Colors.primary, paddingVertical: 20, paddingBottom: 0, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
                        <View><Text style={{ fontWeight: 'bold' }}>{new Date(currentDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text></View>
                        <ScrollView ref={dateRef} onLayout={() => setInitialScroll()} style={{ width: '100%' }} horizontal contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 20, gap: 25 }}>
                            {getDaysInMonth().map(dayObj => <TouchableWithoutFeedback touchSoundDisabled key={dayObj.date.toString()} onPress={() => setCurrentDate(dayObj.date.getTime())}>
                                <View>
                                    <View style={{ gap: 2, justifyContent: 'center', opacity: dayObj.date.getTime() === currentDate ? 1 : 0.5, width: 32 }}>
                                        <Text style={{ fontWeight: '300', textAlign: 'center' }}>{getDayString(dayObj.date)}</Text>
                                        <View style={{ width: 32, height: 32, borderRadius: 100, backgroundColor: currentDate === dayObj.date.getTime() ? Colors.tertiary : 'transparent', justifyContent: 'center', alignContent: 'center' }}>
                                            <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: 'center' }}>{dayObj.date.getDate()}</Text>
                                        </View>
                                    </View>
                                    {dayObj.active && Boolean(dayObj.date.getTime() !== currentDate) ? <View style={{ width: 5, height: 5, borderRadius: 100, backgroundColor: Colors.tertiary, position: 'absolute', bottom: -2, left: 14 }} /> : <></>}
                                </View>
                            </TouchableWithoutFeedback>
                            )}
                        </ScrollView>
                    </View>
                    <View style={{ paddingVertical: 25, paddingHorizontal: 25, flex: 1 }}>
                        {getCurrentData && getCurrentDayData.map(e => [...e].map(([day, schedule]) => {
                            const dayObj = new Date(day)
                            return <View key={day} style={{ flex: 1 }}>
                                <ScrollView simultaneousHandlers={[gestureRef]} contentContainerStyle={{ width: '100%' }}>
                                    <View style={{ gap: 25, marginBottom: 25 }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', gap: 24 }} key={day}>
                                            <View style={{ flex: 1, display: 'flex', gap: 10, flexDirection: 'column' }}>
                                                <>
                                                    {schedule.sort((a, b) => a.startDate > b.startDate ? 1 : -1).map((data, count) => {
                                                        const startDate = new Date(data.startDate)
                                                        const endDate = new Date(data.endDate)
                                                        const amountOfDays = Math.round((resetTime(endDate).getTime() - resetTime(startDate).getTime()) / (1000 * 3600 * 24))
                                                        const currentDayCount = resetTime(dayObj).getTime() === resetTime(startDate).getTime() ? '1' : (resetTime(dayObj).getTime() - resetTime(startDate).getTime()) / (1000 * 3600 * 24) + 1

                                                        const hasMultipleDays = amountOfDays > 1

                                                        return (
                                                            <View key={`${count}-${day}`} style={{ paddingVertical: 10, paddingHorizontal: 15, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border, borderRadius: 4, backgroundColor: retrieveData?.emailAddress === data.emailAddress ? Colors.primary : "" }}>
                                                                <Text style={{ fontWeight: '300', fontSize: 14 }}>{data.fullName} {hasMultipleDays && <>(Day {currentDayCount}/{amountOfDays})</>}</Text>
                                                                <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{(currentDayCount !== amountOfDays || !hasMultipleDays) && <>{startDate.toLocaleString(undefined, { minute: '2-digit', hour: '2-digit' })}</>
                                                                }
                                                                    {!hasMultipleDays && <> - </>}
                                                                    {(currentDayCount === amountOfDays || !hasMultipleDays) && <>{endDate.toLocaleString(undefined, { minute: '2-digit', hour: '2-digit' })}</>}</Text>
                                                            </View>
                                                        )
                                                    })}
                                                </>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                <View style={{ position: 'absolute', bottom: 15, right: 15 }}>
                                    <TouchableBase handleClick={() => setVisible(true)} >
                                        <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.tertiary, borderRadius: 8, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Svg
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <Path fill="#fff" d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2z"></Path>
                                            </Svg>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Add</Text>
                                        </View>
                                    </TouchableBase>
                                </View>
                            </View>
                        }))}
                        {!getCurrentDayData?.length &&
                            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '300', textAlign: 'center', lineHeight: 24, maxWidth: 325 }}>There are no schedules for this date added. Please add a new schedule by clicking the button below.</Text>
                                <Button size="medium" handleClick={() => setVisible(true)} style={{ width: 153, marginTop: 15, borderRadius: 8, height: 44 }} icon={<Svg
                                    width="14"
                                    height="14"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <Path fill="#fff" d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2z" />
                                </Svg>} text="Add" />
                            </View>
                        }
                    </View>
                </View>
            </PanGestureHandler>

            <Popup children={<Create onClose={updateData} />} visible={visible} handleClose={() => setVisible(false)} />
        </GestureHandlerRootView> :
            <View style={{ flex: 1, display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={"large"} color={Colors.tertiary} />
            </View>
        }
    </Layout>
}