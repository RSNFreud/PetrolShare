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

export default () => {
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
        style={{ marginBottom: 20 }}
      />
      <Input
        placeholder="Enter odemetor end value"
        label="End Odometer"
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
      <Button styles={{ marginBottom: 55 }}>Save</Button>
    </Layout>
  );
};
