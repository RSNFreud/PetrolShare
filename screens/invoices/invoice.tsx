import { useContext, useEffect, useState } from 'react'
import { Box, Text } from '../../components/Themed'
import * as Sharing from 'expo-sharing';
import { ActivityIndicator, LayoutChangeEvent, Platform, ScrollView, Share, TouchableOpacity, View } from 'react-native'
import axios from 'axios'
import { AuthContext } from '../../hooks/context'
import {
  Alert,
  convertToDate,
  convertToSentenceCase,
  currencyPosition,
  getGroupData,
  getItem,
} from '../../hooks'
import Toast from 'react-native-toast-message'
import { convertCurrency } from '../../hooks/getCurrencies'
import config from '../../config'
import AssignDistance from '../../components/assignDistance'
import Colors from '../../constants/Colors'
import Svg, { Path } from 'react-native-svg'
import InvoiceItem from './invoiceItem'
import { useNavigation } from '@react-navigation/native'

type PropsType = {
  invoiceID: number | string
  isPublic?: boolean
}

const SummaryItem = ({ title, value, width }: { title: string, value: string, width: number }) => (<View>
  <Text style={{ color: 'white', fontSize: 14, fontWeight: '300', lineHeight: 21, width }}>{title}</Text>
  <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 24, width }}>{value}</Text>
</View>)

const calculateWidth = (containerWidth: number, gap: number, items: number) => {
  return containerWidth / items - (gap / items)
}

export default ({ invoiceID, isPublic }: PropsType) => {
  const [data, setData] = useState<any>({})
  const [itemWidth, setItemWidth] = useState(0)
  const { retrieveData } = useContext(AuthContext)
  useEffect(() => {
    getInvoice()
  }, [])
  const [manageDistanceOpen, setManageDistanceOpen] = useState(false)
  const navigate = useNavigation()

  const [groupData, setGroupData] = useState({
    distance: '',
    currency: '',
    petrol: '',
  })

  useEffect(() => {
    init()
  }, [])

  const handleUpdate = () => {
    handleClose()
    getInvoice()
    Toast.show({
      type: 'default',
      text1: 'Successfully updated distances!',
    })
  }

  const handleClose = () => {
    setManageDistanceOpen(false)
  }

  const init = async () => {
    const getSymbol = getItem('currencySymbol')
    if (getSymbol)
      setGroupData({
        ...groupData,
        currency: getSymbol || '',
      })

    const data = await getGroupData()
    if (!data) return
    setGroupData({ ...groupData, distance: data.distance })
    const currency = await convertCurrency(data.currency)
    data.currency = currency
    setGroupData(data)
  }

  const getInvoice = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
        `/invoices/get?authenticationKey=${retrieveData().authenticationKey
        }&invoiceID=${invoiceID}`,
      )
      .then(async ({ data }) => {
        setData({ ...data, invoiceData: JSON.parse(data.invoiceData) })
      })
      .catch(({ response }) => {
        console.log(response.message)

        Alert('Invalid Payment', 'This payment log does not exist!')
        navigate.navigate('Payments')
      })
  }

  if (Object.keys(data).length === 0)
    return (
      <>
        <ActivityIndicator size={'large'} color={Colors.tertiary} />
      </>
    )

  const setWidth = (e: LayoutChangeEvent) => {
    setItemWidth(calculateWidth(e.nativeEvent.layout.width, 0, 2))
  }

  const sendLink = async () => {
    if (!invoiceID) return
    if (Platform.OS === "web")
      navigate.navigate('PublicInvoice', { paymentID: invoiceID })
    else
      Share.share({ message: `I have filled up with petrol! Please see the following link to see how much you owe! ${config.REACT_APP_ADDRESS}/payments/public/${invoiceID}`, title: 'Share Petrol Invoice' })
  }

  return (
    <>
      <Box style={{ paddingHorizontal: 15, marginBottom: 15 }} onLayout={setWidth}>
        <View
          style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}
        >
          <SummaryItem width={itemWidth} title='Invoiced By:' value={data.fullName} />
          <SummaryItem width={itemWidth} title='Invoice Date:' value={convertToDate(data.sessionEnd)} />
        </View>
        <View
          style={{ display: 'flex', flexDirection: 'row', marginBottom: Boolean(data.pricePerLiter) ? 10 : 0, justifyContent: 'space-between' }}
        >
          <SummaryItem width={itemWidth} title='Amount Paid:' value={currencyPosition(data.totalPrice, groupData.currency)} />
          <SummaryItem width={itemWidth} title='Total Distance:' value={`${data.totalDistance} ${groupData?.distance}`} />
        </View>
        {Boolean(data.pricePerLiter) ?
          <View
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <SummaryItem width={itemWidth} title={`Price Per ${convertToSentenceCase(groupData.petrol)}`} value={currencyPosition(data.pricePerLiter, groupData.currency)} />
          </View> : <></>}
      </Box>
      <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{ paddingBottom: 25 }}>
        {Object.entries(data.invoiceData as { fullName: string }[]).sort((_, [, b]) => {
          if (isPublic) return 0
          if (b.fullName === retrieveData().fullName) return 1
          else return -1
        }).map(
          ([_, value]: any, count: number) => (
            <InvoiceItem isPublic={isPublic} key={count} invoiceData={value} fullName={retrieveData().fullName} groupData={groupData} lastItem={Boolean(Object.keys(data.invoiceData).length === count)} openManageDistance={() => setManageDistanceOpen(true)} authenticationKey={retrieveData().authenticationKey} invoiceID={invoiceID} />)
        )}
      </ScrollView>
      {!isPublic &&
        <TouchableOpacity onPress={sendLink} activeOpacity={0.8} >
          <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.tertiary, borderRadius: 8, borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border, position: 'absolute', bottom: 15, right: -10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Svg
              width={'18'}
              height="16"
              fill="none"
              viewBox="0 0 22 19"
            >
              <Path
                fill="#fff"
                d="M22 8.9L13.444.5v4.8C4.89 6.5 1.222 12.5 0 18.5c3.056-4.2 7.333-6.12 13.444-6.12v4.92L22 8.9z"
              ></Path>
            </Svg>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Share</Text>
          </View>
        </TouchableOpacity>}
      <AssignDistance
        active={manageDistanceOpen}
        handleClose={() => setManageDistanceOpen(false)}
        handleUpdate={handleUpdate}
        data={data.invoiceData}
        invoiceID={invoiceID}
      />
    </>
  )
}
