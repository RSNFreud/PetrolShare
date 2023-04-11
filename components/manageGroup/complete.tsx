import { useState, useContext } from 'react'
import { AuthContext } from '../../hooks/context'
import { View, TouchableWithoutFeedback } from 'react-native'
import { Button, Text, Box } from '../../components/Themed'
import Svg, { Path } from 'react-native-svg'
import * as Clipboard from 'expo-clipboard'

type PropsType = {
  newGroup?: boolean
  groupID: string
  handleClose: () => void
}

export default ({ groupID, newGroup, handleClose }: PropsType) => {
  const [copied, setCopied] = useState(false)
  const { retrieveData } = useContext(AuthContext)

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(
      `https://petrolshare.freud-online.co.uk/short/referral?groupID=${groupID}` ||
      'test',
    )
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 500)
  }

  return (
    <View>
      <Text style={{ fontSize: 16, lineHeight: 25 }}>
        {newGroup && <>
          Thank you for creating a group with PetrolShare{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {retrieveData && retrieveData().fullName}
          </Text>
          .{'\n'}
          {'\n'}</>}

        Your Group ID number is:
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{ fontWeight: 'bold', fontSize: 32, marginVertical: 20 }}
        >
          {groupID}
        </Text>
        <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
          {copied ? (
            <Svg width="26" height="26" fill="none" viewBox="0 0 26 26">
              <Path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.469 14.219l5.687 5.687L21.531 7.72"
              ></Path>
            </Svg>
          ) : (
            <Svg width="26" height="26" fill="none" viewBox="0 0 26 26">
              <Path
                fill="#fff"
                d="M21.306 5.056H7.583A1.083 1.083 0 006.5 6.139v17.333a1.084 1.084 0 001.083 1.084h13.723a1.084 1.084 0 001.083-1.084V6.14a1.083 1.083 0 00-1.083-1.083zm-.362 18.055h-13V6.5h13v16.611z"
              ></Path>
              <Path
                fill="#fff"
                d="M18.778 2.528a1.083 1.083 0 00-1.083-1.084H3.972A1.083 1.083 0 002.89 2.528V19.86a1.083 1.083 0 001.083 1.083h.361V2.89h14.445v-.361z"
              ></Path>
            </Svg>
          )}
        </TouchableWithoutFeedback>
      </View>
      <Text style={{ fontSize: 16, lineHeight: 25 }}>
        Share this with other members in your group to add them to your
        account. You can access this ID number at any time from your
        dashboard.
      </Text>

      <Button styles={{ marginTop: 25 }} handleClick={handleClose}>
        Start Driving
      </Button>
    </View>
  )
}
