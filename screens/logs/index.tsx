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
  hasNext,
  hasPrevious,
}: {
  data: any;
  handleNext: () => void;
  handlePrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}) => {
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      marginBottom: 30,
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
      <Button
        noText
        styles={styles.button}
        handleClick={handlePrevious}
        disabled={!hasPrevious}
      >
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
        {formatDate(data ? data["sessionStart"] : Date.now())} -&nbsp;
        {formatDate(data ? data["sessionEnd"] || Date.now() : Date.now())}
      </Text>
      <Button
        disabled={!hasNext}
        noText
        styles={styles.button}
        handleClick={handleNext}
      >
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

const Summary = ({ summary }: { summary: {} }) => {
  if (!Boolean(Object.keys(summary).length)) return <></>;
  return (
    <>
      <View
        style={{
          backgroundColor: "#1196B0",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Summary:</Text>
      </View>
      <View
        style={{
          backgroundColor: "rgba(7, 95, 113, 0.2);",
          paddingHorizontal: 20,
          paddingVertical: 15,
          marginBottom: 20,
        }}
      >
        {Object.entries(summary).map(([key, value], c) => (
          <View
            key={c}
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: c === Object.entries(summary).length - 1 ? 0 : 15,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginRight: 5 }}>
              {key}:
            </Text>
            <Text style={{ fontSize: 16 }}>
              {Math.round((value as any) * 10) / 10}km
            </Text>
          </View>
        ))}
      </View>
    </>
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

const LogItem = ({
  fullName,
  distance,
  date,
  style,
  activeSession,
}: {
  fullName: string;
  distance: string;
  date: string;
  style: View["props"]["style"];
  activeSession: boolean;
}) => {
  return (
    <View
      style={[
        { backgroundColor: "#0B404A", borderRadius: 4, padding: 15 },
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

      {activeSession && (
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
      )}
    </View>
  );
};

export default () => {
  const { retrieveData } = useContext(AuthContext);
  const logData = useRef([]);
  const [activeSession, setActiveSession] = useState("0");
  const [currentData, setCurrentData] = useState<any>(null);
  const [summary, setSummary] = useState({});
  const [pageData, setPageData] = useState({
    currentPage: 0,
    maxPages: 0,
  });

  useEffect(() => {
    getLogs();
    getSummary();
  }, []);

  useEffect(() => {
    getSummary();
  }, [currentData]);

  const getSummary = async () => {
    if (currentData && currentData["logs"]) {
      let sum: any = {};

      currentData["logs"].map((e: any) => {
        if (!(e.fullName in sum)) sum[e.fullName] = 0;
        sum[e.fullName] = sum[e.fullName] + e.distance;
      });
      setSummary(sum);
    }
  };

  const nextPage = () => {
    if (currentData === null) return;
    if (!logData.current) return;
    const data = logData.current;
    setCurrentData(data[pageData.currentPage + 1]);
    setPageData({
      ...pageData,
      currentPage: pageData.currentPage + 1,
    });
  };

  const previousPage = () => {
    if (!logData.current) return;
    const data = logData.current;
    Object.entries(data).map(([key, value]: any) => {
      if (value.sessionStart < (currentData?.sessionStart || Date.now())) {
        setPageData({
          ...pageData,
          currentPage: pageData.currentPage - 1,
        });
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

        setPageData({
          currentPage: Object.keys(data).length,
          maxPages: Object.keys(data).length,
        });
        Object.entries(data).map(([key, value]: any) => {
          if (value.sessionActive) {
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
      <View style={{ paddingBottom: 55 }}>
        <DateHead
          data={currentData}
          handlePrevious={previousPage}
          handleNext={nextPage}
          hasNext={pageData.currentPage != pageData.maxPages}
          hasPrevious={pageData.currentPage != 0 && pageData.maxPages > 1}
        />
        {Boolean(Object.keys(summary).length) && (
          <>
            <Summary summary={summary} />
            {currentData &&
              currentData["logs"].map((e: any, c: number) => {
                return (
                  <LogItem
                    activeSession={
                      currentData["sessionID"].toString() ===
                      activeSession.toString()
                    }
                    fullName={e.fullName}
                    key={c}
                    style={{
                      marginBottom:
                        currentData["logs"].length - 1 === c ? 0 : 15,
                    }}
                    distance={e.distance}
                    date={e.date}
                  />
                );
              })}
          </>
        )}
        {!currentData && (
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            There are no logs available to display
          </Text>
        )}
      </View>

      {currentData && currentData === {} && (
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          There are no logs available to display
        </Text>
      )}
    </Layout>
  );
};
