import { useContext, useEffect, useRef, useState } from "react";
import { Text } from "@components/text";
import { AuthContext } from "../../hooks/context";
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  AppState,
  ScrollView,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { Alert, checkForUpdates, getItem, setItem } from "../../hooks";
import Layout from "@components/layout";
import config from "../../config";
import * as Location from "expo-location";
import { useIsFocused, useRoute } from "@react-navigation/native";
import Colors from "../../constants/Colors";
import NavItem from "./navItem";
import Distance from "../distance";
import Petrol from "../petrol";
import Group from "../group";
import Popup from "@components/Popup";
import Demo from "@components/demo";
import GroupSettings from "@components/groupSettings";
import ConfirmDistance from "./confirmDistance";
import React from "react";
import FadeWrapper from "./fadeWrapper";
import Tooltip from "@components/tooltip";
import analytics from "@react-native-firebase/analytics";
import Schedules from "../schedules";
import GroupIcon from "../../assets/icons/group";
import PetrolIcon from "../../assets/icons/petrol";
import NavigationMarker from "../../assets/icons/navigationMarker";
import Share from "../../assets/icons/share";

export default ({ navigation }: any) => {
  const { setData, retrieveData } = useContext(AuthContext);
  const [currentMileage, setCurrentMileage] = useState(
    retrieveData ? retrieveData?.currentMileage : 0
  );
  const route = useRoute();
  const dataRetrieved = useRef(false);
  const [copied, setCopied] = useState(false);
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
  const appState = useRef(AppState.currentState);
  const [currentScreen, setCurrentScreen] = useState<string>("Settings");
  const [currentTab, setCurrentTab] = useState("Distance");
  const scrollRef = useRef(null);
  const isFocused = useIsFocused();
  const [previousTab, setPreviousTab] = useState(currentTab);

  useEffect(() => {
    if (dataRetrieved.current) return;
    if (retrieveData && retrieveData?.authenticationKey) {
      pageLoaded();
      dataRetrieved.current = true;
      setCurrentMileage(retrieveData?.currentMileage);
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
    if (!dataRetrieved) return;
    (async () => {
      if (
        Platform.OS === "android" &&
        (await Location.hasStartedLocationUpdatesAsync("gpsTracking"))
      ) {
        Alert(
          "You are currently tracking your GPS!",
          "Do you want to go to the Track GPS screen?",
          [
            {
              text: "Yes",
              onPress: () => {
                navigation.navigate("GPS");
              },
            },
            { text: "No", style: "cancel" },
          ]
        );
      }
    })();
  }, [dataRetrieved]);

  useEffect(() => {
    if (retrieveData?.groupID && groupData.distance) {
      setVisible(false);
    }
  }, [retrieveData?.groupID]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      pageLoaded();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollTo({ left: 0, top: 0 });
    }

    if (currentTab === "Petrol" || currentTab === previousTab) return;
    setPreviousTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (!isFocused) return;
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        pageLoaded();
        if (route.name === "Dashboard") checkForUpdates();
        console.log("App has come to the foreground!");
      }
      appState.current = nextAppState;
    });

    if (!isFocused) return subscription.remove();

    return () => {
      subscription.remove();
    };
  }, [isFocused]);

  const pageLoaded = async () => {
    // if (route.name === "Dashboard") setCurrentTab("Distance")

    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollTo({ left: 0, top: 0 });
    }
    let referallCode = getItem("referalCode");
    if (referallCode) {
      return sendReferal(referallCode);
    }

    if (route && route.params) {
      const groupID = (route.params as { groupID?: string })["groupID"];
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
              if (route.name === "Login") return;
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
        setCurrentMileage(data);
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

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(
      retrieveData
        ? `https://petrolshare.freud-online.co.uk/short/referral?groupID=${retrieveData?.groupID}`
        : ""
    );
    Alert(
      "Information:",
      "Copied the group ID to your\nclipboard - feel free to share it to invite other members to your group!"
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  const handleClose = () => {
    setVisible(false);
    updateData();
  };

  const closePetrol = () => {
    setCurrentTab(previousTab);
  };

  const changeTab = async (name: string) => {
    setCurrentTab(name);
    try {
      await analytics().logScreenView({
        screen_name: name,
        screen_class: name,
      });
    } catch {}
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

  // return (
  //   <Dropdown
  //     data={[
  //       { value: "test", name: "sdsds" },
  //       { value: "asa", name: "sasadsds" },
  //       { value: "tsasast", name: "sdasassds" },
  //       { value: "teasasst", name: "sdsasasds" },
  //     ]}
  //     value="tsasast"
  //     placeholder=""
  //     handleSelected={() => {}}
  //   />
  // );
  return (
    <Layout homepage>
      <View
        style={{
          backgroundColor: Colors.secondary,
          paddingHorizontal: 25,
          paddingBottom: 35,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            backgroundColor: Colors.primary,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
            borderColor: Colors.border,
            borderStyle: "solid",
            borderWidth: 1,
          }}
        >
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <GroupIcon width="15" height="15" style={{ marginRight: 10 }} />
              <TouchableWithoutFeedback
                onPress={() =>
                  Alert(
                    "Group ID",
                    "This unique ID is used to identify your group. Share it with others to invite them to your group."
                  )
                }
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 18, fontWeight: "500" }}>
                    {retrieveData
                      ? retrieveData?.groupID || "Loading..."
                      : null}
                  </Text>
                  <Tooltip
                    style={{ marginLeft: 6 }}
                    title="Group ID"
                    message="This unique ID is used to identify your group. Share it with others to invite them to your group."
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <NavigationMarker
                width="15"
                height="15"
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: 16, marginTop: 5, fontWeight: "300" }}>
                {currentMileage || 0} {groupData.distance}
              </Text>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {!!(retrieveData && retrieveData?.groupID) && (
                <Share width="25" height="25" />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 25,
          backgroundColor: Colors.primary,
          justifyContent: "center",
        }}
      >
        <NavItem
          active={currentTab}
          handleClick={(e) => changeTab(e)}
          text="Distance"
          icon={
            <NavigationMarker
              width="15"
              height="15"
              style={{ marginRight: 10 }}
            />
          }
        />

        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: Colors.border,
            width: 1,
            marginVertical: 15,
          }}
        />
        <NavItem
          active={currentTab}
          handleClick={(e) => changeTab(e)}
          icon={
            <PetrolIcon width="15" height="15" style={{ marginRight: 10 }} />
          }
          text="Petrol"
        />

        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: Colors.border,
            width: 1,
            marginVertical: 15,
          }}
        />
        <NavItem
          active={currentTab}
          handleClick={(e) => changeTab(e)}
          icon={
            <GroupIcon width="15" height="15" style={{ marginRight: 10 }} />
          }
          text="Group"
        />
      </View>
      <ScrollView
        ref={scrollRef}
        overScrollMode={"always"}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{
          paddingHorizontal: 25,
          paddingBottom: 55,
          paddingTop: 30,
        }}
      >
        <FadeWrapper currentTab={currentTab}>
          <>
            {currentTab === "Distance" && <Distance onUpdate={updateData} />}
            {currentTab === "Petrol" && <Petrol onClose={closePetrol} />}
            {currentTab === "Group" && <Group onUpdate={updateData} />}
          </>
        </FadeWrapper>
      </ScrollView>
      <Popup
        visible={visible}
        handleClose={() => {}}
        showClose={false}
        title={getTitle(currentScreen)}
      >
        {currentScreen === "" ? (
          <Demo handleClose={handleClose} handleUpdate={updateData} />
        ) : (
          <></>
        )}
        {currentScreen === "Settings" ? (
          <GroupSettings handleComplete={handleClose} newGroup hideCancel />
        ) : (
          <></>
        )}
        {currentScreen === "ConfirmDistance" && confirmDistanceData ? (
          <ConfirmDistance
            handleComplete={handleClose}
            {...confirmDistanceData}
          />
        ) : (
          <></>
        )}
      </Popup>
    </Layout>
  );
};
