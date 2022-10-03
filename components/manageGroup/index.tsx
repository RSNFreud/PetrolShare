import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../hooks/context";
import Popup from "../../components/Popup";
import Default from "./default";
import axios from "axios";
import generateGroupID from "../../hooks/generateGroupID";
import Complete from "./complete";
import JoinGroup from "./joinGroup";

type PropsType = {
  onComplete: () => void;
  closeButton?: boolean;
  visible: boolean;
  firstSteps: boolean;
  handleClose?: () => void;
  screen?: JSX.Element | null;
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
  const [currentScreen, setCurrentScreen] = useState(screen || <></>);
  const [groupID, setGroupID] = useState(generateGroupID());
  const [animating, setAnimating] = useState(firstSteps ? false : true);

  const closePopup = () => {
    setAnimating(true);
    onComplete();
    if (handleClose) handleClose();
  };

  const changeScreen = (
    screen: "Default" | "Complete" | "JoinGroup",
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
        break;

      case "JoinGroup":
        setCurrentScreen(
          <JoinGroup
            firstSteps={firstSteps}
            onComplete={(e) => changeScreen("Complete", e)}
            onBack={() => changeScreen("Default")}
          />
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

  const createGroup = async () => {
    setGroupID(generateGroupID());
    await axios.post(process.env.REACT_APP_API_ADDRESS + "/group/create", {
      authenticationKey: retrieveData().authenticationKey,
      groupID: groupID,
    });
    changeScreen("Complete");
    if (!firstSteps) onComplete();
  };

  useEffect(() => {
    if (firstSteps) setAnimating(false);
    if (screen) return setCurrentScreen(screen);

    changeScreen("Default");
  }, []);

  useEffect(() => {
    if (screen) return setCurrentScreen(screen);
    changeScreen("Default");
  }, [visible]);

  useEffect(() => {
    if (screen) setCurrentScreen(screen);
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
