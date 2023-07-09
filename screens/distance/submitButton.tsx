import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text } from '../../components/Themed'
import { getGroupData } from '../../hooks'
import Button from '../../components/button'

type PropsType = {
  loading: boolean
  text?: string
  style?: 'regular' | 'ghost'
  handleClick: () => void
  errors: string
  distance: string
}

export default ({ loading, handleClick, errors, distance, text, style }: PropsType) => {
  const [distanceFormat, setDistanceFormat] = useState()

  useEffect(() => {
    getDistanceFormat()
  })

  const getDistanceFormat = async () => {
    const data = await getGroupData()
    if (!data) return
    setDistanceFormat(data.distance)
  }

  return (
    <>
      <Button loading={loading} handleClick={handleClick} variant={style} text={`${text || "Add Distance"} ${distance ? `(${distance} ${distanceFormat || ''})` : ''}`} />
      {!!errors && (
        <View
          style={{
            marginTop: 15,
            backgroundColor: '#EECFCF',
            borderRadius: 4,
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text style={{ color: '#7B1D1D', fontSize: 16, fontWeight: '400' }}>
            {errors}
          </Text>
        </View>
      )}
    </>
  )
}
