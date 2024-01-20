import { useEffect, useState } from "react";

import ChangeEmail from "./changeEmail";
import ChangeName from "./changeName";
import ChangePassword from "./changePassword";
import Default from "./default";
import Settings from "./settings";
import Popup from "../Popup";

export default ({
  visible,
  handleClose,
  onUpdate,
}: {
  visible: boolean;
  handleClose: () => void;
  onUpdate?: () => void;
}) => {
  const [screen, setScreen] = useState("");

  useEffect(() => {
    if (visible) setScreen("");
  }, [visible]);

  const defaultProps = {
    handleClose: () => handleClose(),
    handleUpdate: () => onUpdate && onUpdate(),
  };

  const getTitle = (currentScreen: string) => {
    switch (currentScreen) {
      case "Settings":
        return "Settings";
      case "Name":
        return "Change Name";
      case "Password":
        return "Change Password";
      case "Email":
        return "Change Email";
      default:
        return "My Account";
    }
  };

  return (
    <Popup visible={visible} {...defaultProps} title={getTitle(screen)}>
      {screen === "" ? (
        <Default handleChange={(e) => setScreen(e)} {...defaultProps} />
      ) : (
        <></>
      )}
      {screen === "Settings" ? (
        <Settings handleChange={(e) => setScreen(e)} {...defaultProps} />
      ) : (
        <></>
      )}
      {screen === "Name" ? (
        <ChangeName handleChange={(e) => setScreen(e)} {...defaultProps} />
      ) : (
        <></>
      )}
      {screen === "Password" ? (
        <ChangePassword handleChange={(e) => setScreen(e)} {...defaultProps} />
      ) : (
        <></>
      )}
      {screen === "Email" ? (
        <ChangeEmail handleChange={(e) => setScreen(e)} {...defaultProps} />
      ) : (
        <></>
      )}
    </Popup>
  );
};
