import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text, Button } from '../../components/Themed'
import { getGroupData } from '../../hooks'

type PropsType = {
  loading: boolean
  text?: string
  handleClick: () => void
  errors: string
  distance: string
}

export default ({ loading, handleClick, errors, distance, text }: PropsType) => {
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
      <Button loading={loading} handleClick={handleClick}>
        <>
          {text || <>Add Distance</>}{' '}
          {distance && (
            <>
              ({distance} {distanceFormat || ''})
            </>
          )}
        </>
      </Button>
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
