import { useContext, useEffect, useState } from "react";
import { Box, Button, Layout, Text } from "../../components/Themed";
import generateGroupID from "../../hooks/generateGroupID";
import { AuthContext } from "../../navigation";
import SplitRow from "./splitRow";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import Popup from "../../components/Popup";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

export default ({ route, navigation }: any) => {
  const { retrieveData } = useContext(AuthContext);
  const [currentMileage, setCurrentMileage] = useState(
    retrieveData ? retrieveData()?.currentMileage : 0
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    navigation.addListener("focus", () => {
      if (route.params && route.params?.showToast === "distanceUpdated") {
        console.log("ho", route.params?.showToast);

        navigation.setParams({});
        Toast.show({
          type: "default",
          text1: "Distance successfully updated!",
        });
      }
      if (!retrieveData) return;
      axios
        .get(
          `https://petrolshare.freud-online.co.uk/data/mileage?emailAddress=${
            retrieveData().emailAddress
          }&authenticationKey=${retrieveData().authenticationKey}`
        )
        .then(async ({ data }) => {
          setCurrentMileage(data);
          let sessionStorage;
          try {
            sessionStorage = await SecureStore.getItemAsync("userData");
            if (!sessionStorage) return;
            sessionStorage = JSON.parse(sessionStorage);
            sessionStorage.currentMileage = data.toString();

            await SecureStore.setItemAsync(
              "userData",
              JSON.stringify(sessionStorage)
            );
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  const resetDistance = () => {
    axios
      .post(`https://petrolshare.freud-online.co.uk/data/reset`, {
        emailAddress: retrieveData().emailAddress,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(() => {
        setCurrentMileage(0);
        setVisible(false);
        Toast.show({
          type: "default",
          text1: "Successfully reset your distance to 0.",
        });
      })
      .catch(({ response }) => {
        console.log(response.message);
      });
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
          <Text style={{ fontSize: 16, marginTop: 20 }}>
            <Text style={{ fontWeight: "bold" }}>Group ID: </Text>
            {retrieveData
              ? retrieveData()?.groupID || generateGroupID()
              : generateGroupID()}
          </Text>
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
            text: "Add Distance",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M11.549 9.693l-4.474 4.014-4.473-4.014C1.717 8.9 1.115 7.887.872 6.786a5.142 5.142 0 01.36-3.281c.479-1.038 1.29-1.924 2.33-2.548A6.848 6.848 0 017.074 0a6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.142 5.142 0 01.36 3.28c-.244 1.102-.846 2.114-1.73 2.908zM7.075 7.742a2.44 2.44 0 001.626-.605 1.96 1.96 0 00.674-1.46 1.96 1.96 0 00-.674-1.46 2.44 2.44 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.44 2.44 0 001.626.605zm14.823 11.244L17.425 23l-4.474-4.015c-.884-.795-1.486-1.806-1.73-2.908a5.142 5.142 0 01.36-3.28c.48-1.038 1.29-1.925 2.33-2.549a6.848 6.848 0 013.514-.957 6.85 6.85 0 013.514.957c1.04.624 1.85 1.51 2.33 2.548a5.141 5.141 0 01.36 3.281c-.244 1.101-.846 2.113-1.73 2.908zm-4.473-1.952c.61 0 1.195-.217 1.626-.605a1.96 1.96 0 00.674-1.46c0-.547-.242-1.073-.674-1.46a2.439 2.439 0 00-1.626-.605 2.44 2.44 0 00-1.626.605 1.964 1.964 0 00-.674 1.46c0 .548.242 1.073.674 1.46a2.439 2.439 0 001.626.605z"
                ></Path>
              </Svg>
            ),
            handleClick: () => navigation.navigate("AddDistance"),
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
          },
        ]}
      />
      <SplitRow
        style={{ marginVertical: 20 }}
        buttons={[
          {
            text: "Reset Distance",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M13.733 21.017A9.517 9.517 0 104.216 11.5v4.917L1.36 13.562l-1.11 1.11 4.759 4.759 4.758-4.759-1.11-1.11-2.855 2.855V11.5a7.931 7.931 0 117.93 7.931v1.586z"
                ></Path>
              </Svg>
            ),
            handleClick: () => setVisible(true),
          },
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
          },
        ]}
      />
      <SplitRow
        buttons={[
          {
            text: "Join a Group",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M11.94 3.613c-1.981 0-3.587 1.874-3.587 4.187 0 1.604.772 2.997 1.907 3.7l-4.815 2.233c-.339.169-.507.455-.507.861v3.855c.028.482.317.93.786.938h12.45c.536-.046.806-.477.812-.938v-3.855c0-.405-.169-.692-.507-.861l-3.373-1.623-1.402-.665c1.088-.719 1.822-2.082 1.822-3.645 0-2.313-1.606-4.187-3.586-4.187zM6.155 5.085c-.853.033-1.528.401-2.042.99a3.832 3.832 0 00-.85 2.383c.035 1.235.588 2.405 1.573 3.017l-3.93 1.827c-.27.101-.406.338-.406.71v3.093c.021.41.234.755.634.761h2.612v-3.272c.043-.875.454-1.582 1.192-1.927l2.611-1.242c.203-.118.397-.28.583-.482A5.876 5.876 0 017.6 5.542c-.451-.276-.958-.454-1.445-.457zm11.664 0c-.557.012-1.072.217-1.496.507.675 1.766.49 3.757-.507 5.3.22.254.448.448.685.583l2.51 1.192c.765.42 1.16 1.133 1.167 1.927v3.272h2.688c.442-.038.63-.39.634-.76v-3.094c0-.338-.135-.575-.406-.71l-3.88-1.852a3.716 3.716 0 001.522-2.992c-.027-.902-.302-1.738-.85-2.384-.573-.62-1.283-.982-2.067-.989z"
                ></Path>
              </Svg>
            ),
          },
        ]}
      />
      <Popup visible={visible} handleClose={() => setVisible(false)}>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 20,
            fontWeight: "bold",
            lineHeight: 28,
          }}
        >
          Are you sure you want to reset{"\n"}your distance?
        </Text>
        <Button
          styles={{ marginBottom: 20 }}
          handleClick={() => resetDistance()}
        >
          Yes
        </Button>
        <Button style="ghost" handleClick={() => setVisible(false)}>
          No
        </Button>
      </Popup>
    </Layout>
  );
};
