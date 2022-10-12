import {
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Pressable,
} from 'react-native'
import { Text } from './Themed'
import Svg, { Path } from 'react-native-svg'
import { useEffect, useState } from 'react'
import { EventRegister } from 'react-native-event-listeners'

type item = { name: string; value?: string; symbol?: string }

type PropsType = {
  data: Array<item>
  value?: item | string
  handleSelected: (e: item) => void
  errorMessage?: string
}

export default ({ data, value, handleSelected, errorMessage }: PropsType) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value)

  const selectOption = (e: item) => {
    setSelected(e)
    handleSelected(e)
    setOpen(false)
  }

  useEffect(() => {
    if (!data) return
    setSelected(data.filter((e) => e.value === value)[0])
  }, [value, data])

  useEffect(() => {
    EventRegister.addEventListener('bodyClicked', () => {
      setOpen(false)
    })
    return () => {
      EventRegister.removeEventListener('bodyClicked')
    }
  }, [])

  return (
    <View
      style={{
        position: 'relative',
        zIndex: 1,
        paddingBottom: 89,
      }}
    >
      <TouchableWithoutFeedback onPress={() => setOpen((open) => !open)}>
        <View
          style={{
            backgroundColor: '#0B404A',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#1196B0',
            borderRadius: 4,
            height: 41,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            zIndex: 3,
          }}
        >
          <Text>
            {selected ? (selected as item).name : <>Choose a currency</>}
          </Text>
          <Svg
            width="16"
            height="16"
            fill="none"
            style={{ transform: [{ rotate: open ? '0deg' : '180deg' }] }}
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
      {!!errorMessage && (
        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: '400',
            color: '#FA4F4F',
          }}
        >
          {errorMessage}
        </Text>
      )}
      {open && (
        <ScrollView
          snapToAlignment="center"
          snapToInterval={30}
          decelerationRate={'fast'}
          style={{
            maxHeight: 92,
            borderRadius: 4,
            width: '100%',
            borderColor: '#0B404A',
            backgroundColor: '#001e24',
            borderWidth: 1,
            position: 'absolute',
            top: 51,
            left: 0,
            borderStyle: 'solid',
          }}
        >
          {selected && typeof selected !== 'string' && (
            <Pressable
              key={(selected as item).name}
              onPress={() => setOpen(false)}
              style={{
                paddingVertical: 5,
                alignContent: 'center',
                height: 30,
                paddingHorizontal: 10,
                backgroundColor: '#0B404A',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text>{(selected as item)?.name}</Text>
              <Text>{(selected as item)?.value}</Text>
            </Pressable>
          )}
          {data
            .sort((a, b) => a['name'].localeCompare(b['name']))
            .map((e) => {
              if (selected && e.value === (selected as item).value) return
              return (
                <Pressable
                  key={e.name}
                  style={{
                    paddingVertical: 5,
                    alignContent: 'center',
                    height: 30,
                    paddingHorizontal: 10,
                    backgroundColor:
                      (selected as item)?.value === e.value ? '#0B404A' : '',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => selectOption(e)}
                >
                  <Text>{e.name}</Text>
                  <Text>{e.value}</Text>
                </Pressable>
              )
            })}
        </ScrollView>
      )}
    </View>
  )
}
