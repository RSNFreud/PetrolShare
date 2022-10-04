import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../hooks/context";
import Popup from "../../components/Popup";
import Default from "./default";
import axios from "axios";
import generateGroupID from "../../hooks/generateGroupID";
import Complete from "./complete";
import JoinGroup from "./joinGroup";
import GroupSettings from "../groupSettings";
import { setItem } from "../../hooks";

type PropsType = {
  onComplete: () => void;
  closeButton?: boolean;
  visible: boolean;
  firstSteps: boolean;
  handleClose?: () => void;
  screen?: string | null;
};

export default ({
  screen,
  handleClose,
  closeButton,
  firstSteps,
  visible,
  onComplete,
}: PropsType) => {
  const { retrieveData } = useContext(AuthContext);
  const [currentScreen, setCurrentScreen] = useState(<></>);
  const [groupID, setGroupID] = useState(generateGroupID());
  const [newGroup, setNewGroup] = useState(true);
  const [animating, setAnimating] = useState(firstSteps ? false : true);

  const closePopup = () => {
    setAnimating(true);
    onComplete();
    if (handleClose) handleClose();
  };

  const changeScreen = (
    screen:
      | "Default"
      | "Complete"
      | "JoinGroup"
      | "Settings"
      | "SettingsChange",
    currentGroupID: string = groupID
  ) => {
    switch (screen) {
      case "Complete":
        setCurrentScreen(
          <Complete
            firstSteps={firstSteps}
            groupID={currentGroupID}
            closeScreen={closePopup}
          />
        );
        setNewGroup(false);
        break;

      case "JoinGroup":
        setNewGroup(false);
        setCurrentScreen(
          <JoinGroup
            firstSteps={firstSteps}
            onComplete={(e) => changeScreen("Complete", e)}
            onBack={() => changeScreen("Default")}
          />
        );
        break;
      case "Settings":
        setCurrentScreen(
          <GroupSettings
            firstSteps={newGroup}
            handleClose={(e) =>
              newGroup ? changeScreen("Complete", e) : handleGroupClose()
            }
          />
        );
        break;
      case "SettingsChange":
        setCurrentScreen(
          <GroupSettings firstSteps={false} handleClose={handleGroupClose} />
        );
        break;
      default:
        setCurrentScreen(
          <Default
            firstSteps={firstSteps}
            onCreateGroup={() => createGroup()}
            onJoinGroup={() => changeScreen("JoinGroup")}
          />
        );
        break;
    }
  };

  const handleGroupClose = async () => {
    await setItem("showToast", "groupSettingsUpdated");
    setNewGroup(false);
    closePopup();
  };

  const createGroup = async () => {
    setGroupID(generateGroupID());
    setNewGroup(true);
    await axios.post(process.env.REACT_APP_API_ADDRESS + "/group/create", {
      authenticationKey: retrieveData().authenticationKey,
      groupID: groupID,
    });
    changeScreen("Settings");
  };

  useEffect(() => {
    if (firstSteps) setAnimating(false);

    changeScreen("Default");
  }, [firstSteps]);

  useEffect(() => {
    changeScreen("Default");
  }, [visible]);

  useEffect(() => {
    if (screen) {
      return changeScreen("SettingsChange");
    }
  }, [screen]);

  return (
    <Popup
      showClose={closeButton}
      animate={animating}
      visible={visible}
      handleClose={() => (firstSteps ? null : handleClose && handleClose())}
      children={currentScreen}
    />
  );
};
