import { useEffect, useState } from 'react'
import Popup from '../Popup'
import ChangeEmail from './changeEmail'
import ChangePassword from './changePassword'
import ChangeName from './changeName'
import Default from './default'
import Settings from './settings'


export default ({
  visible,
  handleClose,
  onUpdate
}: {
  visible: boolean
  handleClose: () => void
  onUpdate: () => void
}) => {

  const [screen, setScreen] = useState("")

  useEffect(() => {
    if (visible) setScreen('')
  }, [visible])

  const defaultProps = {
    handleClose: () => handleClose(),
    handleUpdate: () => onUpdate()
  }


  const getTitle = (currentScreen: string) => {
    switch (currentScreen) {
      case 'Settings':
        return 'Settings'
      case 'Name':
        return 'Change Name'
      case 'Password':
        return 'Change Password'
      case 'Email':
        return 'Change Email'
      default:
        return 'Settings'
    }
  }


  return (
    <Popup visible={visible}{...defaultProps} title={getTitle(screen)}>
      {screen === "" ? <Default handleChange={e => setScreen(e)}{...defaultProps} /> : <></>}
      {screen === "Settings" ? <Settings handleChange={e => setScreen(e)} {...defaultProps} /> : <></>}
      {screen === "Name" ? <ChangeName handleChange={e => setScreen(e)}{...defaultProps} /> : <></>}
      {screen === "Password" ? <ChangePassword handleChange={e => setScreen(e)}{...defaultProps} /> : <></>}
      {screen === "Email" ? <ChangeEmail handleChange={e => setScreen(e)}{...defaultProps} /> : <></>}
    </Popup>
  )
}
