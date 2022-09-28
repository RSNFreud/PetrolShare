import { useContext, useEffect, useRef, useState } from "react";
import { Box, Layout, Text } from "../../components/Themed";
import { AuthContext } from "../../hooks/context";
import SplitRow from "./splitRow";
import { View, TouchableWithoutFeedback } from "react-native";
import Svg, { G, Path, Mask } from "react-native-svg";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { deleteItem, getItem, setItem } from "../../hooks";
import ManageGroup from "../../components/manageGroup";

export default ({ navigation }: any) => {
  const { setData, retrieveData } = useContext(AuthContext);
  const [firstSteps, setFirstSteps] = useState(false);
  const [currentMileage, setCurrentMileage] = useState(
    retrieveData ? retrieveData()?.currentMileage : 0
  );
  const dataRetrieved = useRef(false);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (dataRetrieved.current) return;
    if (retrieveData && retrieveData().authenticationKey) {
      dataRetrieved.current = true;
      updateData();
      if (
        retrieveData() &&
        Object.values(retrieveData()).length &&
        retrieveData().groupID === null
      ) {
        setFirstSteps(true);
        setVisible(true);
      }

      navigation.addListener("focus", async () => {
        updateData();
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
    }
  }, [retrieveData]);

  const getDistance = () => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
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
      .catch((err) => {
        console.log(err);
      });
  };

  const updateData = () => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
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
            {currentMileage}km
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
            handleClick: () => setVisible(true),
          },
          {
            text: "Group Settings",
            icon: (
              <Svg width="23" height="23" fill="none" viewBox="0 0 23 23">
                <G clipPath="url(#a)">
                  <Path
                    fill="#fff"
                    d="M7.667 10.312H7.11a5.539 5.539 0 00-4.108 1.61l-.154.179v5.29h2.607v-3.003l.351-.396.16-.186a7.028 7.028 0 013.01-1.827 4.21 4.21 0 01-1.31-1.667zm-.575-1.246h.198a4.12 4.12 0 011.987-4.019 2.613 2.613 0 10-2.185 4.044v-.025zm8.516-.479a4.21 4.21 0 010 .44c.123.02.246.03.37.032h.122a2.613 2.613 0 10-2.383-3.948 4.17 4.17 0 011.891 3.476zm-4.191 2.862a2.856 2.856 0 100-5.712 2.856 2.856 0 000 5.712zm2.624 6.532l.613 1.038c.04.07.107.12.186.14.079.02.162.01.232-.03l.428-.242c.178.137.374.25.58.334v.479c0 .08.033.156.09.212a.31.31 0 00.217.088h1.226a.31.31 0 00.217-.088.296.296 0 00.09-.212v-.48c.208-.084.403-.197.58-.333l.428.242a.311.311 0 00.418-.11l.613-1.038a.296.296 0 00-.111-.41l-.42-.237a2.257 2.257 0 00-.002-.668l.42-.238a.297.297 0 00.113-.41l-.613-1.037a.312.312 0 00-.419-.11l-.427.242a2.473 2.473 0 00-.58-.334V14.3a.297.297 0 00-.09-.212.31.31 0 00-.217-.088h-1.226a.31.31 0 00-.217.088.297.297 0 00-.09.212v.48a2.492 2.492 0 00-.58.333l-.428-.242a.311.311 0 00-.418.11l-.613 1.038a.295.295 0 00.112.41l.42.237a2.254 2.254 0 000 .668l-.42.238a.297.297 0 00-.112.41zM17 15.8c.676 0 1.226.538 1.226 1.2 0 .662-.55 1.2-1.226 1.2-.676 0-1.226-.538-1.226-1.2 0-.662.55-1.2 1.226-1.2z"
                  ></Path>
                  <Mask
                    id="b"
                    style={{ maskType: "alpha" }}
                    width="17"
                    height="12"
                    x="4"
                    y="10"
                    maskUnits="userSpaceOnUse"
                  >
                    <path
                      fill="#D9D9D9"
                      fillRule="evenodd"
                      d="M21 10H4v11h9.498c-.045.09-.038.11.068 0h2.617a.413.413 0 01-.289-.117.396.396 0 01-.12-.283v-.64c-.133-.053-.47.205-.81.464-.36.276-.722.553-.844.459h-.448a3.67 3.67 0 01-.106.117h-.068a8 8 0 01.268-.455c.192-.315.4-.655.354-.667a.407.407 0 01-.248-.186l-.817-1.384a.396.396 0 01.149-.546l.56-.317a3.007 3.007 0 010-.89l-.56-.317a.394.394 0 01-.15-.546l.818-1.384a.402.402 0 01.248-.187.416.416 0 01.31.04l.57.323c.236-.182.497-.332.774-.445V13.4c0-.106.043-.208.12-.283a.413.413 0 01.289-.117h1.634c.108 0 .212.042.289.117a.4.4 0 01.12.283v.64c.277.112.537.262.773.444l.57-.322a.416.416 0 01.559.146l.817 1.384a.396.396 0 01-.15.546l-.56.317a3.01 3.01 0 01.001.89l.56.317a.402.402 0 01.204.347V10zm0 8.109c0 .07-.018.138-.054.2l-.817 1.383a.415.415 0 01-.559.146l-.57-.322a3.324 3.324 0 01-.774.445v.639a.396.396 0 01-.12.283.413.413 0 01-.289.117H21v-2.891z"
                      clipRule="evenodd"
                    ></path>
                  </Mask>
                  <g fill="#fff" mask="url(#b)">
                    <path d="M20.023 11.902a5.54 5.54 0 00-4.108-1.61 6.768 6.768 0 00-.697.039 4.21 4.21 0 01-1.277 1.565 6.97 6.97 0 013.194 1.917l.16.179.345.396v3.009h2.517V12.08l-.134-.178z"></path>
                    <path d="M11.57 12.97a6.19 6.19 0 00-4.542 1.724l-.16.18v4.043a1.004 1.004 0 001.022.984h7.341a1.001 1.001 0 001.022-.983v-4.032l-.153-.191a6.12 6.12 0 00-4.53-1.726z"></path>
                  </g>
                </G>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M0 0h23v23H0z"></path>
                  </clipPath>
                </defs>
              </Svg>
            ),
            disabled: true,
          },
        ]}
      />
      <ManageGroup
        closeButton={true}
        handleClose={() => setVisible(false)}
        visible={visible}
        onComplete={updateData}
        firstSteps={firstSteps}
      />
    </Layout>
  );
};
