import Svg, { Path, G } from "react-native-svg"
import { TouchableWithoutFeedback } from "react-native"
import { Box, LongButton, Text } from '../components/Themed'
import { useContext, useEffect, useState } from "react"
import { Alert, getItem, setItem } from "../hooks"
import axios from "axios"
import config from "../config"
import { AuthContext } from "../hooks/context"
import Purchases from "react-native-purchases"
import Popup from "../components/Popup"
import CreateGroup from "../components/createGroup"
import GroupSettings from "../components/groupSettings"
import JoinGroup from "../components/joinGroup"


type GroupType = { currency: string, distance: string, groupID: string, petrol: string, premium: boolean }

export default ({ onUpdate }: { onUpdate: () => void }) => {
    const [visible, setVisible] = useState(false)
    const [currentScreen, setCurrentScreen] = useState('')
    const [premium, setPremium] = useState(false)
    const { retrieveData } = useContext(AuthContext)

    useEffect(() => {
        let data: string | { currency: string, distance: string, groupID: string, petrol: string, premium: boolean } | undefined | null = getItem('groupData')
        if (data && typeof data === "string") data = JSON.parse(data)
        if ((data as GroupType).premium) setPremium(true)
        else setPremium(false)
        Purchases.getCustomerInfo().then(customerInfo => {
            if (typeof customerInfo.entitlements.active["premium"] !== "undefined") {
                setPremium(true)
            }
        }).catch(() => { })

        Purchases.addCustomerInfoUpdateListener(info => {
            if (info.entitlements.active["premium"]?.isActive) setPremium(true)
        });
    }, [])

    useEffect(() => {
        let data: string | { currency: string, distance: string, groupID: string, petrol: string, premium: boolean } | undefined | null = getItem('groupData')
        if (data && typeof data === "string") data = JSON.parse(data)
        if ((data as GroupType).premium) setPremium(true)
        else setPremium(false)
    }, [getItem('groupData')])

    useEffect(() => {
        let data: string | { currency: string, distance: string, groupID: string, petrol: string, premium: boolean } | undefined | null = getItem('groupData')
        if (data && typeof data === "string") data = JSON.parse(data)
        if (!(data as GroupType).premium && premium) {
            axios
                .post(
                    config.REACT_APP_API_ADDRESS +
                    '/group/subscribe', {
                    authenticationKey: retrieveData().authenticationKey
                }).catch(err => {
                    console.log(err.message);
                })
        }
    }, [premium])

    const createGroup = async () => {
        Alert(
            "Are you sure you want to create a new group?",
            "This will delete all the current data you have saved.",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        openModal("CreateGroup")
                    },
                },
                { text: "No", style: "cancel" },
            ]
        );
    }

    const openPayment = () => {
        Purchases.purchaseProduct('premium_subscription', null, Purchases.PURCHASE_TYPE.INAPP).then(e => {
            axios
                .post(
                    config.REACT_APP_API_ADDRESS +
                    '/group/subscribe', {
                    authenticationKey: retrieveData().authenticationKey,
                }
                )
                .then(async () => {
                    axios
                        .get(
                            config.REACT_APP_API_ADDRESS +
                            '/group/get?authenticationKey=' +
                            retrieveData().authenticationKey,
                        )
                        .then(async ({ data }) => {
                            setItem('groupData', JSON.stringify(data))
                        })
                        .catch(() => { })
                })
                .catch(() => { })
            setPremium(true)
        }).catch(err => {
            if (err.message === 'The payment is pending.') {
                setTimeout(() => {
                    Alert("Your payment is being processed", "Thank you for choosing to upgrade! Your payment is currently being processed and will be applied automatically when complete!")
                }, 700);
            }
        })
    }

    const openModal = (modal: string) => {
        setCurrentScreen(modal)
        setVisible(true)
    }

    const handleClose = () => {
        setVisible(false);
        onUpdate();
    }

    return (
        <>
            <Box style={{ marginBottom: 25, paddingHorizontal: 25, paddingVertical: 25 }}>
                {premium ?
                    <Text>
                        You are currently on the <Text style={{ color: '#7CFF5B' }}>PREMIUM</Text> version of Petrolshare. This unlocks all the features of the application. Thank you for supporting us!
                    </Text> :
                    <>
                        <Text>
                            You are currently on the <Text style={{ color: '#FA4F4F' }}>FREE</Text> version of Petrolshare. This locks you to having a maximum of 2 users in your group.
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                            To upgrade,
                            <TouchableWithoutFeedback><Text style={{ fontWeight: 'bold' }} onPress={openPayment}> click here!</Text></TouchableWithoutFeedback>
                        </Text>
                    </>
                }
            </Box>
            <LongButton text="Create group" icon={
                <Svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <Path
                        fill="#fff"
                        d="M3 15.667V19h3.333l9.83-9.83-3.333-3.333L3 15.667zm15.74-9.074a.885.885 0 000-1.253l-2.08-2.08a.886.886 0 00-1.253 0l-1.626 1.626 3.333 3.333 1.626-1.626z"
                    ></Path>
                </Svg>
            } handleClick={createGroup} />
            <LongButton text="Join Group" icon={<Svg width="20" height="20" fill="none">
                <Path
                    fill="#fff"
                    d="M8.857 18v-6.857H2V8.857h6.857V2h2.286v6.857H18v2.286h-6.857V18H8.857z"
                ></Path>
            </Svg>} handleClick={() => openModal('JoinGroup')} />
            <LongButton text="Group Settings" icon={
                <Svg width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20">
                    <Path
                        fill="#fff"
                        d="M10.004 7.277c-.706 0-1.367.26-1.867.733a2.425 2.425 0 00-.774 1.768c0 .669.276 1.294.774 1.768.5.472 1.161.734 1.867.734s1.366-.262 1.867-.734c.498-.473.774-1.1.774-1.768 0-.668-.276-1.294-.774-1.768a2.632 2.632 0 00-.856-.544 2.746 2.746 0 00-1.011-.189zm9.73 5.264l-1.543-1.25a7.624 7.624 0 000-2.579l1.543-1.25c.117-.094.2-.22.24-.36a.68.68 0 00-.02-.426l-.022-.058a9.78 9.78 0 00-1.878-3.078l-.043-.047a.764.764 0 00-.38-.228.798.798 0 00-.448.015l-1.916.646a8.364 8.364 0 00-2.35-1.285L12.545.743a.705.705 0 00-.21-.377.771.771 0 00-.4-.197l-.063-.011a11.22 11.22 0 00-3.748 0l-.063.01a.771.771 0 00-.4.198.705.705 0 00-.21.377L7.08 2.65a8.464 8.464 0 00-2.334 1.28l-1.93-.65a.795.795 0 00-.45-.016.761.761 0 00-.38.229l-.042.047A9.855 9.855 0 00.066 6.618l-.021.058a.694.694 0 00.22.787l1.561 1.262a7.452 7.452 0 000 2.549L.27 12.537a.713.713 0 00-.24.36.68.68 0 00.02.426l.022.059A9.806 9.806 0 001.95 16.46l.043.046c.099.111.231.19.379.228a.799.799 0 00.449-.015l1.93-.65a8.293 8.293 0 002.335 1.28l.372 1.907a.705.705 0 00.21.377.771.771 0 00.4.197l.063.012c1.24.21 2.508.21 3.748 0l.063-.012a.772.772 0 00.4-.197.706.706 0 00.21-.377l.37-1.898a8.423 8.423 0 002.35-1.285l1.917.646a.796.796 0 00.449.016.762.762 0 00.379-.229l.043-.046a9.856 9.856 0 001.878-3.078l.021-.059a.697.697 0 00-.224-.782zm-9.73 1.167c-2.292 0-4.149-1.76-4.149-3.93s1.857-3.93 4.149-3.93c2.291 0 4.149 1.76 4.149 3.93s-1.858 3.93-4.15 3.93z"
                    ></Path>
                </Svg>
            } handleClick={() => openModal("Settings")} />
            <Popup visible={visible} handleClose={() => { setVisible(false), onUpdate() }}
            >
                {currentScreen === "JoinGroup" ? <JoinGroup handleClose={handleClose} handleUpdate={onUpdate} /> : <></>}
                {currentScreen === "CreateGroup" ? <CreateGroup handleClose={handleClose} handleUpdate={onUpdate} /> : <></>}
                {currentScreen === "Settings" ? <GroupSettings handleComplete={handleClose} /> : <></>}
            </Popup>
        </>
    )
}