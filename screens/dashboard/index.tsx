import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../hooks/context";
import Toast from "react-native-toast-message";
import { Alert, getItem, setItem } from "../../hooks";
import config from "../../config";
import Distance from "../distance";
import Petrol from "../petrol";
import Group from "../group";
import Popup from "@components/Popup";
import Demo from "@components/demo";
import GroupSettings from "@components/groupSettings";
import ConfirmDistance from "./confirmDistance";
import React from "react";
import GroupIcon from "../../assets/icons/group";
import PetrolIcon from "../../assets/icons/petrol";
import NavigationMarker from "../../assets/icons/navigationMarker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DashboardHeader } from "./dashboardHeader";
import TabSwitcher from "./tabSwitcher";

export default () => {
  const { retrieveData, updateData } = useContext(AuthContext);
  const params = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [confirmDistanceData, setConfirmDistanceData] = useState<{
    distance: string;
    assignedBy: string;
    id: string;
  }>();
  const [currentScreen, setCurrentScreen] = useState<string>("Settings");
  const navigation = useNavigation();

  useEffect(() => {
    checkForReferral();
    checkForUnconfirmedDistance();
  }, []);

  useEffect(() => {
    if (retrieveData?.groupID && retrieveData?.distance) {
      setVisible(false);
    }
    if (retrieveData?.groupID === null) {
      setVisible(true);
    }
  }, [retrieveData?.groupID]);

  const checkForReferral = async () => {
    let referallCode = getItem("referalCode");
    if (referallCode) {
      return sendReferal(referallCode);
    }

    if (params) {
      const groupID = params["groupID"] as string;
      if (groupID) {
        sendReferal(groupID);
      }
    }
  };

  const sendReferal = (groupID: string) => {
    setTimeout(() => {
      Alert(
        "We have located a referral code!",
        `Do you want to change your group ID to ${groupID}? Doing so will reset your current session.`,
        [
          {
            text: "Yes",
            onPress: () => changeGroup(groupID),
          },
          {
            text: "No",
            style: "cancel",
            onPress: () => {
              setItem("referalCode", "");
            },
          },
        ]
      );
      navigation.setParams({ groupID: "" });
    }, 400);
  };

  const changeGroup = async (groupID: string) => {
    const res = await fetch(
      config.REACT_APP_API_ADDRESS + `/user/change-group`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authenticationKey: retrieveData?.authenticationKey,
          groupID: groupID,
        }),
      }
    );

    if (res.ok) {
      if (updateData) updateData();
      Toast.show({
        text1: "Group ID updated succesfully!",
        type: "default",
      });
      setItem("referalCode", "");
    } else {
      Toast.show({
        text1: "There is no group with that ID!",
        type: "default",
      });
      setItem("referalCode", "");
    }
  };

  const checkForUnconfirmedDistance = async () => {
    try {
      const res = await fetch(
        config.REACT_APP_API_ADDRESS +
          `/distance/check-distance?authenticationKey=${retrieveData?.authenticationKey}`
      );

      if (res.ok) {
        const data = await res.json();
        setConfirmDistanceData(data);
        setCurrentScreen("ConfirmDistance");
        setTimeout(() => {
          setVisible(true);
        }, 300);
      }
    } catch {}
  };

  const handleClose = () => {
    setVisible(false);
    if (updateData) updateData();
  };

  const getTitle = (currentScreen: string) => {
    switch (currentScreen) {
      case "Settings":
        return "Group Settings";
      case "ConfirmDistance":
        return "Confirm Distance";
      default:
        return "Welcome";
    }
  };

  const renderPopupContent = () => {
    switch (currentScreen) {
      case "Settings":
        return (
          <GroupSettings handleComplete={handleClose} newGroup hideCancel />
        );
      case "ConfirmDistance":
        if (!confirmDistanceData) return <></>;
        return (
          <ConfirmDistance
            handleComplete={handleClose}
            {...confirmDistanceData}
          />
        );

      default:
        return <Demo handleClose={handleClose} handleUpdate={updateData} />;
    }
  };

  return (
    <>
      <DashboardHeader
        groupID={retrieveData?.groupID}
        currentMileage={retrieveData?.currentMileage}
        distance={retrieveData?.distance}
      />
      <TabSwitcher
        tabs={[
          {
            title: "Distance",
            icon: <NavigationMarker width="15" height="15" />,
            children: () => <Distance onUpdate={updateData} />,
          },
          {
            title: "Petrol",
            icon: <PetrolIcon width="15" height="15" />,
            children: (onClose) => <Petrol onClose={onClose} />,
          },
          {
            title: "Group",
            icon: <GroupIcon width="15" height="15" />,
            children: () => <Group onUpdate={updateData} />,
          },
        ]}
      />
      <Popup
        visible={visible}
        handleClose={() => {}}
        showClose={false}
        title={getTitle(currentScreen)}
      >
        {renderPopupContent()}
      </Popup>
    </>
  );
};
