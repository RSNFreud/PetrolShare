import {
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import Input from "../../components/Input";
import {
  Breadcrumbs,
  Layout,
  Text,
  Button,
  FlexFull,
} from "../../components/Themed";
import Svg, { Path } from "react-native-svg";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import * as SecureStore from "expo-secure-store";
import Popup from "../../components/Popup";
import SubmitButton from "./submitButton";
import Toast from "react-native-toast-message";
export default ({ navigation }: any) => {
  const [data, setData] = useState({
    selectedPreset: null,
  });
  const [errors, setErrors] = useState("");
  const [distance, setDistance] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const [presets, setPresets] = useState<Array<any> | null>(null);
  const [presetFormData, setPresetFormData] = useState({
    presetID: "",
    presetName: "",
    distance: "",
  });
  const [presetFormErrors, setPresetFormErrors] = useState({
    presetName: "",
    distance: "",
  });
  const [popupType, setPopupType] = useState("new");
  const selectedToDelete = useRef("");
  const getPresets = async () => {
    const currentPresets = await SecureStore.getItemAsync("presets");
    if (currentPresets) {
      setPresets(JSON.parse(currentPresets));
    }

    if (retrieveData) {
      axios
        .get(
          `https://petrolshare.freud-online.co.uk/preset/get?authenticationKey=${
            retrieveData().authenticationKey
          }`
        )
        .then(async ({ data }) => {
          setPresets(data);
          await SecureStore.setItemAsync("presets", JSON.stringify(data));
        })
        .catch(({ response }) => {
          console.log(response.message);
        });
    }
  };

  useEffect(() => {
    if (data.selectedPreset && presets) {
      const filtered: Array<any> = presets.filter(
        (e: any) => e.presetID === data.selectedPreset
      );
      setDistance(filtered[0].distance);
    }
  }, [data]);
  useEffect(() => {
    getPresets();

    const getDraft = async () => {
      const draft = await SecureStore.getItemAsync("draft");
      if (draft) {
        setData({ ...JSON.parse(draft) });
      }
    };
    getDraft();
  }, []);

  const handleSubmit = async () => {
    setErrors("");
    if (!data.selectedPreset) {
      return setErrors("Please select a preset");
    }

    let distance;

    if (data.selectedPreset && presets) {
      const filtered: Array<any> = presets.filter(
        (e: any) => e.presetID === data.selectedPreset
      );
      distance = filtered[0].distance;
    }
    if (parseInt(distance) <= 0)
      return setErrors("Please enter a distance above 0!");

    if (!retrieveData) return;
    setLoading(true);
    axios
      .post(`https://petrolshare.freud-online.co.uk/distance/add`, {
        distance: distance,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(async () => {
        setLoading(false);
        await SecureStore.deleteItemAsync("draft");
        await SecureStore.setItemAsync("showToast", "distanceUpdated");
        navigation.navigate("Dashboard");
      })
      .catch(({ response }) => {
        console.log(response.message);
      });
  };
  const openPopup = (type?: string, id?: string) => {
    setPopupType(type || "new");
    setVisible(true);
    if (id) selectedToDelete.current = id;
  };

  const deletePreset = () => {
    axios
      .post("https://petrolshare.freud-online.co.uk/preset/delete", {
        presetID: selectedToDelete.current,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(() => {
        setVisible(false);
        Toast.show({
          type: "default",
          text1: "Preset successfully deleted!",
        });
        setTimeout(() => {
          getPresets();
        }, 300);
      })
      .catch(({ response }) => {
        console.log(response.message);
      });
  };

  const handleEdit = (id: number) => {
    if (!presets) return;
    const item: any = presets.filter((e: any) => e.presetID === id);
    if (!item) return;
    setPresetFormData(item[0]);
    openPopup("new");
  };

  const handlePresetSubmit = () => {
    let errors: any = {};
    Object.entries(presetFormData).map(([key, value]) => {
      if (key === "presetID") return;
      if (!value) errors[key] = "Please complete this field!";

      if (key === "distance" && !parseInt(value))
        errors[key] = "Please enter a valid numerical value!";
    });
    setPresetFormErrors(errors);

    if (!Object.keys(errors).length && retrieveData) {
      axios
        .post("https://petrolshare.freud-online.co.uk/preset/add", {
          presetName: presetFormData.presetName,
          distance: presetFormData.distance,
          authenticationKey: retrieveData().authenticationKey,
        })
        .then(() => {
          setVisible(false);
          Toast.show({
            type: "default",
            text1: "Preset successfully added!",
          });
          getPresets();
        })
        .catch(({ response }) => {
          console.log(response.message);
        });
    }
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
            screenName: "ManageDistance",
          },
          {
            name: "Add Preset",
          },
        ]}
      />
      <FlexFull>
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Select Preset:
            </Text>
            <Button
              size="small"
              styles={{ width: "auto", paddingVertical: 4, height: "auto" }}
              noText
              handleClick={() => {
                setPresetFormData({
                  presetID: "",
                  presetName: "",
                  distance: "",
                }),
                  openPopup("new");
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Svg
                  width="11"
                  height="10"
                  fill="none"
                  viewBox="0 0 11 10"
                  style={{ marginRight: 8 }}
                >
                  <Path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M6 5H1m5 5V5v5zm0-5V0v5zm0 0h5-5z"
                  ></Path>
                </Svg>
                <Text style={{ fontSize: 14 }}> Add New</Text>
              </View>
            </Button>
          </View>
          {presets === null && <ActivityIndicator size={"large"} />}
          {presets && Boolean(presets.length) && (
            <View>
              {presets.map((e: any) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setData({
                        ...data,
                        selectedPreset:
                          data.selectedPreset === e.presetID
                            ? null
                            : e.presetID,
                      })
                    }
                    key={e.presetName}
                  >
                    <View
                      style={{
                        backgroundColor:
                          data.selectedPreset === e.presetID
                            ? "#095362"
                            : "#001E24",
                        borderStyle: "solid",
                        borderWidth: 2,
                        borderColor:
                          data.selectedPreset === e.presetID
                            ? "#388D9E"
                            : "#1B5662",
                        borderRadius: 4,
                        marginBottom: 12,
                        padding: 6,
                        paddingLeft: 15,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {e.presetName}
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          noText
                          styles={{
                            borderColor: "transparent",
                            paddingVertical: 0,
                            width: 92,
                            marginRight: 5,
                            minHeight: 0,
                            paddingHorizontal: 0,
                            height: 34,
                            flexDirection: "row",
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                            backgroundColor: "#0B404A",
                          }}
                          handleClick={() => handleEdit(e.presetID)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              display: "flex",
                              justifyContent: "center",
                              alignContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Svg
                              style={{ marginRight: 8 }}
                              width="12"
                              height="12"
                              fill="none"
                              viewBox="0 0 12 12"
                            >
                              <Path
                                stroke="#fff"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.167 8.024l6.118-6.119a1.28 1.28 0 011.81 1.81l-6.12 6.119a1 1 0 01-.51.273L1.5 10.5l.393-1.965a1 1 0 01.274-.511v0z"
                              ></Path>
                              <Path stroke="#fff" d="M7.25 3.25l1.5 1.5"></Path>
                            </Svg>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                              Edit
                            </Text>
                          </View>
                        </Button>
                        <Button
                          styles={{
                            paddingVertical: 0,
                            paddingHorizontal: 0,
                            minHeight: 0,
                            width: 92,
                            height: 34,
                            flexDirection: "row",
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                          }}
                          style="ghost"
                          color="red"
                          handleClick={() => openPopup("delete", e.presetID)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              display: "flex",
                              justifyContent: "center",
                              alignContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Svg
                              width="12"
                              height="14"
                              fill="none"
                              style={{ marginRight: 7 }}
                              viewBox="0 0 12 14"
                            >
                              <Path
                                stroke="#FA4F4F"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M1 2.58l1.28 7.82a2.223 2.223 0 001.52 1.76l.183.058a6.666 6.666 0 004.034 0l.182-.058a2.222 2.222 0 001.522-1.759L11 2.581"
                              ></Path>
                              <Path
                                stroke="#FA4F4F"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 3.692c2.761 0 5-.498 5-1.111 0-.614-2.239-1.111-5-1.111s-5 .497-5 1.11c0 .614 2.239 1.112 5 1.112z"
                              ></Path>
                            </Svg>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FA4F4F",
                              }}
                            >
                              Delete
                            </Text>
                          </View>
                        </Button>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          )}
          {presets && Boolean(presets?.length === 0) && (
            <Text style={{ fontSize: 16, lineHeight: 24 }}>
              You have no saved presets! Create some by clicking the button
              above.
            </Text>
          )}
        </View>
        <SubmitButton
          loading={loading}
          handleClick={handleSubmit}
          errors={errors}
          distance={distance}
        />
      </FlexFull>

      <Popup
        visible={visible}
        handleClose={() => {
          setVisible(false);
        }}
      >
        {popupType !== "new" ? (
          <>
            <Text
              style={{ marginBottom: 20, fontSize: 18, fontWeight: "bold" }}
            >
              Are you sure you want to delete this preset?
            </Text>
            <Button
              handleClick={() => deletePreset()}
              styles={{ marginBottom: 15 }}
            >
              Yes
            </Button>
            <Button style="ghost" handleClick={() => setVisible(false)}>
              No
            </Button>
          </>
        ) : (
          <>
            <Input
              label="Preset Name"
              handleInput={(e) =>
                setPresetFormData({ ...presetFormData, presetName: e })
              }
              value={presetFormData.presetName}
              errorMessage={presetFormErrors.presetName}
              placeholder="Enter name"
              style={{ marginBottom: 20 }}
            />
            <Input
              label="Preset distance"
              value={presetFormData.distance.toString()}
              placeholder="Enter distance"
              handleInput={(e) =>
                setPresetFormData({ ...presetFormData, distance: e })
              }
              errorMessage={presetFormErrors.distance}
              style={{ marginBottom: 30 }}
            />
            <Button handleClick={handlePresetSubmit}>Save Preset</Button>
          </>
        )}
      </Popup>
    </Layout>
  );
};
