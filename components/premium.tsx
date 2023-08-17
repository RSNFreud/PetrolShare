import { Animated, Platform, TouchableWithoutFeedback, useWindowDimensions } from "react-native"
import { Text } from "./Themed"
import { useContext, useEffect, useRef } from 'react'
import Button from "./button"
import Colors from "../constants/Colors"
import Popup from "./Popup"
import { useState } from "react"
import { Alert, getItem, sendCustomEvent, setItem } from "../hooks"
import axios from "axios"
import Purchases from "react-native-purchases"
import config from "../config"
import { AuthContext } from "../hooks/context"
import { GroupType } from "./layout"

export default () => {
    const [premium, setPremium] = useState<null | boolean>(null)
    const [showPremiumInfo, setShowPremiumInfo] = useState(false)
    const { retrieveData, isLoading, setPremiumStatus } = useContext(AuthContext)
    const heightAnim = useRef(new Animated.Value(0)).current;
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (premium) return
        if (Platform.OS === "web") return
        if (retrieveData?.groupID)
            Purchases.logIn(retrieveData?.groupID).then(({ customerInfo }) => {
                if (typeof customerInfo.entitlements.active["premium"] !== "undefined") {
                    setPremium(true)
                }
            })
    }, [premium])
    useEffect(() => {
        if (!premium) expand()
        else minimise()
        if (setPremiumStatus && typeof premium === "boolean") setPremiumStatus(premium)
        let data: string | { currency: string, distance: string, groupID: string, petrol: string, premium: boolean } | undefined | null = getItem('groupData')
        if (data && typeof data === "string") data = JSON.parse(data)
        if (!(data as GroupType)?.premium && premium) {
            axios
                .post(
                    config.REACT_APP_API_ADDRESS +
                    '/group/subscribe', {
                    authenticationKey: retrieveData?.authenticationKey
                }).then(({ data }) => {
                    if (data) {
                        setTimeout(() => {
                            Alert('Premium Applied', 'Your group has succesfully activated premium membership! Thank you for joining PetrolShare')
                        }, 400);
                    }
                }).catch(err => {
                    console.log(err.message);
                })
        }
    }, [premium])
    useEffect(() => {
        if (Platform.OS === "web") return
        Purchases.addCustomerInfoUpdateListener(info => {
            if (info.entitlements.active["premium"]?.isActive) setPremium(true)
        });
    }, [])

    useEffect(() => {
        if (isLoading) return
        if (premium !== null) sendCustomEvent('closeSplash')
        let data: string | { currency: string, distance: string, groupID: string, petrol: string, premium: boolean } | undefined | null = getItem('groupData')
        if (data && typeof data === "string") data = JSON.parse(data)
        if ((data as GroupType)?.premium) setPremium(true)
        else setPremium(false)
    }, [getItem('groupData'), isLoading])

    const openPayment = async () => {
        if (Platform.OS === "web") return
        const product = await Purchases.getProducts(['premium_subscription'], Purchases.PRODUCT_CATEGORY.NON_SUBSCRIPTION)
        Purchases.purchaseStoreProduct(product[0], null).then(e => {
            setShowPremiumInfo(false)
            axios
                .post(
                    config.REACT_APP_API_ADDRESS +
                    '/group/subscribe', {
                    authenticationKey: retrieveData?.authenticationKey,
                }
                )
                .then(async () => {
                    axios
                        .get(
                            config.REACT_APP_API_ADDRESS +
                            '/group/get?authenticationKey=' +
                            retrieveData?.authenticationKey,
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
                setShowPremiumInfo(false)
                setTimeout(() => {
                    Alert("Your payment is being processed", "Thank you for choosing to upgrade! Your payment is currently being processed and will be applied automatically when complete!")
                }, 700);
            }
        })
    }

    const expand = () => {
        Animated.timing(heightAnim, {
            toValue: 68,
            delay: 400,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }

    const minimise = () => {
        Animated.timing(heightAnim, {
            toValue: 0,
            delay: 200,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    if (width > 768) return <></>

    return <>
        <Animated.View style={{ alignItems: 'center', backgroundColor: Colors.tertiary, maxHeight: heightAnim }}>
            <TouchableWithoutFeedback onPress={() => setShowPremiumInfo(true)}>
                <Text style={{ maxWidth: 300, textAlign: 'center', fontSize: 14, lineHeight: 24, padding: 10 }}>You are currently using the trial version of PetrolShare!
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}> Click here to learn more...</Text>
                </Text>
            </TouchableWithoutFeedback>
        </Animated.View>

        <Popup visible={showPremiumInfo} handleClose={() => setShowPremiumInfo(false)} title="PetrolShare Premium">
            <Text style={{ lineHeight: 24, marginBottom: 30 }}>You are currently using the free version of the PetrolShare app allowing you to have a maximum amount of 2 users in your group.
                {'\n\n'}
                By upgrading to our premium version, you gain access to have an unlimited amount of users in your group, plus other cool features to come!</Text>
            <Button style={{ marginBottom: 20 }} handleClick={openPayment} text="Purchase Premium" />
            <Button variant='ghost' handleClick={() => setShowPremiumInfo(false)} text="Dismiss" />
        </Popup>
    </>
}