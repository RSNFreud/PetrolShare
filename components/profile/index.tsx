import { Button, Text } from '../Themed'
import Svg, { Path } from 'react-native-svg'
import { useContext, useEffect, useState } from 'react'
import Popup from '../Popup'
import ChangeEmail from './changeEmail'
import ChangePassword from './changePassword'
import ChangeName from './changeName'
import { AuthContext } from '../../hooks/context'
import Default from './default'
import Settings from './settings'

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

  const [screen, setScreen] = useState("")

  // const setScreen = (screen: string) => {
  //   switch (screen) {
  //     case 'Email':
  //       setPopupData(
  //         <ChangeEmail
  //           handleClose={handleClose}
  //           handleBack={() => setScreen('')}
  //         />,
  //       )
  //       break
  //     case 'Password':
  //       setPopupData(
  //         <ChangePassword
  //           handleClose={handleClose}
  //           handleBack={() => setScreen('')}
  //         />,
  //       )
  //       break
  //     case 'Name':
  //       setPopupData(
  //         <ChangeName
  //           handleClose={handleClose}
  //           handleBack={() => setScreen('')}
  //         />,
  //       )
  //       break

  //     default:
  //       setPopupData(<Default />)
  //       break
  //   }
  // }

  useEffect(() => {
    if (!visible) setScreen('')
  }, [visible])

  return (
    <Popup visible={visible} handleClose={handleClose}>
      {screen === "" ? <Default handleChange={e => setScreen(e)} handleClose={handleClose} /> : <></>}
      {screen === "Settings" ? <Settings handleChange={e => setScreen(e)} handleClose={handleClose} /> : <></>}
      {screen === "Name" ? <ChangeName handleChange={e => setScreen(e)} handleClose={handleClose} /> : <></>}
      {screen === "Password" ? <ChangePassword handleChange={e => setScreen(e)} handleClose={handleClose} /> : <></>}
      {screen === "Email" ? <ChangeEmail handleChange={e => setScreen(e)} handleClose={handleClose} /> : <></>}
    </Popup>
  )
}
