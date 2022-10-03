import { ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { Text } from './Themed'
import Svg, { Path } from 'react-native-svg'
import { useState } from 'react'

type item = { name: string; value?: string; symbol?: string }

type PropsType = {
  data: Array<item>
  value?: item
  handleSelected: (e: item) => void
}

export default ({ data, value, handleSelected }: PropsType) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value)

  const selectOption = (e: item) => {
    setSelected(e)
    handleSelected(e)
  }

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback onPress={() => setOpen((open) => !open)}>
        <View
          style={{
            backgroundColor: '#0B404A',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#1196B0',
            borderRadius: 4,
            height: 41,
            marginBottom: open ? 150 : 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <Text>{selected ? selected.name : <>Choose a currency</>}</Text>
          <Svg
            width="16"
            height="16"
            fill="none"
            style={{ transform: [{ rotate: open ? '0' : '180deg' }] }}
          >
            <Path
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.133 2.933V13.6m4.667-6L8.133 2.933 3.467 7.6"
            ></Path>
          </Svg>
        </View>
      </TouchableWithoutFeedback>
      {open && (
        <ScrollView
          style={{
            maxHeight: 150,
            borderRadius: 4,
            borderColor: '#0B404A',
            borderWidth: 1,
            position: 'absolute',
            top: 51,
            left: 0,
            zIndex: 2,
            borderStyle: 'solid',
          }}
        >
          {data.map((e) => (
            <TouchableWithoutFeedback
              onPress={() => selectOption(e)}
              key={e.value}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: selected?.value === e.value ? '#0B404A' : '',
                }}
              >
                <Text>{e.name}</Text>
                <Text>{e.value}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
