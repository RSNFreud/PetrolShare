import { EventRegister } from 'react-native-event-listeners'
import React, { useContext, useEffect, useState } from 'react'
import { ViewProps, View, ScrollView, TouchableWithoutFeedback } from 'react-native'
import Toast from 'react-native-toast-message'
import { Text } from './Themed'
import { AuthContext } from '../hooks/context'
import Colors from '../constants/Colors'
import AlertBox from './alertBox'

export type GroupType = { currency: string, distance: string, groupID: string, petrol: string, premium: boolean }

export default ({
  children,
  style,
  homepage, noScrollView, noBottomPadding,
  ...rest
}: {
  children: any
  style?: ViewProps['style']
  onLayout?: any
  noScrollView?: boolean
  noBottomPadding?: boolean
  homepage?: boolean
}) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)
  const [popupVisible, setPopupVisible] = useState(false)

  // const { navigate } = useNavigation()
  // const route = useRoute()

  const ToastConfig = {
    default: ({ text1 }: { text1?: string }) => (
      <View
        style={{
          backgroundColor: Colors.background,
          borderColor: Colors.border,
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 4,
          paddingVertical: 15,
          paddingHorizontal: 25,
          marginHorizontal: 20
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontWeight: '700',
            textAlign: 'center',
            lineHeight: 24,
          }}
        >
          {text1}
        </Text>
      </View >
    ),
  }

  useEffect(() => {
    EventRegister.addEventListener('sendAlert', (e) => {
      Toast.show({
        type: 'default',
        text1: e,
      })
    })
    EventRegister.addEventListener('popupVisible', e => {
      setPopupVisible(e)
    })

    return () => {
      EventRegister.removeEventListener('sendAlert')
    }
  }, [])

  if (isLoading) return <></>

  return (
    <>
      <View
        style={[style, { width: '100%', position: 'relative', display: 'flex', flex: 1, overflow: 'hidden' }]}
        {...rest}
      >
        {homepage || noScrollView ? <View
          style={{
            paddingBottom: homepage
              || noBottomPadding ? 0 : 55, paddingHorizontal: homepage ? 0 : 25, flex: 1, display: 'flex'
          }}>
          <>{children}</>
        </View> : <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps={'handled'} contentContainerStyle={{
          paddingBottom: noBottomPadding ? 0
            : 55, paddingHorizontal: homepage ? 0 : 25
        }}
          style={{ flex: 1, display: 'flex' }} >
          <>{children}</>
        </ScrollView>
        }
        <Toast config={ToastConfig} />
        {!popupVisible && <AlertBox />}
      </View >
    </>
  )
}
