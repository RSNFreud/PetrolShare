import { useState } from "react";

import CreateGroup from "./createGroup";
import DemoDefault from "./demoDefault";
import GroupSettings from "./groupSettings";
import JoinGroup from "./joinGroup";

type PropsType = {
  firstSteps?: boolean;
  handleClose: () => void;
  handleUpdate?: () => void;
};

export default ({ handleClose, handleUpdate }: PropsType) => {
  const [currentScreen, setCurrentScreen] = useState("Default");

  const handleBack = () => {
    setCurrentScreen("Default");
  };

  return (
    <>
      {currentScreen === "Default" && (
        <DemoDefault setModal={(e) => setCurrentScreen(e)} />
      )}
      {currentScreen === "JoinGroup" ? (
        <JoinGroup
          handleCancel={handleBack}
          handleClose={handleClose}
          handleUpdate={handleClose}
          firstSteps
        />
      ) : (
        <></>
      )}
      {currentScreen === "CreateGroup" ? (
        <CreateGroup
          handleCancel={handleBack}
          handleClose={handleClose}
          handleUpdate={handleUpdate}
        />
      ) : (
        <></>
      )}
      {currentScreen === "Settings" ? (
        <GroupSettings handleComplete={handleClose} />
      ) : (
        <></>
      )}
    </>
  );
};
