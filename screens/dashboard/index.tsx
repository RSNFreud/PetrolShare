import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../hooks/context";
import axios from "axios";
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
  const { setData, retrieveData } = useContext(AuthContext);
  const params = useLocalSearchParams();
  const dataRetrieved = useRef(false);
  const [visible, setVisible] = useState(false);
  const [groupData, setGroupData] = useState<{
    distance?: string;
    petrol?: string;
    currency?: string;
  }>({});
  const [confirmDistanceData, setConfirmDistanceData] = useState<{
    distance: string;
    assignedBy: string;
    id: string;
  }>();
  const [currentScreen, setCurrentScreen] = useState<string>("Settings");
  const navigation = useNavigation();

  useEffect(() => {
    if (dataRetrieved.current) return;
    if (retrieveData && retrieveData?.authenticationKey) {
      pageLoaded();
      dataRetrieved.current = true;
      updateData();
      if (
        retrieveData &&
        Object.values(retrieveData).length &&
        retrieveData?.groupID === null
      ) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (retrieveData && retrieveData?.groupID !== null) getGroupData();

      navigation.addListener("focus", async () => {
        updateData();
      });
    }
  }, [retrieveData]);

  useEffect(() => {
    if (retrieveData?.groupID && groupData.distance) {
      setVisible(false);
    }
  }, [retrieveData?.groupID]);

  const pageLoaded = async () => {
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

    if (retrieveData?.authenticationKey) {
      updateData();
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
            onPress: () => {
              // if (route.name === "Login") return;
              axios
                .post(config.REACT_APP_API_ADDRESS + `/user/change-group`, {
                  authenticationKey: retrieveData?.authenticationKey,
                  groupID: groupID,
                })
                .then(async (e) => {
                  updateData();
                  Toast.show({
                    text1: "Group ID updated succesfully!",
                    type: "default",
                  });
                  setItem("referalCode", "");
                })
                .catch((e) => {
                  Toast.show({
                    text1: "There is no group with that ID!",
                    type: "default",
                  });
                  setItem("referalCode", "");
                });
            },
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

  const getDistance = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/distance/get?authenticationKey=${retrieveData?.authenticationKey}`
      )
      .then(async ({ data }) => {
        let sessionStorage;
        try {
          sessionStorage = getItem("userData");
          if (!sessionStorage) return;
          sessionStorage = JSON.parse(sessionStorage);
          sessionStorage.currentMileage = data.toString();

          setItem("userData", JSON.stringify(sessionStorage));
        } catch (err) {
          console.log(err);
        }
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  };

  const checkForUnconfirmedDistance = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/distance/check-distance?authenticationKey=${retrieveData?.authenticationKey}`
      )
      .then(async ({ data }) => {
        if (data) {
          setConfirmDistanceData(data);
          setCurrentScreen("ConfirmDistance");
          setTimeout(() => {
            setVisible(true);
          }, 300);
        }
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  };

  const updateData = async () => {
    await getGroupData();
    checkForUnconfirmedDistance();
    getDistance();
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/user/get?authenticationKey=${retrieveData?.authenticationKey}`
      )
      .then(async ({ data }) => {
        let sessionStorage;
        try {
          sessionStorage = getItem("userData");
          if (!sessionStorage) return;
          sessionStorage = JSON.parse(sessionStorage);
          sessionStorage = { ...sessionStorage, ...data[0] };
          if (setData) setData(sessionStorage);
          getDistance();
          setItem("userData", JSON.stringify(sessionStorage));
        } catch (err) {
          console.log(err);
        }
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  const getGroupData = async () => {
    let sessionStorage = getItem("groupData");

    if (sessionStorage) setGroupData(JSON.parse(sessionStorage));

    if (!retrieveData?.groupID) return;

    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          "/group/get?authenticationKey=" +
          retrieveData?.authenticationKey
      )
      .then(async ({ data }) => {
        if (!data.distance) {
          setCurrentScreen("Settings");
          setVisible(true);
          return;
        }
        setItem("groupData", JSON.stringify(data));
        setGroupData(data);
      })
      .catch(() => {});
  };

  const handleClose = () => {
    setVisible(false);
    updateData();
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
        distance={groupData.distance}
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
