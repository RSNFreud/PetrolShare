import { useContext, useEffect, useRef, useState } from "react";
import { Box, Text } from "../../components/Themed";
import { AuthContext } from "../../hooks/context";
import SplitRow from "./splitRow";
import { View, TouchableWithoutFeedback } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { deleteItem, getItem, setItem } from "../../hooks";
import ManageGroup from "../../components/manageGroup";
import { EventRegister } from "react-native-event-listeners";
import Layout from "../../components/layout";
import config from "../../config";

export default ({ navigation }: any) => {
  const { setData, retrieveData } = useContext(AuthContext);
  const [firstSteps, setFirstSteps] = useState(false);
  const [currentMileage, setCurrentMileage] = useState(
    retrieveData ? retrieveData()?.currentMileage : 0
  );
  const dataRetrieved = useRef(false);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [groupData, setGroupData] = useState<{
    distance?: string;
    petrol?: string;
    currency?: string;
  }>({});
  const [currentScreen, setCurrentScreen] = useState<string>("");

  useEffect(() => {
    if (dataRetrieved.current) return;
    if (retrieveData && retrieveData().authenticationKey) {
      dataRetrieved.current = true;
      setCurrentMileage(retrieveData().currentMileage);
      updateData();
      if (
        retrieveData() &&
        Object.values(retrieveData()).length &&
        retrieveData().groupID === null
      ) {
        setFirstSteps(true);
        setVisible(true);
      } else {
        setFirstSteps(false);
        setVisible(false);
      }

      if (retrieveData() && retrieveData().groupID !== null) getGroupData();

      navigation.addListener("focus", async () => {
        updateData();
        getGroupData();

        if ((await getItem("showToast")) === "distanceUpdated") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1: "Distance successfully updated!",
          });
        }
        if ((await getItem("showToast")) === "nameUpdated") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1: "Your name has been successfully updated!",
          });
        }
        if ((await getItem("showToast")) === "draftSaved") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1:
              "Saved your distance as a draft! Access it by clicking on Manage Distance again!",
          });
        }
        if ((await getItem("showToast")) === "resetDistance") {
          await deleteItem("showToast");
          Toast.show({
            type: "default",
            text1: "Reset your distance back to 0!",
          });
        }
      });

      EventRegister.addEventListener("dataUpdated", () => {
        updateData();
      });
    }
  }, [retrieveData]);

  const getDistance = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/distance/get?authenticationKey=${retrieveData().authenticationKey}`
      )
      .then(async ({ data }) => {
        setCurrentMileage(data);
        let sessionStorage;
        try {
          sessionStorage = await getItem("userData");
          if (!sessionStorage) return;
          sessionStorage = JSON.parse(sessionStorage);
          sessionStorage.currentMileage = data.toString();

          await setItem("userData", JSON.stringify(sessionStorage));
        } catch (err) {
          console.log(err);
        }
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  const updateData = async () => {
    if ((await getItem("showToast")) === "groupSettingsUpdated") {
      await deleteItem("showToast");
      Toast.show({
        text1: "Group settings succesfully updated!",
        type: "default",
      });
    }
    getGroupData();
    getDistance();
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/user/get?authenticationKey=${retrieveData().authenticationKey}`
      )
      .then(async ({ data }) => {
        let sessionStorage;
        try {
          sessionStorage = await getItem("userData");
          if (!sessionStorage) return;
          sessionStorage = JSON.parse(sessionStorage);
          sessionStorage = { ...sessionStorage, ...data[0] };
          setData(sessionStorage);
          getDistance();
          if (Object.values(data).length && data.groupID !== null)
            setFirstSteps(false);

          await setItem("userData", JSON.stringify(sessionStorage));
        } catch (err) {
          console.log(err);
        }
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  const getGroupData = async () => {
    let sessionStorage = await getItem("groupData");
    if (sessionStorage) setGroupData(JSON.parse(sessionStorage));

    axios
      .get(
        config.REACT_APP_API_ADDRESS +
          "/group/get?authenticationKey=" +
          retrieveData().authenticationKey
      )
      .then(async ({ data }) => {
        if (!data.distance) {
          setFirstSteps(true);
          setCurrentScreen("Settings");
          setVisible(true);
          return;
        }
        setFirstSteps(false);
        await setItem("groupData", JSON.stringify(data));
        setGroupData(data);
      })
      .catch(() => {});
  };

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(
      retrieveData ? retrieveData()?.groupID || null : null
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  return (
    <Layout style={{ display: "flex" }}>
      <Box>
        <>
          <Text style={{ fontSize: 18 }}>
            Welcome
            <Text style={{ fontWeight: "bold" }}>
              &nbsp;
              {retrieveData ? retrieveData()?.fullName || "User" : "User"}
            </Text>
            !
          </Text>
          <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Group ID: </Text>
                {retrieveData ? retrieveData()?.groupID || "Loading..." : null}
              </Text>
              {!!(retrieveData && retrieveData()?.groupID) &&
                (copied ? (
                  <Svg width="18" height="18" fill="none" viewBox="0 0 26 26">
                    <Path
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4.469 14.219l5.687 5.687L21.531 7.72"
                    ></Path>
                  </Svg>
                ) : (
                  <Svg width="18" height="18" fill="none" viewBox="0 0 26 26">
                    <Path
                      fill="#fff"
                      d="M21.306 5.056H7.583A1.083 1.083 0 006.5 6.139v17.333a1.084 1.084 0 001.083 1.084h13.723a1.084 1.084 0 001.083-1.084V6.14a1.083 1.083 0 00-1.083-1.083zm-.362 18.055h-13V6.5h13v16.611z"
                    ></Path>
                    <Path
                      fill="#fff"
                      d="M18.778 2.528a1.083 1.083 0 00-1.083-1.084H3.972A1.083 1.083 0 002.89 2.528V19.86a1.083 1.083 0 001.083 1.083h.361V2.89h14.445v-.361z"
                    ></Path>
                  </Svg>
                ))}
            </View>
          </TouchableWithoutFeedback>
          <Text style={{ fontSize: 16, marginTop: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Current Mileage: </Text>
            {currentMileage || 0} {groupData.distance}
          </Text>
        </>
      </Box>

      <SplitRow
        style={{ marginTop: 32 }}
        buttons={[
          {
            text: "Manage Distance",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M11.549 9.693l-4.474 4.014-4.473-4.014C1.717 8.9 1.115 7.887.872 6.786a5.142 5.142 0 01.36-3.281c.479-1.038 1.29-1.924 2.33-2.548A6.848 6.848 0 017.074 0a6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.142 5.142 0 01.36 3.28c-.244 1.102-.846 2.114-1.73 2.908zM7.075 7.742a2.44 2.44 0 001.626-.605 1.96 1.96 0 00.674-1.46 1.96 1.96 0 00-.674-1.46 2.44 2.44 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.44 2.44 0 001.626.605zm14.823 11.244L17.425 23l-4.474-4.015c-.884-.795-1.486-1.806-1.73-2.908a5.142 5.142 0 01.36-3.28c.48-1.038 1.29-1.925 2.33-2.549a6.848 6.848 0 013.514-.957 6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.141 5.141 0 01.36 3.281c-.244 1.101-.846 2.113-1.73 2.908zm-4.473-1.952c.61 0 1.195-.217 1.626-.605a1.96 1.96 0 00.674-1.46c0-.547-.242-1.073-.674-1.46a2.439 2.439 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.439 2.439 0 001.626.605z"
                ></Path>
              </Svg>
            ),
            handleClick: () => navigation.navigate("ManageDistance"),
          },
          {
            text: "View Logs",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M.25 1.917h10.542v1.916H.25V1.917zm13.417 0h9.583v1.916h-9.583V1.917zm2.875 5.75h6.708v1.916h-6.708V7.667zm-9.584 0h6.709v1.916H6.958V7.667zm-6.708 0h3.833v1.916H.25V7.667zm0 5.75h23v1.916h-23v-1.916zm0 5.75h16.292v1.916H.25v-1.916zm19.167 0h3.833v1.916h-3.833v-1.916z"
                ></Path>
              </Svg>
            ),
            handleClick: () => navigation.navigate("Logs"),
          },
        ]}
      />
      <SplitRow
        style={{ marginVertical: 20 }}
        buttons={[
          {
            text: "Add Petrol",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M2.188 2.875A2.875 2.875 0 015.062 0h8.625a2.875 2.875 0 012.876 2.875v11.5a2.875 2.875 0 012.875 2.875v.719a.719.719 0 101.437 0V11.5h-.719a.719.719 0 01-.718-.719V6.29a.719.719 0 01.718-.719h2.15c-.017-.684-.077-1.285-.29-1.756a1.394 1.394 0 00-.566-.659c-.264-.158-.667-.28-1.294-.28a.719.719 0 010-1.438c.811 0 1.487.159 2.03.484.55.327.911.792 1.141 1.303.424.942.423 2.106.423 2.992v4.565a.719.719 0 01-.719.719h-.718v6.469a2.157 2.157 0 01-4.313 0v-.719a1.438 1.438 0 00-1.438-1.438v5.75h.72a.719.719 0 110 1.438H1.468a.719.719 0 110-1.438h.718V2.875zm3.593 0a.719.719 0 00-.718.719v7.187a.719.719 0 00.718.719h7.188a.719.719 0 00.719-.719V3.594a.719.719 0 00-.72-.719H5.782z"
                ></Path>
              </Svg>
            ),
            handleClick: () => navigation.navigate("AddPetrol"),
          },
          {
            text: "Invoices",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <Path
                  fill="#fff"
                  d="M21 6h-6V0l6 6zm-6 1.5h6v14.25A2.25 2.25 0 0118.75 24H5.25A2.25 2.25 0 013 21.75V2.25A2.25 2.25 0 015.25 0h8.25v6c0 .83.67 1.5 1.5 1.5zM6 4.125c0 .205.17.375.375.375h3.75c.206 0 .375-.17.375-.375v-.75A.377.377 0 0010.125 3h-3.75A.378.378 0 006 3.375v.75zM6.375 7.5h3.75a.376.376 0 00.375-.375v-.75A.376.376 0 0010.125 6h-3.75A.377.377 0 006 6.375v.75c0 .206.17.375.375.375zm5.883 7.35l-.3-.075c-1.069-.328-1.046-.52-1.008-.69.065-.365.778-.455 1.419-.357.262.04.55.132.824.228a.938.938 0 00.615-1.772 7.648 7.648 0 00-.87-.248v-.311a.938.938 0 00-1.875 0v.28c-1.05.226-1.791.883-1.96 1.862-.347 2.008 1.556 2.567 2.368 2.805l.273.08c1.372.392 1.35.524 1.308.762-.064.367-.777.457-1.42.358-.326-.048-.741-.198-1.11-.33l-.209-.076a.938.938 0 00-.624 1.77l.2.07c.363.13.768.262 1.174.352v.317a.938.938 0 001.875 0v-.293c1.048-.225 1.791-.869 1.961-1.848.35-2.03-1.596-2.589-2.641-2.884z"
                ></Path>
              </Svg>
            ),
            handleClick: () => navigation.navigate("Invoices"),
          },
        ]}
      />
      <SplitRow
        buttons={[
          {
            text: "Manage Group",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M11.94 3.613c-1.981 0-3.587 1.874-3.587 4.187 0 1.604.772 2.997 1.907 3.7l-4.815 2.233c-.339.169-.507.455-.507.861v3.855c.028.482.317.93.786.938h12.45c.536-.046.806-.477.812-.938v-3.855c0-.405-.169-.692-.507-.861l-3.373-1.623-1.402-.665c1.088-.719 1.822-2.082 1.822-3.645 0-2.313-1.606-4.187-3.586-4.187zM6.155 5.085c-.853.033-1.528.401-2.042.99a3.832 3.832 0 00-.85 2.383c.035 1.235.588 2.405 1.573 3.017l-3.93 1.827c-.27.101-.406.338-.406.71v3.093c.021.41.234.755.634.761h2.612v-3.272c.043-.875.454-1.582 1.192-1.927l2.611-1.242c.203-.118.397-.28.583-.482A5.876 5.876 0 017.6 5.542c-.451-.276-.958-.454-1.445-.457zm11.664 0c-.557.012-1.072.217-1.496.507.675 1.766.49 3.757-.507 5.3.22.254.448.448.685.583l2.51 1.192c.765.42 1.16 1.133 1.167 1.927v3.272h2.688c.442-.038.63-.39.634-.76v-3.094c0-.338-.135-.575-.406-.71l-3.88-1.852a3.716 3.716 0 001.522-2.992c-.027-.902-.302-1.738-.85-2.384-.573-.62-1.283-.982-2.067-.989z"
                ></Path>
              </Svg>
            ),
            handleClick: () => {
              setCurrentScreen("");
              setVisible(true);
            },
          },
          {
            text: "Group Settings",
            icon: (
              <Svg width="24" height="24" viewBox="0 0 60 56.34">
                <G>
                  <Path
                    d="M16.7 22.7c-6.12-.43-12.62 1.41-16.7 6.2v18.34h9V36.83a24.6 24.6 0 0112.2-8.35 14.68 14.68 0 01-4.5-5.78zm-1.99-4.32h.68a14.34 14.34 0 016.89-13.93c-11.8-14.5-26.15 12.11-7.57 14zm29.52-1.66a13 13 0 010 1.53c20.14.29 5.91-29.46-6.56-13.58a14.5 14.5 0 016.56 12.05zM29.7 26.64c13.06-.33 13.06-19.47 0-19.8-13.06.33-13.05 19.47 0 19.8zm9.1 22.65c1.16 1.82 2.44 5.81 5.06 3.14a8.52 8.52 0 002 1.15c-1.06 3.62 3.22 2.59 5.31 2.71 1.38 0 1-1.85 1.06-2.71a8.79 8.79 0 002-1.15c.78.38 2.25 1.66 2.93.46 1-1.87 4-5 .28-5.85a8.13 8.13 0 000-2.31c.72-.46 2.57-1.07 1.84-2.25-1.16-1.81-2.45-5.81-5.06-3.14a8.52 8.52 0 00-2-1.15c1.06-3.61-3.22-2.59-5.31-2.7-1.38 0-1 1.84-1.06 2.7a8.52 8.52 0 00-2 1.15c-.78-.38-2.26-1.66-2.94-.45-1 1.86-3.94 5-.28 5.84a8.13 8.13 0 000 2.31c-.71.46-2.55 1.07-1.83 2.25zm10.26-7.56c5.58.09 5.58 8.22 0 8.32a4.16 4.16 0 110-8.32zm3.83-9.3c.69.52.33 2.47.41 3.19a11.38 11.38 0 012.7 1.54c1.09-.58 3.18-2.28 4-.44v-7.89c-4.07-4.91-10.92-6.83-17.12-6.06a14.58 14.58 0 01-4.43 5.42 24 24 0 017.8 3.81c.75.16 6.14-.36 6.64.43z"
                    fill="#fff"
                  ></Path>
                  <Path
                    d="M30.23 31.91a21.21 21.21 0 00-16.3 6.6c.92 3.14-2.71 17.89 3.54 17.43h21.59c-.78-.11-3.2-4.84-3.68-5.52-1-1.56 1.5-2.38 2.46-3a10.67 10.67 0 010-3.09c-5-1.46-.9-5.14.37-7.79.9-1.6 2.88.1 3.91.61a11.74 11.74 0 011.76-1 21.27 21.27 0 00-13.65-4.24z"
                    fill="#fff"
                  ></Path>
                </G>
              </Svg>
            ),
            handleClick: () => {
              setCurrentScreen("Settings");
              setVisible(true);
            },
          },
        ]}
      />
      <ManageGroup
        closeButton={true}
        handleClose={() => setVisible(false)}
        visible={visible}
        onComplete={updateData}
        firstSteps={firstSteps}
        screen={currentScreen}
      />
    </Layout>
  );
};
