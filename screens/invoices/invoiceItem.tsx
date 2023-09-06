import { View, TouchableOpacity } from "react-native"
import { Box, Text, Seperator } from '../../components/Themed'
import Button, { TouchableBase } from "../../components/button"
import Svg, { Path } from "react-native-svg"
import { Alert, currencyPosition } from "../../hooks"
import Colors from "../../constants/Colors"
import { useState } from "react"
import axios from "axios"
import config from "../../config"

type PropsType = {
    invoiceData: { fullName?: string, paymentDue: number, distance: number, liters?: number, emailAddress?: string }
    invoiceID: number | string
    emailAddress?: string
    groupData: { currency: string, petrol: string, distance: string }
    openManageDistance: () => void | void
    authenticationKey?: string
    isPublic?: boolean
    invoicedBy?: string
}

export default ({ invoiceData, emailAddress, groupData, openManageDistance, authenticationKey, invoiceID, isPublic, invoicedBy }: PropsType) => {
    const [alertSent, setAlertSent] = useState(false)

    const sendAlert = () => {
        setAlertSent(true)
        axios
            .post(
                config.REACT_APP_API_ADDRESS +
                `/invoices/alert`, {
                authenticationKey: authenticationKey,
                invoiceID: invoiceID,
                fullName: invoiceData.fullName
            }
            )
            .then(() => {
                setAlertSent(false)
                Alert('Notification sent!', `A notification has been succesfully sent to ${invoiceData.fullName}!`)
            })
            .catch(({ response }) => {
                setAlertSent(false)
                Alert('Notification failed!', response.data)
            });

    }

    if (!invoiceData) return <></>

    return <><Box
        style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            backgroundColor: Colors.primary,
            borderColor: Colors.border,
        }}
    >
        <View
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginBottom: 10,
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {currencyPosition(invoiceData.paymentDue, groupData.currency)}
            </Text>
            {invoiceData.liters ? (
                <Text style={{ fontSize: 16 }}>
                    {invoiceData?.liters} {groupData.petrol}
                </Text>
            ) : (
                <></>
            )}
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                }}
            >
                {invoiceData.emailAddress === emailAddress && !isPublic ? 'You' : invoiceData.fullName} (
                <Text style={{ fontSize: 17 }}>
                    {invoiceData.distance} {groupData.distance}
                </Text>
                )
            </Text>
            {invoiceData.emailAddress === emailAddress || invoiceData.emailAddress === invoicedBy || isPublic || invoiceData.fullName === "Unaccounted Distance" ? <></> :
                <TouchableBase handleClick={sendAlert}>
                    <View style={{ width: 30, height: 30, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: Colors.tertiary, borderRadius: 4, justifyContent: 'center', alignItems: 'center', display: 'flex', borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border }}>
                        {alertSent ? <Svg
                            width="14"
                            height="14"
                            fill="none"
                            viewBox="0 0 16 16"
                        >
                            <Path
                                stroke="#fff"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.75 8.75l3.5 3.5 7-7.5"
                            ></Path>
                        </Svg> :
                            <Svg
                                width="14"
                                height="68"
                                fill="none"
                                viewBox="0 0 16 18"
                            >
                                <Path
                                    fill="#fff"
                                    d="M15.714 14.571v.858H.286v-.858L2 12.857V7.714a5.992 5.992 0 014.286-5.751v-.249a1.714 1.714 0 113.428 0v.249A5.992 5.992 0 0114 7.714v5.143l1.714 1.714zm-6 1.715a1.714 1.714 0 11-3.428 0"
                                ></Path>
                            </Svg>}
                    </View>
                </TouchableBase>}
        </View>
        {!isPublic && invoiceData.fullName === 'Unaccounted Distance' ? (
            <Button
                size="medium"
                style={{
                    marginTop: 10,
                    justifyContent: 'center',
                }}
                noText
                handleClick={openManageDistance}
                analyticsLabel="Assign Distance"
            >
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                    Assign Distance
                </Text>
            </Button>
        ) : (
            <></>
        )}
    </Box>
        {invoiceData.emailAddress === emailAddress && !isPublic ? <Seperator style={{ marginVertical: 15 }} /> : <></>}
    </>
}