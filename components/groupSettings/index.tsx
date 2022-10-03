import { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import getCurrencies from '../../hooks/getCurrencies'
import Dropdown from '../Dropdown'
import RadioButton from '../RadioButton'
import { Button } from '../Themed'

export default ({}) => {
  const [data, setData] = useState({
    distance: '',
    petrol: '',
    currency: '',
  })

  const [dropdownData, setDropdownData] = useState<Array<any>>([])

  useEffect(() => {
    generateDropdown()
  }, [])

  useEffect(() => {
    console.log(data)
  }, [data])

  const generateDropdown = async () => {
    const data = await getCurrencies()
    const dropdown: Array<any> = []
    Object.keys(data).map((key) => {
      let e = data[key]

      dropdown.push({
        name: e.name,
        symbol: e.symbol,
        value: key,
      })
    })
    setDropdownData(dropdown)
  }

  return (
    <View>
      <Text
        style={{
          fontSize: 18,
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
      />
      <Text
        style={{
          fontSize: 18,
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
      />
      <Text
        style={{
          fontSize: 18,
          marginBottom: 10,
          lineHeight: 27,
          fontWeight: '700',
          color: 'white',
          marginTop: 30,
        }}
      >
        What currency are you using?
      </Text>
      <Dropdown
        data={dropdownData}
        handleSelected={(e) =>
          setData({ ...data, currency: e.value || e.name })
        }
      />
      <Button styles={{ marginTop: 30 }}>Save Settings</Button>
    </View>
  )
}
