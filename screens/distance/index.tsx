import { View } from "react-native";
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
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../navigation";
import Toast from "react-native-toast-message";

export default ({ navigation }: any) => {
  const [data, setData] = useState({
    startValue: "",
    endValue: "",
    distance: "",
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);

  const handleSubmit = () => {
    setErrors("");
    if (!data.distance && !data.startValue) {
      return setErrors("Please enter either a preset, distance or start value");
    }

    if (data.distance && data.startValue) {
      return setErrors("Please enter only one option!");
    }

    let distance;
    if (!data.distance && !data.endValue) {
      // store it for later as draft with unique id
      return;
    } else if (data.distance) {
      distance = data.distance;
    } else {
      distance = parseInt(data.endValue) - parseInt(data.startValue);
    }

    if (!retrieveData) return;
    setLoading(true);
    axios
      .post(`https://petrolshare.freud-online.co.uk/data/add`, {
        distance: distance,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(() => {
        setLoading(false);
        navigation.navigate("Dashboard", { showToast: "distanceUpdated" });
      })
      .catch(({ response }) => {
        console.log(response.message);
      });
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
          <Text style={{ fontSize: 16, lineHeight: 24 }}>
            You have no saved presets! Create some by clicking the button above.
          </Text>
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
    </Layout>
  );
};
