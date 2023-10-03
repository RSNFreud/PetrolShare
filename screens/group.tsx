import { LongButton } from "../components/Themed";
import { useState } from "react";
import { Alert } from "../hooks";

import Popup from "../components/Popup";
import CreateGroup from "../components/createGroup";
import GroupSettings from "../components/groupSettings";
import JoinGroup from "../components/joinGroup";
import Pencil from "../assets/icons/pencil";
import Plus from "../assets/icons/plus";
import Cog from "../assets/icons/cog";

type GroupType = {
  currency: string;
  distance: string;
  groupID: string;
  petrol: string;
  premium: boolean;
};

export default ({ onUpdate }: { onUpdate: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("");

  const createGroup = async () => {
    Alert(
      "Are you sure you want to create a\nnew group?",
      "This will delete all the current data you have saved.",
      [
        {
          text: "Yes",
          onPress: async () => {
            openModal("CreateGroup");
          },
        },
        { text: "No", style: "cancel" },
      ]
    );
  };

  const openModal = (modal: string) => {
    setCurrentScreen(modal);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    onUpdate();
  };

  const getTitle = (currentScreen: string) => {
    switch (currentScreen) {
      case "Settings":
        return "Group Settings";
      case "CreateGroup":
        return "Create Group";
      case "JoinGroup":
        return "Join Group";
    }
  };

  return (
    <>
      <LongButton
        text="Create Group"
        icon={<Pencil />}
        handleClick={createGroup}
      />
      <LongButton
        text="Join Group"
        icon={<Plus />}
        handleClick={() => openModal("JoinGroup")}
      />
      <LongButton
        text="Group Settings"
        icon={<Cog />}
        handleClick={() => openModal("Settings")}
      />
      <Popup
        visible={visible}
        handleClose={() => {
          setVisible(false), onUpdate();
        }}
        title={getTitle(currentScreen)}
      >
        {currentScreen === "JoinGroup" ? (
          <JoinGroup handleClose={handleClose} handleUpdate={onUpdate} />
        ) : (
          <></>
        )}
        {currentScreen === "CreateGroup" ? (
          <CreateGroup handleClose={handleClose} handleUpdate={onUpdate} />
        ) : (
          <></>
        )}
        {currentScreen === "Settings" ? (
          <GroupSettings handleComplete={handleClose} />
        ) : (
          <></>
        )}
      </Popup>
    </>
  );
};
