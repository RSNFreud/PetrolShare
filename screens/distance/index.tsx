import { TouchableWithoutFeedback, View } from "react-native";
import Input from "../../components/Input";
import {
  Breadcrumbs,
  Layout,
  Seperator,
  Text,
  Box,
  Button,
} from "../../components/Themed";
import Svg, { Path } from "react-native-svg";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../navigation";
import * as SecureStore from "expo-secure-store";
import Popup from "../../components/Popup";
import Toast from "react-native-toast-message";

export default ({ navigation }: any) => {
  const [data, setData] = useState({
    startValue: "",
    endValue: "",
    distance: "",
    selectedPreset: null,
  });
  const [errors, setErrors] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const [presets, setPresets] = useState([]);
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
  const getPresets = () => {
    if (retrieveData) {
      axios
        .get(
          `https://petrolshare.freud-online.co.uk/preset/get?authenticationKey=${
            retrieveData().authenticationKey
          }`
        )
        .then(({ data }) => {
          setPresets(data);
        })
        .catch(({ response }) => {
          console.log(response.message);
        });
    }
  };

  useEffect(() => {
    getPresets();
  }, []);

  const handleSubmit = () => {
    setErrors("");
    if (!data.distance && !data.startValue && !data.selectedPreset) {
      return setErrors("Please enter either a preset, distance or start value");
    }

    if (data.distance && data.startValue) {
      return setErrors("Please enter only one option!");
    }

    let distance;

    if (data.distance) {
      distance = data.distance;
    }

    if (data.startValue && data.endValue) {
      distance = parseInt(data.endValue) - parseInt(data.startValue);
    }
    if (data.selectedPreset) {
      const filtered: Array<any> = presets.filter(
        (e: any) => e.presetID === data.selectedPreset
      );
      distance = filtered[0].distance;
    }
    if (data.startValue && !data.endValue) {
      // store it for later as draft with unique id
      return;
    }
    if (parseInt(distance) < 0)
      return setErrors("Please enter a distance above 0!");

    if (!retrieveData) return;
    setLoading(true);
    axios
      .post(`https://petrolshare.freud-online.co.uk/data/add`, {
        distance: distance,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(async () => {
        setLoading(false);
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

  const PopupContent = () => {
    if (popupType !== "new")
      return (
        <>
          <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: "bold" }}>
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
      );
    else
      return (
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
      );
  };

  const handleEdit = (id: number) => {
    const item: any = presets.filter((e: any) => e.presetID === id);
    if (!item) return;
    setPresetFormData(item[0]);
    openPopup("new");
  };

  const handlePresetSubmit = () => {
    let errors: any = {};
    Object.entries(presetFormData).map(([key, value]) => {
      if (!value) errors[key] = "Please complete this field!";
    });
    setPresetFormErrors(errors);

    if (!errors.length && retrieveData) {
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
            name: "Add Distance",
          },
        ]}
      />
      <Input
        placeholder="Enter odemetor start value"
        label="Start Odometer"
        keyboardType="numeric"
        handleInput={(e) => setData({ ...data, startValue: e })}
        style={{ marginBottom: 20 }}
      />
      <Input
        placeholder="Enter odemetor end value"
        label="End Odometer"
        keyboardType="numeric"
        handleInput={(e) => setData({ ...data, endValue: e })}
        style={{ marginBottom: 30 }}
      />
      <View
        style={{
          position: "relative",
          height: 18,
          display: "flex",
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            zIndex: 1,
            position: "relative",
            fontSize: 16,
            paddingHorizontal: 10,
            backgroundColor: "#001E24",
          }}
        >
          OR
        </Text>
        <View
          style={{
            height: 1,
            top: 9,
            position: "absolute",
            width: "100%",
            backgroundColor: "#445C61",
          }}
        ></View>
      </View>
      <Input
        placeholder="Enter total distance"
        label="Distance"
        keyboardType="numeric"
        handleInput={(e) => setData({ ...data, distance: e })}
        style={{ marginBottom: 30 }}
      />
      <View
        style={{
          position: "relative",
          height: 18,
          display: "flex",
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            zIndex: 1,
            position: "relative",
            fontSize: 16,
            paddingHorizontal: 10,
            backgroundColor: "#001E24",
          }}
        >
          OR
        </Text>
        <View
          style={{
            height: 1,
            top: 9,
            position: "absolute",
            width: "100%",
            backgroundColor: "#445C61",
          }}
        ></View>
      </View>
      <Box style={{ paddingHorizontal: 14, paddingVertical: 14 }}>
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
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
          {presets.length ? (
            <View>
              {presets.map((e: any) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setData({ ...data, selectedPreset: e.presetID })
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
          ) : (
            <Text style={{ fontSize: 16, lineHeight: 24 }}>
              You have no saved presets! Create some by clicking the button
              above.
            </Text>
          )}
        </>
      </Box>
      <Seperator style={{ marginVertical: 30 }} />
      <Button
        loading={loading}
        styles={{ marginBottom: errors ? 0 : 55 }}
        handleClick={() => handleSubmit()}
      >
        Save
      </Button>
      {!!errors && (
        <View
          style={{
            marginTop: 15,
            marginBottom: 55,
            backgroundColor: "#EECFCF",
            borderRadius: 4,
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text style={{ color: "#7B1D1D", fontSize: 16, fontWeight: "400" }}>
            {errors}
          </Text>
        </View>
      )}
      <Popup
        visible={visible}
        handleClose={() => {
          setVisible(false);
        }}
      >
        <PopupContent />
      </Popup>
    </Layout>
  );
};
