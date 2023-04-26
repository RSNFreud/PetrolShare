/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useNavigation } from '@react-navigation/native'
import {
  ScrollView,
  Text as DefaultText,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View as DefaultView,
  Dimensions,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import Colors from '../constants/Colors'

export type TextProps = DefaultText['props']
export type ViewProps = DefaultView['props']

export function Text(props: TextProps) {
  const { style, ...otherProps } = props

  let fontFamily = 'Roboto-Regular'

  if (style) {
    switch ((style as any)['fontWeight']) {
      case 'bold':
      case '700':
        fontFamily = 'Roboto-Bold'
        break
      case '400':
        fontFamily = 'Roboto-Medium'
        break
      case '300':
        fontFamily = 'Roboto-Light'
        break
      default:
        break
    }
  }

  return (
    <DefaultText
      style={[{ fontFamily: fontFamily, color: 'white', fontSize: 16 }, style]}
      {...otherProps}
    />
  )
}

type ButtonType = {
  children: JSX.Element | Array<JSX.Element> | string
  icon?: JSX.Element
  color?: 'blue' | 'red'
  style?: 'regular' | 'ghost'
  size?: 'regular' | 'small' | 'medium'
  handleClick?: () => void
  styles?: TouchableOpacity['props']['style']
  noText?: boolean
  textStyle?: TextProps['style']
  disabled?: boolean
  loading?: boolean
}

export const Button = ({
  children,
  handleClick,
  noText,
  size,
  disabled,
  style,
  color,
  icon,
  loading,
  styles, textStyle
}: ButtonType) => {
  let variableProperties = {
    height: 51,
    fontSize: 18,
    backgroundColor: Colors.tertiary,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    textColor: 'white',
  }

  switch (size) {
    case 'small':
      variableProperties.height = 26
      variableProperties.paddingVertical = 6
      variableProperties.paddingHorizontal = 12
      variableProperties.fontSize = 12
      break
    case 'medium':
      variableProperties.height = 40
      variableProperties.paddingVertical = 0
      variableProperties.paddingHorizontal = 0
      variableProperties.fontSize = 14
      break

    default:
      break
  }

  switch (color) {
    case 'red':
      variableProperties.borderColor = '#BA3737'
      variableProperties.backgroundColor = '#FA4F4F'
      style === 'ghost' && (variableProperties.textColor = '#FA4F4F')
      break
    default:
      style === 'ghost' && (variableProperties.textColor = '#15CEF3')
      break
  }

  switch (style) {
    case 'ghost':
      if (color !== "red")
        variableProperties.borderColor = Colors.tertiary
      variableProperties.backgroundColor = 'transparent'
      variableProperties.textColor = Colors.tertiary
      break
    default:
      break
  }

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        {
          borderStyle: 'solid',
          borderRadius: 4,
          flexDirection: 'row',
          gap: 10,
          display: 'flex',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: variableProperties.borderColor,
          paddingHorizontal: variableProperties.paddingHorizontal,
          paddingVertical: variableProperties.paddingVertical,
          width: '100%',
          alignContent: 'center',
          alignItems: 'center',
          opacity: disabled ? 0.6 : 1,
          minHeight: variableProperties.height,
          backgroundColor: variableProperties.backgroundColor,
        },
        styles,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : noText ? (
        children
      ) : (
        <>
          {icon}
          <Text
            style={[{
              color: variableProperties.textColor,
              fontSize: variableProperties.fontSize,
              fontWeight: '700',
              textAlign: 'center',
            }, textStyle]}
          >
            {children}
          </Text></>
      )}
    </TouchableOpacity>
  )
}

export const Seperator = ({ style }: ViewProps) => {
  return (
    <DefaultView
      style={[
        {
          height: 1,
          width: '100%',
          backgroundColor: Colors.border,
        },
        style,
      ]}
    />
  )
}

export const Box = ({
  children,
  style,
}: {
  children: JSX.Element | JSX.Element[]
  style?: ViewProps['style']
}) => {
  return (
    <DefaultView
      style={[
        {
          backgroundColor: Colors.secondary,
          paddingHorizontal: 29,
          paddingVertical: 19,
          borderColor: Colors.border,
          borderWidth: 1,
          borderRadius: 4,
        },
        style,
      ]}
    >
      {children}
    </DefaultView>
  )
}

export const Breadcrumbs = ({
  links,
}: {
  links: Array<{ name: string; screenName?: string }>
}) => {
  const navigation = useNavigation() as any

  return (
    <DefaultView
      style={{
        display: 'flex',
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {links.map((e, c) => {
        return (
          <DefaultView
            key={e.name}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {c + 1 === links.length ? (
              <Text style={{ fontWeight: '400', fontSize: 16 }}>{e.name}</Text>
            ) : (
              <>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate(e.screenName || e.name, {
                      showToast: undefined,
                    })
                  }
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      textDecorationLine: 'underline',
                    }}
                  >
                    {e.name}
                  </Text>
                </TouchableWithoutFeedback>
                <Svg
                  width="7"
                  height="7"
                  fill="none"
                  viewBox="0 0 7 7"
                  style={{ marginHorizontal: 5 }}
                >
                  <Path
                    fill="#fff"
                    d="M5.036 3.68L.176 1.786V.48l5.837 2.584v.8l-.977-.184zM.176 5.348L5.05 3.413l.963-.143v.792L.176 6.654V5.348z"
                  ></Path>
                </Svg>
              </>
            )}
          </DefaultView>
        )
      })}
    </DefaultView>
  )
}

export const FlexFull = ({
  children, additionalHeight
}: {
  children: JSX.Element | JSX.Element[]
  additionalHeight?: number
}) => {
  return (
    <DefaultView
      style={{
        position: 'relative',
        flex: 1,
        minHeight: Dimensions.get('window').height - 108 - 95 - (additionalHeight || 0),
        paddingBottom: 55,
      }}
    >
      <DefaultView
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </DefaultView>
    </DefaultView>
  )
}


export const LongButton = ({
  handleClick,
  text,
  last,
  icon, style
}: {
  marginBottom?: number
  handleClick: () => void
  text: string
  icon: JSX.Element
  last?: boolean
  style?: TouchableOpacity["props"]["style"]
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[{
        marginBottom: last ? 0 : 20,
        backgroundColor: Colors.tertiary,
        borderColor: Colors.border,
        borderRadius: 4,
        padding: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
      }, style]}
      onPress={handleClick}
    >
      {icon}
      <Text style={{ fontWeight: '700', fontSize: 16, marginLeft: 15 }}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}