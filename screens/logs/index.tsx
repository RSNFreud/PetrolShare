import { StyleSheet, View } from "react-native";
import {
  Layout,
  Breadcrumbs,
  Button,
  Text,
  Box,
} from "../../components/Themed";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { useContext, useEffect, useRef, useState } from "react";

const formatDate = (date: string) => {
  let x: Date = new Date(parseInt(date));
  return `${x.getDate() < 10 ? "0" : ""}${x.getDate()}/${
    x.getMonth() < 10 ? "0" : ""
  }${x.getMonth()}/${x.getFullYear()}`;
};

const DateHead = ({
  data,
  handleNext,
  handlePrevious,
}: {
  data: any;
  handleNext: () => void;
  handlePrevious: () => void;
}) => {
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 0,
      paddingVertical: 0,
      minHeight: 0,
      width: 28,
      height: 28,
    },
    text: {
      fontSize: 16,
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.container}>
      <Button noText styles={styles.button} handleClick={handlePrevious}>
        <Svg width="12" height="10" fill="none" viewBox="0 0 12 10">
          <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.313.5L.5 5l4.813 4.5M.5 5h11"
          ></Path>
        </Svg>
      </Button>
      <Text style={styles.text}>
        {formatDate(data["sessionStart"])} -&nbsp;
        {formatDate(data["sessionEnd"] || Date.now())}
      </Text>
      <Button noText styles={styles.button} handleClick={handleNext}>
        <Svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <Path
            d="M6.6875 9.5L11.5 5L6.6875 0.5M11.5 5L0.5 5"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
      </Button>
    </View>
  );
};

const Summary = ({ summary }: { summary: Array<any> }) => {
  if (!Boolean(summary.length)) return <></>;
  return (
    <Box
      style={{ paddingHorizontal: 20, paddingVertical: 20, marginVertical: 20 }}
    >
      <>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
          Summary:
        </Text>
        {summary.map((e, c) => (
          <View
            key={c}
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: c === summary.length - 1 ? 0 : 15,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginRight: 5 }}>
              {e["fullName"]}:
            </Text>
            <Text style={{ fontSize: 16 }}>{e["currentMileage"]}km</Text>
          </View>
        ))}
      </>
    </Box>
  );
};

const Split = ({ children }: { children: JSX.Element[] }) => {
  const [buttonWidth, setButtonWidth] = useState(0);
  const handleWidth = ({ nativeEvent }: any) => {
    const { width } = nativeEvent.layout;
    setButtonWidth(width / 2 - 5);
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      onLayout={handleWidth}
    >
      {children.map((e, c) => (
        <View key={c} style={{ width: buttonWidth }}>
          {e}
        </View>
      ))}
    </View>
  );
};

const LogItem = ({ fullName, distance, date, style }: any) => (
  <View
    style={[
      { backgroundColor: "#0B404A", borderRadius: 4, padding: 10 },
      style,
    ]}
  >
    <Text style={{ fontSize: 14, fontWeight: "300", marginBottom: 5 }}>
      {formatDate(date)}
    </Text>
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{fullName}</Text>
      <Text style={{ fontSize: 16 }}>{distance}km</Text>
    </View>
    <Split>
      <Button
        styles={{
          paddingVertical: 0,
          paddingHorizontal: 0,
          width: "auto",
          backgroundColor: "#137B90",
          borderColor: "#1196B0",
          minHeight: 0,
          justifyContent: "center",
          height: 32,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Edit</Text>
      </Button>
      <Button
        color="red"
        styles={{
          paddingVertical: 0,
          paddingHorizontal: 0,
          width: "auto",
          minHeight: 0,
          justifyContent: "center",
          height: 32,
          alignItems: "center",
        }}
        noText
      >
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Remove</Text>
      </Button>
    </Split>
  </View>
);

export default () => {
  const { retrieveData } = useContext(AuthContext);
  const logData = useRef([]);
  const [activeSession, setActiveSession] = useState("0");
  const [currentData, setCurrentData] = useState<any>(null);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    getLogs();
    getSummary();
  }, []);

  const getSummary = async () => {
    await axios
      .get(
        `https://petrolshare.freud-online.co.uk/summary/get?authenticationKey=${
          retrieveData().authenticationKey
        }`
      )
      .then(({ data }) => {
        setSummary(data);
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  const nextPage = () => {
    if (currentData === null) return;
    if (!logData.current) return;
    const data = logData.current;
    Object.entries(data).map(([key, value]: any) => {
      if (value.sessionStart > currentData.sessionStart) {
        setActiveSession(key);
        setCurrentData(data[key]);
      }
    });
  };

  const previousPage = () => {
    if (!logData.current) return;
    const data = logData.current;
    Object.entries(data).map(([key, value]: any) => {
      if (value.sessionStart < currentData.sessionStart) {
        setActiveSession(key);
        setCurrentData(data[key]);
      }
    });
  };

  const getLogs = async () => {
    if (!retrieveData) return;
    await axios
      .get(
        `https://petrolshare.freud-online.co.uk/logs/get?authenticationKey=${
          retrieveData().authenticationKey
        }`
      )
      .then(({ data }) => {
        logData.current = data;

        Object.entries(data).map(([key, value]: any) => {
          if (value.sessionActive) {
            console.log(data[key]);

            setActiveSession(key);
            setCurrentData(data[key]);
          }
        });
      })
      .catch(({ response }) => {
        console.log(response);
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
            name: "Logs",
          },
        ]}
      />
      {currentData !== null && Boolean(Object.keys(summary).length) && (
        <View style={{ paddingBottom: 55 }}>
          <DateHead
            data={currentData}
            handlePrevious={previousPage}
            handleNext={nextPage}
          />
          <Summary summary={summary} />
          {currentData["logs"].map((e: any, c: number) => (
            <LogItem
              fullName={e.fullName}
              key={c}
              style={{
                marginBottom: currentData["logs"].length - 1 === c ? 0 : 15,
              }}
              distance={e.distance}
              date={e.date}
            />
          ))}
        </View>
      )}
    </Layout>
  );
};
