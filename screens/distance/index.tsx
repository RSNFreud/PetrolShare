import React, { useContext, useEffect, useState } from "react";
import Popup from "@components/Popup";
import { LongButton } from "@components/Themed";
import Manual from "./manual";
import Odometer from "./odometer";
import Toast from "react-native-toast-message";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import {
  deleteItem,
  getItem,
  Alert,
  sendCustomEvent,
  setItem,
} from "../../hooks";
import config from "../../config";
import AssignDistance from "./assignDistance";
import Keypad from "../../assets/icons/keypad";
import OdomoterIcon from "../../assets/icons/odometer";
import List from "../../assets/icons/list";
import Road from "../../assets/icons/road";
import Reset from "../../assets/icons/reset";
import { useRouter } from "expo-router";

export default ({ onUpdate }: { onUpdate: () => void }) => {
  const [popupData, setPopupData] = useState(<></>);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ startValue: "", endValue: "" });
  const { retrieveData } = useContext(AuthContext);
  const { navigate } = useRouter();
  const [isDraft, setIsDraft] = useState(false);

  const openPopup = (element: JSX.Element, title: string) => {
    setPopupData(element);
    setVisible(true);
    setTitle(title);
  };

  useEffect(() => {
    const getDraft = async () => {
      const draft = getItem("draft");

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
          />,
          "Record Odometer"
        );
      } else {
        setVisible(false);
      }
    };
    getDraft();
  }, []);

  const resetDistance = () => {
    Alert(
      "Are you sure you want to reset your distance?",
      "This will reset your distance back to 0 without creating a payment log!",
      [
        {
          text: "Yes",
          onPress: async () => {
            axios
              .post(config.REACT_APP_API_ADDRESS + `/distance/reset`, {
                authenticationKey: retrieveData?.authenticationKey,
              })
              .then(async (e) => {
                sendCustomEvent("sendAlert", "Reset your distance back to 0!");
                onUpdate();
              })
              .catch(({ response }) => {
                console.log(response.message);
              });
          },
        },
        { text: "No", style: "cancel" },
      ]
    );
  };

  const handleClose = (alert?: string) => {
    if (alert) {
      setItem("delayedAlert", alert);
    } else if (getItem("delayedAlert")) {
      sendCustomEvent("sendAlert", getItem("delayedAlert"));
      deleteItem("delayedAlert");
    }
    if (isDraft === false) {
      onUpdate();
      return setVisible(false);
    }
    Alert("Do you want to delete this draft?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          deleteItem("draft");
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
    <>
      <LongButton
        handleClick={() =>
          openPopup(
            <Manual handleClose={handleClose} />,
            "Add Specfic Distance"
          )
        }
        text={"Add Specific Distance"}
        icon={<Keypad width="20" height="20" />}
      />
      <LongButton
        handleClick={() =>
          openPopup(
            <Odometer previousData={data} handleClose={handleClose} />,
            "Record Odometer"
          )
        }
        text={"Record Odometer"}
        icon={<OdomoterIcon width="20" height="20" />}
      />

      <LongButton
        text="Presets"
        icon={<List width="20" height="20" />}
        handleClick={() => navigate("addPreset")}
      />
      <LongButton
        text="Assign Distance"
        icon={<Road width="20" height="20" />}
        handleClick={() =>
          openPopup(
            <AssignDistance handleClose={handleClose} />,
            "Assign Distance"
          )
        }
      />
      <LongButton
        last
        handleClick={resetDistance}
        text="Reset Distance"
        icon={<Reset width="20" height="20" />}
      />
      <Popup
        visible={visible}
        handleClose={() => handleClose()}
        children={popupData}
        animate={isDraft ? false : true}
        title={title}
      />
    </>
  );
};
