import { useContext, useEffect, useRef, useState } from 'react'
import { Text } from '../../components/Themed'
import { AuthContext } from '../../hooks/context'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  AppState,
  ScrollView,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import * as Clipboard from 'expo-clipboard'
import { Alert, checkForUpdates, getItem, setItem } from '../../hooks'
import Layout from '../../components/Layout'
import config from '../../config'
import * as Location from 'expo-location'
import { useIsFocused, useRoute } from '@react-navigation/native'
import Colors from '../../constants/Colors'
import NavItem from './navItem'
import Distance from '../distance'
import Petrol from '../petrol'
import Group from '../group'
import Popup from '../../components/Popup'
import Demo from '../../components/demo'
import GroupSettings from '../../components/groupSettings'
import ConfirmDistance from './confirmDistance'
import React from 'react'
import FadeWrapper from './fadeWrapper'
import Tooltip from '../../components/tooltip'
import analytics from '@react-native-firebase/analytics'

export default ({ navigation }: any) => {
  const { setData, retrieveData } = useContext(AuthContext)
  const [currentMileage, setCurrentMileage] = useState(
    retrieveData ? retrieveData()?.currentMileage : 0,
  )
  const route = useRoute()
  const dataRetrieved = useRef(false)
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const [groupData, setGroupData] = useState<{
    distance?: string
    petrol?: string
    currency?: string
  }>({})
  const [confirmDistanceData, setConfirmDistanceData] = useState<{
    distance: string
    assignedBy: string
    id: string
  }>()
  const appState = useRef(AppState.currentState)
  const [currentScreen, setCurrentScreen] = useState<string>('Settings')
  const [currentTab, setCurrentTab] = useState('Distance')
  const scrollRef = useRef(null)
  const isFocused = useIsFocused()
  const [previousTab, setPreviousTab] = useState(currentTab)

  useEffect(() => {
    if (dataRetrieved.current) return
    if (retrieveData && retrieveData().authenticationKey) {
      pageLoaded()
      dataRetrieved.current = true
      setCurrentMileage(retrieveData().currentMileage)
      updateData()
      if (
        retrieveData() &&
        Object.values(retrieveData()).length &&
        retrieveData().groupID === null
      ) {
        setVisible(true)
      } else {
        setVisible(false)
      }

      if (retrieveData() && retrieveData().groupID !== null) getGroupData()

      navigation.addListener('focus', async () => {
        updateData()
      })

    }
  }, [retrieveData])

  useEffect(() => {
    if (!dataRetrieved) return
      ; (async () => {
        if (
          Platform.OS === 'android' &&
          (await Location.hasStartedLocationUpdatesAsync('gpsTracking'))
        ) {
          Alert(
            'You are currently tracking your GPS!',
            'Do you want to go to the Track GPS screen?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  navigation.navigate('GPS')
                },
              },
              { text: 'No', style: 'cancel' },
            ],
          )
        }
      })()
  }, [dataRetrieved])

  useEffect(() => {
    if (retrieveData().groupID && groupData.distance) {
      setVisible(false)
    }
  }, [retrieveData().groupID])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      pageLoaded()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollTo({ left: 0, top: 0 })
    }

    if (currentTab === "Petrol" || currentTab === previousTab) return
    setPreviousTab(currentTab)
  }, [currentTab])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (!isFocused) return
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        pageLoaded()
        if (route.name === "Dashboard")
          checkForUpdates()
        console.log('App has come to the foreground!')
      }
      appState.current = nextAppState
    })

    if (!isFocused) return subscription.remove()

    return () => {
      subscription.remove()
    }
  }, [isFocused])

  const pageLoaded = async () => {
    // if (route.name === "Dashboard") setCurrentTab("Distance")

    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollTo({ left: 0, top: 0 })
    }
    let referallCode = getItem('referalCode')
    if (referallCode) {
      return sendReferal(referallCode)
    }

    if (route && route.params) {
      const groupID = (route.params as { groupID?: string })['groupID']
      if (groupID) {
        sendReferal(groupID)
      }
    }

    if (retrieveData().authenticationKey) {
      updateData()
    }
  }

  const sendReferal = (groupID: string) => {
    setTimeout(() => {
      Alert(
        'We have located a referral code!',
        `Do you want to change your group ID to ${groupID}? Doing so will reset your current session.`,
        [
          {
            text: 'Yes',
            onPress: () => {
              if (route.name === "Login") return
              axios
                .post(config.REACT_APP_API_ADDRESS + `/user/change-group`, {
                  authenticationKey: retrieveData().authenticationKey,
                  groupID: groupID,
                })
                .then(async (e) => {
                  updateData()
                  Toast.show({
                    text1: 'Group ID updated succesfully!',
                    type: 'default',
                  })
                  setItem('referalCode', '')
                })
                .catch((e) => {
                  console.log(e);

                  Toast.show({
                    text1: 'There is no group with that ID!',
                    type: 'default',
                  })
                  setItem('referalCode', '')
                })
            },
          },
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {
              setItem('referalCode', '')
            },
          },
        ],
      )
      navigation.setParams({ groupID: '' })
    }, 400)
  }

  const getDistance = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
        `/distance/get?authenticationKey=${retrieveData().authenticationKey}`,
      )
      .then(async ({ data }) => {
        setCurrentMileage(data)
        let sessionStorage
        try {
          sessionStorage = getItem('userData')
          if (!sessionStorage) return
          sessionStorage = JSON.parse(sessionStorage)
          sessionStorage.currentMileage = data.toString()

          setItem('userData', JSON.stringify(sessionStorage))
        } catch (err) {
          console.log(err)
        }
      })
      .catch(({ response }) => {
        console.log(response.data)
      })
  }

  const checkForUnconfirmedDistance = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
        `/distance/check-distance?authenticationKey=${retrieveData().authenticationKey}`,
      )
      .then(async ({ data }) => {
        if (data) {
          setConfirmDistanceData(data)
          setCurrentScreen("ConfirmDistance")
          setTimeout(() => {
            setVisible(true)
          }, 300);
        }
      })
      .catch(({ response }) => {
        console.log(response.data)
      })
  }

  const updateData = async () => {
    await getGroupData()
    checkForUnconfirmedDistance()
    getDistance()
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
        `/user/get?authenticationKey=${retrieveData().authenticationKey}`,
      )
      .then(async ({ data }) => {
        let sessionStorage
        try {
          sessionStorage = getItem('userData')
          if (!sessionStorage) return
          sessionStorage = JSON.parse(sessionStorage)
          sessionStorage = { ...sessionStorage, ...data[0] }
          setData(sessionStorage)
          getDistance()
          setItem('userData', JSON.stringify(sessionStorage))
        } catch (err) {
          console.log(err)
        }
      })
      .catch(({ response }) => {
        console.log(response)
      })
  }

  const getGroupData = async () => {
    let sessionStorage = getItem('groupData')

    if (sessionStorage) setGroupData(JSON.parse(sessionStorage))

    if (!retrieveData()?.groupID) return

    axios
      .get(
        config.REACT_APP_API_ADDRESS +
        '/group/get?authenticationKey=' +
        retrieveData().authenticationKey,
      )
      .then(async ({ data }) => {
        if (!data.distance) {
          setCurrentScreen('Settings')
          setVisible(true)
          return
        }
        setItem('groupData', JSON.stringify(data))
        setGroupData(data)
      })
      .catch(() => { })
  }

  const copyToClipboard = async () => {

    Clipboard.setStringAsync(
      retrieveData
        ? `https://petrolshare.freud-online.co.uk/short/referral?groupID=${retrieveData()?.groupID
        }`
        : '',
    )
    Alert('Information:', 'Copied the group ID to your\nclipboard - feel free to share it to invite other members to your group!')
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 500)
  }

  const handleClose = () => {
    setVisible(false);
    updateData();
  }

  const closePetrol = () => {
    setCurrentTab(previousTab)
  }

  const changeTab = async (name: string) => {
    setCurrentTab(name)
    try {
      await analytics().logScreenView({
        screen_name: name,
        screen_class: name,
      });
    } catch { }
  }

  return (
    <Layout homepage>
      <View style={{ backgroundColor: Colors.secondary, paddingHorizontal: 25, paddingBottom: 35 }}>
        <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderColor: Colors.border, borderStyle: 'solid', borderWidth: 1 }}>
          <View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <Svg width="15" height="15" fill="none" viewBox="0 0 24 23" style={{ marginRight: 10 }}>
                <Path
                  fill="#fff"
                  d="M11.94 3.613c-1.981 0-3.587 1.874-3.587 4.187 0 1.604.772 2.997 1.907 3.7l-4.815 2.233c-.339.169-.507.455-.507.861v3.855c.028.482.317.93.786.938h12.45c.536-.046.806-.477.812-.938v-3.855c0-.405-.169-.692-.507-.861l-3.373-1.623-1.402-.665c1.088-.719 1.822-2.082 1.822-3.645 0-2.313-1.606-4.187-3.586-4.187zM6.155 5.085c-.853.033-1.528.401-2.042.99a3.832 3.832 0 00-.85 2.383c.035 1.235.588 2.405 1.573 3.017l-3.93 1.827c-.27.101-.406.338-.406.71v3.093c.021.41.234.755.634.761h2.612v-3.272c.043-.875.454-1.582 1.192-1.927l2.611-1.242c.203-.118.397-.28.583-.482A5.876 5.876 0 017.6 5.542c-.451-.276-.958-.454-1.445-.457zm11.664 0c-.557.012-1.072.217-1.496.507.675 1.766.49 3.757-.507 5.3.22.254.448.448.685.583l2.51 1.192c.765.42 1.16 1.133 1.167 1.927v3.272h2.688c.442-.038.63-.39.634-.76v-3.094c0-.338-.135-.575-.406-.71l-3.88-1.852a3.716 3.716 0 001.522-2.992c-.027-.902-.302-1.738-.85-2.384-.573-.62-1.283-.982-2.067-.989z"
                ></Path>
              </Svg>
              <TouchableWithoutFeedback onPress={() => Alert("Group ID", 'This unique ID is used to identify your group. Share it with others to invite them to your group.')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: "500" }}>
                    {retrieveData ? retrieveData()?.groupID || 'Loading...' : null}
                  </Text>
                  <Tooltip style={{ marginLeft: 6 }} title='Group ID' message='This unique ID is used to identify your group. Share it with others to invite them to your group.' />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Svg width="15" height="15" fill="none" viewBox="0 0 24 23" style={{ marginRight: 10 }}>
                <Path
                  fill="#fff"
                  d="M11.549 9.693l-4.474 4.014-4.473-4.014C1.717 8.9 1.115 7.887.872 6.786a5.142 5.142 0 01.36-3.281c.479-1.038 1.29-1.924 2.33-2.548A6.848 6.848 0 017.074 0a6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.142 5.142 0 01.36 3.28c-.244 1.102-.846 2.114-1.73 2.908zM7.075 7.742a2.44 2.44 0 001.626-.605 1.96 1.96 0 00.674-1.46 1.96 1.96 0 00-.674-1.46 2.44 2.44 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.44 2.44 0 001.626.605zm14.823 11.244L17.425 23l-4.474-4.015c-.884-.795-1.486-1.806-1.73-2.908a5.142 5.142 0 01.36-3.28c.48-1.038 1.29-1.925 2.33-2.549a6.848 6.848 0 013.514-.957 6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.141 5.141 0 01.36 3.281c-.244 1.101-.846 2.113-1.73 2.908zm-4.473-1.952c.61 0 1.195-.217 1.626-.605a1.96 1.96 0 00.674-1.46c0-.547-.242-1.073-.674-1.46a2.439 2.439 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.439 2.439 0 001.626.605z"
                ></Path>
              </Svg>
              <Text style={{ fontSize: 16, marginTop: 5, fontWeight: '300' }}>
                {currentMileage || 0} {groupData.distance}
              </Text>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {!!(retrieveData && retrieveData()?.groupID) &&
                <Svg
                  width="25"
                  height="25"
                  fill="none"
                  viewBox="0 0 18 15"
                >
                  <Path
                    fill="#fff"
                    d="M18 7l-7-7v4C4 5 1 10 0 15c2.5-3.5 6-5.1 11-5.1V14l7-7z"
                  ></Path>
                </Svg>
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 25, backgroundColor: Colors.primary, justifyContent: 'center' }}>
        <NavItem active={currentTab} handleClick={e => changeTab(e)} text='Distance' icon={<Svg width="15" height="15" fill="none" viewBox="0 0 24 23" style={{ marginRight: 10 }}>
          <Path
            fill="#fff"
            d="M11.549 9.693l-4.474 4.014-4.473-4.014C1.717 8.9 1.115 7.887.872 6.786a5.142 5.142 0 01.36-3.281c.479-1.038 1.29-1.924 2.33-2.548A6.848 6.848 0 017.074 0a6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.142 5.142 0 01.36 3.28c-.244 1.102-.846 2.114-1.73 2.908zM7.075 7.742a2.44 2.44 0 001.626-.605 1.96 1.96 0 00.674-1.46 1.96 1.96 0 00-.674-1.46 2.44 2.44 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.44 2.44 0 001.626.605zm14.823 11.244L17.425 23l-4.474-4.015c-.884-.795-1.486-1.806-1.73-2.908a5.142 5.142 0 01.36-3.28c.48-1.038 1.29-1.925 2.33-2.549a6.848 6.848 0 013.514-.957 6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.141 5.141 0 01.36 3.281c-.244 1.101-.846 2.113-1.73 2.908zm-4.473-1.952c.61 0 1.195-.217 1.626-.605a1.96 1.96 0 00.674-1.46c0-.547-.242-1.073-.674-1.46a2.439 2.439 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.439 2.439 0 001.626.605z"
          ></Path>
        </Svg>} />

        <View style={{ marginHorizontal: 20, backgroundColor: Colors.border, width: 1, marginVertical: 15 }} />
        <NavItem active={currentTab} handleClick={e => changeTab(e)} icon={<Svg width="15" height="15" fill="none" viewBox="0 0 24 23" style={{ marginRight: 10 }}>
          <Path
            fill="#fff"
            d="M2.188 2.875A2.875 2.875 0 015.062 0h8.625a2.875 2.875 0 012.876 2.875v11.5a2.875 2.875 0 012.875 2.875v.719a.719.719 0 101.437 0V11.5h-.719a.719.719 0 01-.718-.719V6.29a.719.719 0 01.718-.719h2.15c-.017-.684-.077-1.285-.29-1.756a1.394 1.394 0 00-.566-.659c-.264-.158-.667-.28-1.294-.28a.719.719 0 010-1.438c.811 0 1.487.159 2.03.484.55.327.911.792 1.141 1.303.424.942.423 2.106.423 2.992v4.565a.719.719 0 01-.719.719h-.718v6.469a2.157 2.157 0 01-4.313 0v-.719a1.438 1.438 0 00-1.438-1.438v5.75h.72a.719.719 0 110 1.438H1.468a.719.719 0 110-1.438h.718V2.875zm3.593 0a.719.719 0 00-.718.719v7.187a.719.719 0 00.718.719h7.188a.719.719 0 00.719-.719V3.594a.719.719 0 00-.72-.719H5.782z"
          ></Path>
        </Svg>} text='Petrol' />

        <View style={{ marginHorizontal: 20, backgroundColor: Colors.border, width: 1, marginVertical: 15 }} />
        <NavItem active={currentTab} handleClick={e => changeTab(e)} icon={<Svg width="15" height="15" fill="none" viewBox="0 0 24 23" style={{ marginRight: 10 }}>
          <Path
            fill="#fff"
            d="M11.94 3.613c-1.981 0-3.587 1.874-3.587 4.187 0 1.604.772 2.997 1.907 3.7l-4.815 2.233c-.339.169-.507.455-.507.861v3.855c.028.482.317.93.786.938h12.45c.536-.046.806-.477.812-.938v-3.855c0-.405-.169-.692-.507-.861l-3.373-1.623-1.402-.665c1.088-.719 1.822-2.082 1.822-3.645 0-2.313-1.606-4.187-3.586-4.187zM6.155 5.085c-.853.033-1.528.401-2.042.99a3.832 3.832 0 00-.85 2.383c.035 1.235.588 2.405 1.573 3.017l-3.93 1.827c-.27.101-.406.338-.406.71v3.093c.021.41.234.755.634.761h2.612v-3.272c.043-.875.454-1.582 1.192-1.927l2.611-1.242c.203-.118.397-.28.583-.482A5.876 5.876 0 017.6 5.542c-.451-.276-.958-.454-1.445-.457zm11.664 0c-.557.012-1.072.217-1.496.507.675 1.766.49 3.757-.507 5.3.22.254.448.448.685.583l2.51 1.192c.765.42 1.16 1.133 1.167 1.927v3.272h2.688c.442-.038.63-.39.634-.76v-3.094c0-.338-.135-.575-.406-.71l-3.88-1.852a3.716 3.716 0 001.522-2.992c-.027-.902-.302-1.738-.85-2.384-.573-.62-1.283-.982-2.067-.989z"
          ></Path>
        </Svg>} text='Group' />
      </View>
      <ScrollView ref={scrollRef} overScrollMode={'always'} keyboardShouldPersistTaps={'handled'} contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 55, paddingTop: 30 }}>
        <FadeWrapper currentTab={currentTab}>
          <>
            {currentTab === "Distance" && <Distance onUpdate={updateData} />}
            {currentTab === "Petrol" && <Petrol onClose={closePetrol} />}
            {currentTab === "Group" && <Group onUpdate={updateData} />}
          </>
        </FadeWrapper>
      </ScrollView>
      <Popup visible={visible} handleClose={() => { }} showClose={false}>
        {currentScreen === '' ? <Demo handleClose={handleClose} handleUpdate={updateData} /> : <></>}
        {currentScreen === "Settings" ? <GroupSettings handleComplete={handleClose} newGroup hideCancel /> : <></>}
        {currentScreen === "ConfirmDistance" && confirmDistanceData ? <ConfirmDistance handleComplete={handleClose} {...confirmDistanceData} /> : <></>}
      </Popup>
    </Layout>
  )
}
