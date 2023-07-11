
import { ActivityIndicator, ScrollView, View } from "react-native"
import Layout from "../../components/layout"
import { Breadcrumbs, Text } from "../../components/Themed"
import Colors from "../../constants/Colors"
import Svg, { Path } from "react-native-svg"
import { useState, useContext, useEffect } from "react"
import Popup from "../../components/Popup"
import Create from "./create"
import Button, { TouchableBase } from "../../components/button"
import axios from "axios"
import config from "../../config"
import { AuthContext } from "../../hooks/context"
import { convertHexToRGBA } from "../../hooks"
import { useNavigation } from "@react-navigation/native"

type ScheduleType = {
    allDay: string, startDate: string, endDate: string, summary?: string, fullName: string, emailAddress: string
}


export default () => {
    const [visible, setVisible] = useState(false)
    const [schedules, setSchedules] = useState<[number, ScheduleType[]][] | []>([])
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
        });
    }, [retrieveData])

    const getSchedules = () => {
        if (!retrieveData?.authenticationKey) return
        axios.get(config.REACT_APP_API_ADDRESS + `/schedules/get?authenticationKey=${retrieveData?.authenticationKey}`
        ).then(({ data }) => {
            setDataLoaded(true)
            const splitSchedules: Map<number, ScheduleType[]> = new Map;
            for (const schedule of data) {
                const startDate = resetTime(schedule.startDate);
                const endDate = resetTime(schedule.endDate);

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

            const sorted = [...splitSchedules.entries()].sort(([a], [b]) => a - b);

            setSchedules(sorted)
        }).catch((err) => {
            console.log(err);
        })
    }

    const resetTime = (date: Date) => {
        let temp = new Date(date)
        return new Date(temp.setHours(0, 0, 0, 0))
    }

    const randomBlue = () => {
        return "rgb(0, 0, " + (Math.floor(Math.random() * 255)) + ")";
    }

    return <Layout homepage>
        <View style={{ paddingBottom: 15, backgroundColor: Colors.secondary, paddingHorizontal: 25 }}>
            <Breadcrumbs style={{ marginBottom: 0 }} links={[{
                name: 'Dashboard'
            }, { name: 'Schedules' }]} />
        </View>
        {dataLoaded ? <>
            {Object.keys(schedules).length === 0 ?
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '300', textAlign: 'center', lineHeight: 24, maxWidth: 325 }}>There are no schedules added. Please add a new schedule by clicking the button below.</Text>
                    <Button size="medium" handleClick={() => setVisible(true)} style={{ width: 153, marginTop: 15, borderRadius: 8, height: 44 }} icon={<Svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <Path fill="#fff" d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2z" />
                    </Svg>} text="Add" />
                </View> :
                <View style={{ paddingHorizontal: 25, paddingVertical: 30, flex: 1, display: 'flex' }}>
                    <ScrollView contentContainerStyle={{ gap: 25 }}>
                        {schedules.map(([day, schedule]) => {
                            const dayObj = new Date(day)
                            return <>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 24 }} key={''}>
                                    <View style={{ width: 35 }}>
                                        <Text style={{ fontWeight: '300', textAlign: 'center' }}>{dayObj.toLocaleString(undefined, { weekday: 'short' })}</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: 'center' }}>{dayObj.getDate()}</Text>
                                    </View>
                                    <View style={{ flex: 1, display: 'flex', gap: 10, flexDirection: 'column' }}>
                                        {schedule.map((data, count) => {
                                            const startDate = new Date(data.startDate)
                                            const endDate = new Date(data.endDate)
                                            const amountOfDays = Math.round((resetTime(endDate).getTime() - resetTime(startDate).getTime()) / (1000 * 3600 * 24))
                                            const currentDayCount = resetTime(dayObj).getTime() === resetTime(startDate).getTime() ? '1' : (resetTime(dayObj).getTime() - resetTime(startDate).getTime()) / (1000 * 3600 * 24) + 1

                                            const hasMultipleDays = amountOfDays > 1

                                            return (
                                                <View key={`${count}-${day}`} style={{ paddingVertical: 10, paddingHorizontal: 15, borderStyle: 'solid', borderWidth: 1, borderColor: retrieveData?.emailAddress === data.emailAddress ? Colors.tertiary : Colors.border, borderRadius: 4, backgroundColor: retrieveData?.emailAddress === data.emailAddress ? convertHexToRGBA(Colors.tertiary, 0.5) : Colors.secondary }}>
                                                    <Text style={{ fontWeight: '300', fontSize: 14 }}>{data.fullName} {hasMultipleDays && <>(Day {currentDayCount}/{amountOfDays})</>}</Text>
                                                    <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{(currentDayCount !== amountOfDays || !hasMultipleDays) && <>{startDate.toLocaleString(undefined, { minute: '2-digit', hour: '2-digit' })}</>
                                                    }
                                                        {!hasMultipleDays && <> - </>}
                                                        {(currentDayCount === amountOfDays || !hasMultipleDays) && <>{endDate.toLocaleString(undefined, { minute: '2-digit', hour: '2-digit' })}</>}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View >
                            </>
                        })}
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
            }
            <Popup children={<Create onClose={updateData} />} visible={visible} handleClose={() => setVisible(false)} />
        </> :
            <View style={{ flex: 1, display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={"large"} color={Colors.tertiary} />
            </View>
        }
    </Layout>
}