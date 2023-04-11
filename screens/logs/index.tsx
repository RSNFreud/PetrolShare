import { ActivityIndicator, View, ScrollView } from "react-native";
import { Box, Breadcrumbs, Text } from "../../components/Themed";
import Layout from "../../components/Layout";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { useContext, useEffect, useRef, useState } from "react";
import config from "../../config";
import DateHead from "./dateHead";
import LogItem from "./logItem";
import Summary from "./summary";

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
        config.REACT_APP_API_ADDRESS +
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
    <Layout noScrollView noBottomPadding>
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
        <View style={{ flex: 1, display: 'flex', marginBottom: 25 }}>
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
              <ScrollView keyboardShouldPersistTaps={'handled'} >
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
              </ScrollView>
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
        <Box style={{ paddingHorizontal: 25 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            There are is no history available to display. Add distance for it to be shown
          </Text>
        </Box>
      )}

      {!loaded && <ActivityIndicator size={"large"} />}
    </Layout>
  );
};
