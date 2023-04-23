import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import config from '../config'
import { Alert, getItem, sendCustomEvent } from '../hooks'
import { AuthContext } from '../hooks/context'
import { getAllCurrencies } from '../hooks/getCurrencies'
import Dropdown from './Dropdown'
import RadioButton from './RadioButton'
import { Button, Box, Text } from './Themed'
import generateGroupID from '../hooks/generateGroupID'

type PropsType = {
  handleComplete: (e?: string) => void
  handleCancel?: () => void
  newGroup?: boolean
  hideCancel?: boolean
}

export default ({
  handleComplete,
  hideCancel,
  handleCancel,
  newGroup,
}: PropsType) => {
  const [data, setData] = useState({
    distance: '',
    petrol: '',
    currency: '',
  })
  const [errors, setErrors] = useState({
    distance: '',
    petrol: '',
    currency: '',
  })

  const [dropdownData, setDropdownData] = useState<Array<any>>([])
  const { retrieveData } = useContext(AuthContext)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    generateDropdown()
  }, [])

  useEffect(() => {
    if (newGroup)
      setData({
        distance: '',
        petrol: '',
        currency: '',
      })
    else setGroupData()
  }, [newGroup])

  const setGroupData = async () => {
    const groupData = getItem('groupData')
    if (!groupData || newGroup) return
    setData(JSON.parse(groupData))
  }

  const generateDropdown = async () => {
    const data: Array<{
      name: string
      symbol: string
    }> = await getAllCurrencies()
    const dropdown: Array<any> = []
    Object.entries(data).map(([key, e]) => {
      dropdown.push({
        name: e.name,
        symbol: e.symbol,
        value: key,
      })
    })
    setDropdownData(dropdown)
  }

  const handleSubmit = async () => {
    let errors: any = {}

    Object.entries(data).map(([key, value]) => {
      if (!value) errors[key] = 'Please complete this field!'
    })

    setErrors({ ...errors })
    if (Object.keys(errors).length) return
    if (newGroup) return createGroup()
    Alert(
      'Are you sure you want to reset your data?',
      'By clicking yes your session will be reset back to 0 for your group.',
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true)
            axios
              .post(config.REACT_APP_API_ADDRESS + `/distance/reset`, {
                authenticationKey: retrieveData().authenticationKey,
              })
              .then(async () => {
                updateGroup()
              })
              .catch()
          },
        },
        { text: 'No', style: 'cancel' },
      ],
    )
  }

  const createGroup = async () => {
    const groupID = generateGroupID()
    setLoading(true)
    await axios.post(config.REACT_APP_API_ADDRESS + '/group/create', {
      authenticationKey: retrieveData().authenticationKey,
      groupID: groupID,
    })
    updateGroup(groupID)
  }

  const updateGroup = async (groupID?: string) => {
    setLoading(true)

    await axios
      .post(config.REACT_APP_API_ADDRESS + '/group/update', {
        authenticationKey: retrieveData().authenticationKey,
        distance: data.distance,
        petrol: data.petrol,
        currency: data.currency,
      })
      .then(() => {
        setLoading(false)
        handleComplete(groupID)
      })
  }

  const handleTouch = () => {
    sendCustomEvent('bodyClicked')
  }

  return (
    <Pressable onPress={handleTouch}>
      <>
        {newGroup && (

          <Text
            style={{
              color: 'white', marginBottom: 20, lineHeight: 24
            }}
          >
            To finish creating your group, please fill out the following options.
          </Text>
        )}
        {!newGroup && (
          <Box
            style={{
              marginTop: 20,
              marginBottom: 20,
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                color: 'white',
              }}
            >
              By changing group settings you will reset your current tracked
              session.
            </Text>
          </Box>
        )}
        <Text
          style={{
            fontSize: 16,
            lineHeight: 27,
            fontWeight: '700',
            color: 'white',
            marginBottom: 10,
          }}
        >
          Which format do you want distance to be displayed in?
        </Text>
        <RadioButton
          value={data.distance}
          handleChange={(e) => setData({ ...data, distance: e })}
          buttons={[
            { name: 'Km', value: 'km' },
            { name: 'Miles', value: 'miles' },
          ]}
          errorMessage={errors.distance}
        />

        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            lineHeight: 27,
            fontWeight: '700',
            color: 'white',
            marginTop: 30,
          }}
        >
          Which format do you want petrol to be displayed in?
        </Text>
        <RadioButton
          value={data.petrol}
          handleChange={(e) => setData({ ...data, petrol: e })}
          buttons={[
            { name: 'Gallons', value: 'gallons' },
            { name: 'Liters', value: 'liters' },
          ]}
          errorMessage={errors.petrol}
        />
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            lineHeight: 27,
            fontWeight: '700',
            color: 'white',
            marginTop: 30,
          }}
        >
          Which currency format are you using?
        </Text>
        <Dropdown
          placeholder="Choose a currency"
          value={data.currency}
          data={dropdownData}
          handleSelected={(e) => setData({ ...data, currency: e })}
          errorMessage={errors.currency}
        />
        <Button loading={isLoading} handleClick={handleSubmit}>
          {newGroup ? 'Create Group' : 'Save Settings'}
        </Button>
        {!hideCancel && newGroup && <Button handleClick={handleCancel} style='ghost' styles={{ marginTop: 20 }}>
          Return to Menu
        </Button>}
      </>
    </Pressable>
  )
}
