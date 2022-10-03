import { ActivityIndicator, StyleSheet, View } from "react-native";
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
import Toast from "react-native-toast-message";
import Popup from "../../components/Popup";
import Input from "../../components/Input";
import { Alert, convertToDate } from "../../hooks";

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
        {convertToDate(data ? data["sessionStart"] : Date.now())} -&nbsp;
        {convertToDate(data ? data["sessionEnd"] || Date.now() : Date.now())}
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
            strokeLinecap="round"
            strokeLinejoin="round"
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
  const [buttonWidth, setButtonWidth] = useState<string | number>("49%");
  const handleWidth = ({ nativeEvent }: any) => {
    const { width } = nativeEvent.layout;
    setButtonWidth(width / 2 - 5);
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: 15,
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
  id,
  activeSession,
  handleComplete,
}: {
  fullName: string;
  id: number;
  distance: string;
  date: string;
  style: View["props"]["style"];
  activeSession: boolean;
  handleComplete: () => void;
}) => {
  const { retrieveData } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(distance);

  const handleDelete = () => {
    Alert("Are you sure you want to delete this log?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          axios
            .post(process.env.REACT_APP_API_ADDRESS + `/logs/delete`, {
              authenticationKey: retrieveData().authenticationKey,
              logID: id,
            })
            .then(async (e) => {
              Toast.show({
                text1: "Log deleted successfully!",
                type: "default",
              });
              handleComplete();
            })
            .catch(({ response }) => {
              console.log(response.message);
            });
        },
      },
      { text: "No", style: "cancel" },
    ]);
  };

  const handleEdit = () => {
    axios
      .post(process.env.REACT_APP_API_ADDRESS + `/logs/edit`, {
        authenticationKey: retrieveData().authenticationKey,
        logID: id,
        distance: formData,
      })
      .then(async (e) => {
        Toast.show({
          text1: "Log updated successfully!",
          type: "default",
        });
        setVisible(false);
        handleComplete();
      })
      .catch(({ response }) => {
        console.log(response.message);
      });
  };

  return (
    <View
      style={[
        { backgroundColor: "#0B404A", borderRadius: 4, padding: 15 },
        style,
      ]}
    >
      <Text style={{ fontSize: 14, fontWeight: "300", marginBottom: 5 }}>
        {convertToDate(date)}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {fullName}
          {fullName === retrieveData().fullName && <> (You)</>}
        </Text>
        <Text style={{ fontSize: 16 }}>{distance}km</Text>
      </View>

      {activeSession && (
        <Split>
          <Button
            disabled={fullName !== retrieveData().fullName}
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
            handleClick={() => setVisible(true)}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Edit</Text>
          </Button>
          <Button
            disabled={fullName !== retrieveData().fullName}
            color="red"
            styles={{
              paddingVertical: 0,
              backgroundColor: "transparent",
              borderColor: "#FA4F4F",
              paddingHorizontal: 0,
              width: "auto",
              minHeight: 0,
              justifyContent: "center",
              height: 32,
              alignItems: "center",
            }}
            handleClick={handleDelete}
            noText
          >
            <Text
              style={{ fontSize: 14, fontWeight: "bold", color: "#FA4F4F" }}
            >
              Remove
            </Text>
          </Button>
        </Split>
      )}
      <Popup visible={visible} handleClose={() => setVisible(false)}>
        <Input
          label="Distance"
          handleInput={(e) => setFormData(e)}
          value={formData.toString()}
          placeholder="Enter new distance"
          style={{ marginBottom: 20 }}
        />
        <Button handleClick={handleEdit}>
          <>Update Distance {formData && <>({formData}km)</>}</>
        </Button>
      </Popup>
    </View>
  );
};

export default () => {
  const { retrieveData } = useContext(AuthContext);
  const logData = useRef<any>(null);
  const [activeSession, setActiveSession] = useState("0");
  const [loaded, setLoaded] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [summary, setSummary] = useState({});
  const [pageData, setPageData] = useState({
    currentPage: 0,
    maxPages: 0,
  });

  useEffect(() => {
    getLogs();
    getSummary();
  }, [retrieveData]);

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
    for (let i = 0; i < Object.entries(data).length; i++) {
      const key: any = Object.entries(data)[i];
      if (key[1]["sessionStart"] > (currentData?.sessionStart || Date.now())) {
        setPageData({
          ...pageData,
          currentPage: pageData.currentPage + 1,
        });
        setCurrentData(key[1]);
        return;
      }
    }
  };

  const previousPage = () => {
    if (!logData.current) return;
    const data = logData.current;
    for (let i = 0; i < Object.entries(data).length; i++) {
      const key: any = Object.entries(data)[i];
      if (key[1]["sessionEnd"] > currentData?.sessionStart - 100) {
        setPageData({
          ...pageData,
          currentPage: pageData.currentPage - 1,
        });
        setCurrentData(key[1]);
        return;
      }
    }
  };

  const getLogs = async () => {
    if (!retrieveData || !retrieveData().authenticationKey) return;
    await axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `/logs/get?authenticationKey=${retrieveData().authenticationKey}`
      )
      .then(({ data }) => {
        logData.current = data;
        setLoaded(true);

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
      {pageData.currentPage >= 1 && (
        <View style={{ paddingBottom: 55 }}>
          <DateHead
            data={currentData}
            handlePrevious={previousPage}
            handleNext={nextPage}
            hasNext={pageData.currentPage != pageData.maxPages}
            hasPrevious={pageData.currentPage > 1 && pageData.maxPages > 1}
          />
          {Boolean(Object.keys(summary).length) && (
            <>
              <Summary summary={summary} />
              {currentData &&
                currentData["logs"].map((e: any, c: number) => {
                  return (
                    <LogItem
                      handleComplete={() => getLogs()}
                      activeSession={
                        currentData["sessionID"].toString() ===
                        activeSession.toString()
                      }
                      fullName={e.fullName}
                      id={e.logID}
                      key={e.logID}
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
          {currentData && !Boolean(currentData["logs"].length) && (
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              There are no logs available to display
            </Text>
          )}
        </View>
      )}
      {loaded && pageData.currentPage === 0 && (
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          There are no logs available to display
        </Text>
      )}

      {!loaded && <ActivityIndicator size={"large"} />}
    </Layout>
  );
};
