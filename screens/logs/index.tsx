import { ActivityIndicator, View, ScrollView } from "react-native";
import { Box, Breadcrumbs } from "@components/Themed";
import { Text } from "@components/text";
import Layout from "@components/layout";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { useContext, useEffect, useState } from "react";
import config from "../../config";
import DateHead from "./dateHead";
import LogItem from "./logItem";
import Summary from "./summary";
import Colors from "../../constants/Colors";

type LogsType = {
  sessionID: string;
  sessionActive: string;
  sessionStart: string;
  sessionEnd: string;
  logs: { date: string; distance: number; fullName: string; logID: number }[];
};

export default () => {
  const { retrieveData } = useContext(AuthContext);
  const [data, setData] = useState<{ [key: string]: LogsType } | {}>({});
  const [activeSession, setActiveSession] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [currentData, setCurrentData] = useState<LogsType | null>(null);
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
      let sum: { [key: string]: number } = {};

      currentData["logs"].map((e) => {
        if (!(e.fullName in sum)) sum[e.fullName] = 0;
        sum[e.fullName] = sum[e.fullName] + e.distance;
      });
      setSummary(sum);
      setTimeout(() => {
        setLoaded(true);
      }, 300);
    }
  };

  const sortedData = (data: { [key: string]: LogsType }) =>
    Object.entries(data).sort(([, a], [, b]) => {
      return parseInt(a.sessionStart) - parseInt(b.sessionStart);
    });

  const nextPage = () => {
    if (!data || !currentData?.sessionStart) return;
    setLoaded(false);
    const newPage = pageData.currentPage + 1;
    setPageData({
      ...pageData,
      currentPage: newPage,
    });
    const x = sortedData(data);
    const y = x[pageData.currentPage + 1];
    if (y[1]) setCurrentData(y[1]);
  };

  const previousPage = () => {
    if (!data || !currentData?.sessionStart) return;
    setLoaded(false);
    const page = pageData.currentPage - 1;
    setPageData({
      ...pageData,
      currentPage: page,
    });
    const x = sortedData(data);
    const y = x[page];

    if (y[1]) setCurrentData(y[1]);
  };

  const getLogs = async () => {
    if (!retrieveData || !retrieveData?.authenticationKey) return;
    await axios
      .get(
        config.REACT_APP_API_ADDRESS +
          `/logs/get?authenticationKey=${retrieveData?.authenticationKey}`
      )
      .then(({ data }) => {
        setData(data);
        setLoaded(true);
        const length = Object.keys(data).length;
        if (length === 0) return;

        setPageData({
          currentPage: length - 1,
          maxPages: length - 1,
        });

        const x = sortedData(data)[length - 1][1];
        setActiveSession(length - 1);
        if (x) setCurrentData(x);
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
            screenName: "",
          },
          {
            name: "Logs",
          },
        ]}
      />
      <View style={{ flex: 1, display: "flex" }}>
        {pageData.currentPage >= 1 && (
          <>
            <DateHead
              data={currentData}
              handlePrevious={previousPage}
              handleNext={nextPage}
              hasNext={pageData.currentPage != pageData.maxPages}
              hasPrevious={pageData.currentPage > 1 && pageData.maxPages > 1}
            />
            {loaded && Boolean(Object.keys(summary).length) && (
              <>
                <Summary summary={summary} />
                <ScrollView
                  keyboardShouldPersistTaps={"handled"}
                  contentContainerStyle={{ paddingBottom: 25, gap: 15 }}
                >
                  {currentData &&
                    currentData["logs"]?.map((e, count) => {
                      return (
                        <LogItem
                          handleComplete={() => getLogs()}
                          activeSession={pageData.currentPage === activeSession}
                          id={e.logID}
                          key={`${e.logID}-${count}`}
                          {...e}
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
          </>
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
              There are is no history available to display. Add distance for it
              to be shown
            </Text>
          </Box>
        )}
        {!loaded && (
          <ActivityIndicator size={"large"} color={Colors.tertiary} />
        )}
      </View>
    </Layout>
  );
};
