import { Box, Breadcrumbs } from "@components/Themed";
import Layout from "@components/layout";
import { Text } from "@components/text";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View, ScrollView } from "react-native";

import DateHead from "./dateHead";
import LogItem from "./logItem";
import Summary from "./summary";
import { API_ADDRESS } from "../../constants";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../hooks/context";

type LogsType = {
  sessionID: string;
  sessionActive: string;
  sessionStart: string;
  sessionEnd: string;
  logs: {
    date: string;
    distance: number;
    fullName: string;
    logID: number;
    pending?: boolean;
  }[];
};

export default () => {
  const { retrieveData } = useContext(AuthContext);
  const [data, setData] = useState<{ [key: string]: LogsType } | object>({});
  const [activeSession, setActiveSession] = useState(0);
  const [loaded, setLoaded] = useState(false);
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
  }, [pageData]);

  const getSummary = async () => {
    if (currentData) {
      const sum: { [key: string]: number } = {};

      currentData?.["logs"].map((e) => {
        if (!(e.fullName in sum)) sum[e.fullName] = 0;
        if (e.pending) return;
        sum[e.fullName] = sum[e.fullName] + e.distance;
      });
      setSummary(sum);
      setTimeout(() => {
        setLoaded(true);
      }, 300);
    }
  };

  const nextPage = () => {
    if (!data || !currentData?.sessionStart) return;
    setLoaded(false);
    const newPage = pageData.currentPage + 1;
    setPageData({
      ...pageData,
      currentPage: newPage,
    });
  };

  const previousPage = () => {
    if (!data || !currentData?.sessionStart) return;
    setLoaded(false);
    const page = pageData.currentPage - 1;
    setPageData({
      ...pageData,
      currentPage: page,
    });
  };

  const getLogs = async () => {
    if (!retrieveData || !retrieveData?.authenticationKey) return;
    const res = await fetch(
      API_ADDRESS +
        `/logs/get?authenticationKey=${retrieveData?.authenticationKey}`
    );
    if (res.ok) {
      const data = await res.json();
      setData(data);
      setLoaded(true);
      const length = Object.keys(data).length || 1;
      if (length === 0) return;
      setActiveSession(length);
      setPageData({
        currentPage: length > 1 ? length : 1,
        maxPages: length > 1 ? length : 1,
      });
    }
  };

  const currentData: LogsType = Object.values(data)[pageData.currentPage - 1];

  return (
    <Layout noScrollView noBottomPadding>
      <Breadcrumbs
        links={[
          {
            name: "Dashboard",
            screenName: "/",
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
              hasNext={pageData.currentPage !== pageData.maxPages}
              hasPrevious={pageData.currentPage > 1 && pageData.maxPages > 1}
            />
            {loaded && Boolean(Object.keys(summary)?.length) && (
              <>
                <Summary summary={summary} />
                <ScrollView
                  keyboardShouldPersistTaps="handled"
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
            {currentData && !currentData["logs"]?.length && (
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
        {!loaded && <ActivityIndicator size="large" color={Colors.tertiary} />}
      </View>
    </Layout>
  );
};
