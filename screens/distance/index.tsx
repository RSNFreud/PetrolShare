import React, { useContext, useEffect, useState } from "react";
import Popup from "../../components/Popup";
import { Layout, Breadcrumbs, Button, Text } from "../../components/Themed";
import Manual from "./manual";
import Odometer from "./odometer";
import Toast from "react-native-toast-message";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import Svg, { Path } from "react-native-svg";
import { TouchableOpacity } from "react-native";
import { deleteItem, getItem, setItem, Alert } from "../../hooks";

const DistanceButton = ({
  handleClick,
  text,
  icon,
}: {
  marginBottom?: number;
  handleClick: () => void;
  text: string;
  icon: JSX.Element;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        marginBottom: 20,
        backgroundColor: "#1196B0",
        borderRadius: 4,
        height: 56,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
      onPress={handleClick}
    >
      {icon}
      <Text style={{ fontWeight: "700", fontSize: 18, marginLeft: 20 }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

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
      const draft = await getItem("draft");

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
    Alert("Are you sure you want to reset your data?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          axios
            .post(
              (process.env as any).REACT_APP_API_ADDRESS + `/distance/reset`,
              {
                authenticationKey: retrieveData().authenticationKey,
              }
            )
            .then(async (e) => {
              await setItem("showToast", "resetDistance");
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

    Alert("Do you want to delete this draft?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          await deleteItem("draft");
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
      <DistanceButton
        handleClick={() =>
          openPopup(<Manual handleClose={() => handleClose()} />)
        }
        text={"Add Specific Distance"}
        icon={
          <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <Path
              fill="#fff"
              d="M5 2a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 6 3 3 0 000-6zm7 6a3 3 0 100-6 3 3 0 000 6zM5 9a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 6 3 3 0 000-6zM5 16a3 3 0 100 6 3 3 0 000-6zm7 0a3 3 0 100 5.999A3 3 0 0012 16zm7 0a3 3 0 100 5.999A3 3 0 0019 16z"
            ></Path>
          </Svg>
        }
      />
      <DistanceButton
        handleClick={() =>
          openPopup(
            <Odometer previousData={data} handleClose={() => handleClose()} />
          )
        }
        text={"Record Odometer"}
        icon={
          <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <Path
              fill="#fff"
              d="M12 22.286a10.286 10.286 0 100-20.572 10.286 10.286 0 000 20.572zM12 24a12 12 0 110-24 12 12 0 010 24z"
            ></Path>
            <Path
              fill="#fff"
              d="M3 12.09c0-2.41.948-4.722 2.636-6.427A8.955 8.955 0 0112 3c2.387 0 4.676.958 6.364 2.663A9.138 9.138 0 0121 12.09a.914.914 0 01-.264.643.895.895 0 01-1.272 0 .914.914 0 01-.264-.643 7.31 7.31 0 00-2.109-5.143A7.164 7.164 0 0012 4.818c-1.91 0-3.74.766-5.091 2.13A7.31 7.31 0 004.8 12.091a.914.914 0 01-.264.643.895.895 0 01-1.272 0A.914.914 0 013 12.09z"
            ></Path>
            <Path
              fill="#fff"
              d="M13.268 15.292c.497.377.842.916.976 1.521a2.602 2.602 0 01-.245 1.786 2.65 2.65 0 01-1.35 1.209 2.678 2.678 0 01-1.818.063 2.648 2.648 0 01-1.432-1.112 2.604 2.604 0 01.494-3.35 2.668 2.668 0 011.694-.66l1.685-5.135a.872.872 0 01.438-.516.891.891 0 011.196.384.868.868 0 01.048.673l-1.686 5.135v.002zm-1.888 2.916a.896.896 0 00.947-.263.874.874 0 00.116-.967.88.88 0 00-.515-.436.893.893 0 00-.675.052.868.868 0 00-.388 1.178.883.883 0 00.515.436z"
            ></Path>
          </Svg>
        }
      />

      <DistanceButton
        text="Select Preset"
        icon={
          <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <Path
              fill="#fff"
              d="M0 10.5h18v3H0v-3zM0 3h24v3H0V3zm0 18h10.852v-3H0v3z"
            ></Path>
          </Svg>
        }
        handleClick={() => navigation.navigate("AddPreset")}
      />
      <DistanceButton
        handleClick={() => navigation.navigate("GPS")}
        text="GPS Tracking"
        icon={
          <Svg width="23" height="18" fill="none" viewBox="0 0 23 18">
            <Path
              fill="#fff"
              d="M13.5 18a9 9 0 10-9-9v4.65l-2.7-2.7L.75 12l4.5 4.5 4.5-4.5-1.05-1.05-2.7 2.7V9a7.5 7.5 0 117.5 7.5V18z"
            ></Path>
          </Svg>
        }
      />
      <DistanceButton
        handleClick={() => resetDistance()}
        text="Reset Distance"
        icon={
          <Svg width="23" height="18" fill="none" viewBox="0 0 23 18">
            <Path
              fill="#fff"
              d="M13.5 18a9 9 0 10-9-9v4.65l-2.7-2.7L.75 12l4.5 4.5 4.5-4.5-1.05-1.05-2.7 2.7V9a7.5 7.5 0 117.5 7.5V18z"
            ></Path>
          </Svg>
        }
      />
      <Popup
        visible={visible}
        handleClose={() => handleClose()}
        children={popupData}
        animate={isDraft ? false : true}
      />
    </Layout>
  );
};
