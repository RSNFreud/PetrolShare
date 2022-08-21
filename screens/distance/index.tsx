import React, { useContext, useEffect, useState } from "react";
import Popup from "../../components/Popup";
import { Layout, Breadcrumbs, Button } from "../../components/Themed";
import Manual from "./manual";
import * as SecureStore from "expo-secure-store";
import Odometer from "./odometer";
import Toast from "react-native-toast-message";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { Alert } from "react-native";

export default ({ navigation }: any) => {
  const [popupData, setPopupData] = useState(<></>);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ startValue: "", endValue: "" });
  const { retrieveData } = useContext(AuthContext);
  const [isDraft, setIsDraft] = useState(false);

  const openPopup = (element: JSX.Element) => {
    setPopupData(element);
    setVisible(true);
  };

  useEffect(() => {
    const getDraft = async () => {
      const draft = await SecureStore.getItemAsync("draft");

      if (draft != null) {
        setData({ ...JSON.parse(draft) });
        Toast.show({
          type: "default",
          text1: "Recovered draft data!",
        });
        setIsDraft(true);
        openPopup(
          <Odometer
            previousData={{ ...JSON.parse(draft) }}
            handleClose={() => handleClose()}
          />
        );
      } else {
        setVisible(false);
      }
    };
    getDraft();
  }, []);

  const resetDistance = () => {
    Alert.alert("Are you sure you want to reset your data?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          axios
            .post(`https://petrolshare.freud-online.co.uk/distance/reset`, {
              authenticationKey: retrieveData().authenticationKey,
            })
            .then(async (e) => {
              await SecureStore.setItemAsync("showToast", "resetDistance");
              navigation.navigate("Dashboard");
            })
            .catch(({ response }) => {
              console.log(response.message);
            });
        },
      },
      { text: "No", style: "cancel" },
    ]);
  };

  const handleClose = () => {
    if (isDraft === false) return setVisible(false);

    Alert.alert("Do you want to delete this draft?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          await SecureStore.deleteItemAsync("draft");
          setVisible(false);
          setIsDraft(false);
          setData({ startValue: "", endValue: "" });
        },
      },
      {
        text: "Save for later",
        onPress: () => {
          setVisible(false);
        },
        style: "cancel",
      },
    ]);
  };

  return (
    <Layout>
      <Breadcrumbs
        links={[
          {
            name: "Dashboard",
          },
          {
            name: "Manage Distance",
          },
        ]}
      />
      <Button
        styles={{ marginBottom: 20 }}
        handleClick={() =>
          openPopup(<Manual handleClose={() => handleClose()} />)
        }
      >
        Add Specific Distance
      </Button>
      <Button
        styles={{ marginBottom: 20 }}
        handleClick={() =>
          openPopup(
            <Odometer previousData={data} handleClose={() => handleClose()} />
          )
        }
      >
        Record Odometer
      </Button>
      <Button
        styles={{ marginBottom: 20 }}
        handleClick={() => navigation.navigate("AddPreset")}
      >
        Select Preset
      </Button>
      <Button handleClick={() => resetDistance()}>Reset Distance</Button>
      <Popup
        visible={visible}
        handleClose={() => handleClose()}
        children={popupData}
        animate={isDraft ? false : true}
      />
    </Layout>
  );
};
