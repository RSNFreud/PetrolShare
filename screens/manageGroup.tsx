import Svg, { Path, G } from "react-native-svg"
import ManageGroup from "../components/manageGroup"
import { TouchableWithoutFeedback } from "react-native"
import { Box, LongButton, Text } from '../components/Themed'
import { useContext, useEffect, useState } from "react"
import { Alert, getItem, setItem } from "../hooks"
import generateGroupID from "../hooks/generateGroupID"
import axios from "axios"
import config from "../config"
import { AuthContext } from "../hooks/context"
import Purchases from "react-native-purchases"


type GroupType = { currency: string, distance: string, groupID: string, petrol: string, premium: boolean }

export default () => {
    const [visible, setVisible] = useState(false)
    const [currentScreen, setCurrentScreen] = useState('')
    const [premium, setPremium] = useState(false)
    const { retrieveData } = useContext(AuthContext)

    useEffect(() => {
        let data: string | { currency: string, distance: string, groupID: string, petrol: string, premium: boolean } = getItem('groupData')
        if (data) data = JSON.parse(data)
        if ((data as GroupType).premium) setPremium(true)
        Purchases.getCustomerInfo().then(customerInfo => {
            if (typeof customerInfo.entitlements.active["premium"] !== "undefined") {
                setPremium(true)
            }
        }).catch(() => { })

        Purchases.addCustomerInfoUpdateListener(info => {
            if (info.entitlements.active["premium"]?.isActive) setPremium(true)
            else setPremium(false)
        });
    }, [])

    useEffect(() => {
        let data: string | { currency: string, distance: string, groupID: string, petrol: string, premium: boolean } = getItem('groupData')
        if (data) data = JSON.parse(data)
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
        let groupID = generateGroupID()
        Alert(
            "Are you sure you want to join a new group?",
            "This will delete all the current data you have saved.",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        setItem('groupData', '')
                        await axios.post(config.REACT_APP_API_ADDRESS + '/group/create', {
                            authenticationKey: retrieveData().authenticationKey,
                            groupID: groupID,
                        })
                        openModal("Settings")
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
                <Svg width="24" height="24" fill="none">
                    <Path fill="#fff" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2z"></Path>
                </Svg>
            } handleClick={createGroup} />
            <LongButton text="Join Group" icon={<Svg width="24" height="24" fill="none">
                <Path
                    fill="#fff"
                    d="M20 20l-.728-9.453L16 13.819 10.181 8l3.272-3.272L4 4l.728 9.453L8 10.181 13.819 16l-3.272 3.272L20 20z"
                ></Path>
            </Svg>} handleClick={() => openModal('JoinGroup')} />
            <LongButton text="Group Settings" icon={
                <Svg width="24" height="24" viewBox="0 0 60 56.34">
                    <G>
                        <Path
                            d="M16.7 22.7c-6.12-.43-12.62 1.41-16.7 6.2v18.34h9V36.83a24.6 24.6 0 0112.2-8.35 14.68 14.68 0 01-4.5-5.78zm-1.99-4.32h.68a14.34 14.34 0 016.89-13.93c-11.8-14.5-26.15 12.11-7.57 14zm29.52-1.66a13 13 0 010 1.53c20.14.29 5.91-29.46-6.56-13.58a14.5 14.5 0 016.56 12.05zM29.7 26.64c13.06-.33 13.06-19.47 0-19.8-13.06.33-13.05 19.47 0 19.8zm9.1 22.65c1.16 1.82 2.44 5.81 5.06 3.14a8.52 8.52 0 002 1.15c-1.06 3.62 3.22 2.59 5.31 2.71 1.38 0 1-1.85 1.06-2.71a8.79 8.79 0 002-1.15c.78.38 2.25 1.66 2.93.46 1-1.87 4-5 .28-5.85a8.13 8.13 0 000-2.31c.72-.46 2.57-1.07 1.84-2.25-1.16-1.81-2.45-5.81-5.06-3.14a8.52 8.52 0 00-2-1.15c1.06-3.61-3.22-2.59-5.31-2.7-1.38 0-1 1.84-1.06 2.7a8.52 8.52 0 00-2 1.15c-.78-.38-2.26-1.66-2.94-.45-1 1.86-3.94 5-.28 5.84a8.13 8.13 0 000 2.31c-.71.46-2.55 1.07-1.83 2.25zm10.26-7.56c5.58.09 5.58 8.22 0 8.32a4.16 4.16 0 110-8.32zm3.83-9.3c.69.52.33 2.47.41 3.19a11.38 11.38 0 012.7 1.54c1.09-.58 3.18-2.28 4-.44v-7.89c-4.07-4.91-10.92-6.83-17.12-6.06a14.58 14.58 0 01-4.43 5.42 24 24 0 017.8 3.81c.75.16 6.14-.36 6.64.43z"
                            fill="#fff"
                        ></Path>
                        <Path
                            d="M30.23 31.91a21.21 21.21 0 00-16.3 6.6c.92 3.14-2.71 17.89 3.54 17.43h21.59c-.78-.11-3.2-4.84-3.68-5.52-1-1.56 1.5-2.38 2.46-3a10.67 10.67 0 010-3.09c-5-1.46-.9-5.14.37-7.79.9-1.6 2.88.1 3.91.61a11.74 11.74 0 011.76-1 21.27 21.27 0 00-13.65-4.24z"
                            fill="#fff"
                        ></Path>
                    </G>
                </Svg>
            } handleClick={() => openModal("SettingsChange")} />
            <ManageGroup
                closeButton={true}
                handleClose={() => setVisible(false)}
                visible={visible}
                onComplete={() => { }}
                firstSteps={false}
                screen={currentScreen}
            />
        </>
    )
}