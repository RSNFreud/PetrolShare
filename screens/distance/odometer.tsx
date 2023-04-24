import Input from '../../components/Input'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../../hooks/context'
import SubmitButton from './submitButton'
import { useNavigation } from '@react-navigation/native'
import { deleteItem, sendCustomEvent, setItem } from '../../hooks'
import config from '../../config'

export default ({
  previousData,
  handleClose,
}: {
  previousData?: {
    startValue: string
    endValue: string
  }
  handleClose: () => void
}) => {
  const [data, setData] = useState({
    ...previousData,
  })
  const [errors, setErrors] = useState('')
  const [distance, setDistance] = useState('')
  const [loading, setLoading] = useState(false)
  const { retrieveData } = useContext(AuthContext)
  const { navigate } = useNavigation() as any

  useEffect(() => {
    if (previousData) {
      setData({ ...previousData })
    }
  }, [previousData])

  useEffect(() => {
    if (data.startValue && data.endValue) {
      const start = parseFloat(data.startValue)
      const end = parseFloat(data.endValue)
      if (isNaN(start) || isNaN(end)) return
      if (end - start < 0) return
      setDistance((end - start).toString())
    } else {
      setDistance('')
    }
  }, [data])

  const handleSubmit = async () => {
    setErrors('')
    if (!data.startValue) {
      return setErrors('Please enter a start value')
    }

    let distance: number = 0

    if (data.startValue && data.endValue) {
      distance = parseFloat(data.endValue) - parseFloat(data.startValue)
    }

    if (data.startValue && !data.endValue) {
      handleClose()
      setItem('draft', JSON.stringify(data))
      sendCustomEvent('sendAlert', 'Saved your distance as a draft! Access it by clicking on Manage Distance again!')
      navigate('Dashboard')
      return
    }
    if (distance <= 0 || isNaN(distance))
      return setErrors('Please enter a distance above 0!')

    if (!retrieveData) return
    setLoading(true)
    axios
      .post(config.REACT_APP_API_ADDRESS + `/distance/add`, {
        distance: distance,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(async () => {
        setLoading(false)
        handleClose()
        deleteItem('draft')
        sendCustomEvent('sendAlert', 'Distance successfully updated!')
      })
      .catch(({ response }) => {
        console.log(response.message)
      })
  }

  return (
    <>
      <Input
        placeholder="Enter odemetor start value"
        label="Start Odometer"
        keyboardType="numeric"
        value={data.startValue}
        handleInput={(e) => setData({ ...data, startValue: e })}
        style={{ marginBottom: 20 }}
      />
      <Input
        placeholder="Enter odemetor end value"
        label="End Odometer"
        keyboardType="numeric"
        value={data.endValue}
        handleInput={(e) => setData({ ...data, endValue: e })}
        style={{ marginBottom: 30 }}
      />
      <SubmitButton
        text={data.startValue && !data.endValue ? 'Save Draft' : 'Add Distance'}
        loading={loading}
        handleClick={handleSubmit}
        errors={errors}
        distance={distance}
      />
    </>
  )
}
