import { useEffect, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native'

type PropsType = {
  buttons: Array<{ name: string; value: string }>
  value: string
  handleChange: (value: string) => void
}

const Button = ({ active }: { active: boolean }) => {
  const styles = StyleSheet.create({
    box: {
      borderRadius: 300,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#1196B0',
      width: 16,
      backgroundColor: '#0B404A',
      height: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    dot: {
      width: 6,
      height: 6,
      borderRadius: 100,
      backgroundColor: '#137B91',
    },
  })

  return <View style={styles.box}>{active && <View style={styles.dot} />}</View>
}

export default ({ buttons, value, handleChange }: PropsType) => {
  const [activeRadio, setActiveRadio] = useState(value)

  useEffect(() => {
    if (activeRadio) handleChange(activeRadio)
  }, [activeRadio])

  return (
    <View>
      {buttons.map((e, c) => (
        <TouchableWithoutFeedback
          key={e.value}
          onPress={() => setActiveRadio(e.value)}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: c + 1 === buttons.length ? 0 : 7,
            }}
          >
            <Button active={activeRadio === e.value} />
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontWeight: '400',
                paddingLeft: 10,
                color: 'white',
              }}
            >
              {e.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  )
}
