import { Button, Text } from '../Themed'
import Svg, { Path } from 'react-native-svg'
import { useEffect, useState } from 'react'
import Popup from '../Popup'
import ChangeEmail from './changeEmail'
import ChangePassword from './changePassword'
import ChangeName from './changeName'

const HorizontalButton = ({
  icon,
  text,
  handleClick,
  last,
}: {
  icon: JSX.Element
  text: string
  handleClick: () => void
  last?: boolean
}) => {
  return (
    <Button
      handleClick={handleClick}
      styles={{
        justifyContent: 'flex-start',
        marginBottom: last ? 0 : 15,
      }}
      textStyle={{ fontSize: 16 }}
      icon={icon}
      children={text}
    />
  )
}

export default ({
  visible,
  handleClose,
}: {
  visible: boolean
  handleClose: () => void
}) => {
  const Default = () => (
    <>
      <HorizontalButton
        text={'Change Email'}
        icon={
          <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
            <Path
              fill="#fff"
              d="M20.164 3.833H4.83A1.914 1.914 0 002.924 5.75l-.01 11.5c0 1.054.862 1.917 1.917 1.917h15.333a1.922 1.922 0 001.917-1.917V5.75a1.922 1.922 0 00-1.917-1.917zm0 3.834l-7.667 4.791-7.666-4.791V5.75l7.666 4.792 7.667-4.792v1.917z"
            ></Path>
          </Svg>
        }
        handleClick={() => setScreen('Email')}
      />
      <HorizontalButton
        text={'Change Password'}
        icon={
          <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
            <Path
              fill="#fff"
              d="M3.372 16.292h17.25a.96.96 0 01.959.958.961.961 0 01-.959.958H3.372a.961.961 0 01-.958-.958.96.96 0 01.958-.958zm-.479-4.246a.723.723 0 00.987-.268l.45-.786.46.795c.202.345.643.46.988.269a.72.72 0 00.268-.978l-.47-.805h.91a.724.724 0 00.72-.718.724.724 0 00-.72-.72h-.91l.45-.785a.72.72 0 00-.258-.987.732.732 0 00-.987.268l-.45.786-.45-.786a.732.732 0 00-.988-.268.72.72 0 00-.259.987l.45.786h-.91a.724.724 0 00-.718.719c0 .393.326.718.718.718h.91l-.46.796a.718.718 0 00.27.977zm7.667 0a.723.723 0 00.987-.268l.45-.786.46.795c.202.345.642.46.987.269a.72.72 0 00.269-.978l-.46-.795h.91a.724.724 0 00.719-.719.724.724 0 00-.719-.719h-.92l.45-.785a.728.728 0 00-.258-.988.715.715 0 00-.978.26l-.46.785-.45-.786a.711.711 0 00-.978-.259.72.72 0 00-.258.988l.45.785h-.92a.71.71 0 00-.719.71c0 .393.326.718.72.718h.91l-.46.796a.718.718 0 00.268.977zm11.979-2.491a.724.724 0 00-.719-.72h-.91l.45-.785a.729.729 0 00-.258-.987.714.714 0 00-.978.259l-.46.795-.45-.786a.71.71 0 00-.978-.259.72.72 0 00-.259.988l.45.785h-.91a.712.712 0 00-.728.71c0 .393.326.718.719.718h.91l-.46.796a.71.71 0 00.269.977.723.723 0 00.987-.268l.45-.786.46.795c.201.345.642.46.987.269a.72.72 0 00.268-.978l-.46-.795h.91a.737.737 0 00.71-.728z"
            ></Path>
          </Svg>
        }
        handleClick={() => setScreen('Password')}
      />
      <HorizontalButton
        last
        text={'Change Name'}
        icon={
          <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
            <Path
              fill="#fff"
              d="M7.685 6.23a4.318 4.318 0 004.312 4.312 4.318 4.318 0 004.313-4.313 4.318 4.318 0 00-4.313-4.312 4.318 4.318 0 00-4.312 4.312zm11.979 13.895h.958v-.958a6.717 6.717 0 00-6.708-6.709h-3.833c-3.7 0-6.709 3.01-6.709 6.709v.958h16.292z"
            ></Path>
          </Svg>
        }
        handleClick={() => setScreen('Name')}
      />
    </>
  )

  const [popupData, setPopupData] = useState(<Default />)

  const setScreen = (screen: string) => {
    switch (screen) {
      case 'Email':
        setPopupData(
          <ChangeEmail
            handleClose={handleClose}
            handleBack={() => setScreen('')}
          />,
        )
        break
      case 'Password':
        setPopupData(
          <ChangePassword
            handleClose={handleClose}
            handleBack={() => setScreen('')}
          />,
        )
        break
      case 'Name':
        setPopupData(
          <ChangeName
            handleClose={handleClose}
            handleBack={() => setScreen('')}
          />,
        )
        break

      default:
        setPopupData(<Default />)
        break
    }
  }

  useEffect(() => {
    if (!visible) setScreen('')
  }, [visible])

  return (
    <Popup visible={visible} handleClose={handleClose}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
        Settings
      </Text>
      {popupData}
    </Popup>
  )
}
