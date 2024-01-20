import { Box, Breadcrumbs } from "@components/Themed";
import { TouchableBase } from "@components/button";
import Layout from "@components/layout";
import { Text } from "@components/text";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import Invoice from "./invoice";
import { API_ADDRESS } from "../../constants";
import Colors from "../../constants/Colors";
import { convertToDate } from "../../hooks";
import { AuthContext } from "../../hooks/context";

export default () => {
  const params = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const navigation = useNavigation();
  const { navigate } = useRouter();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (retrieveData && retrieveData?.authenticationKey) loaded.current = true;
    else return;
    getData();
    navigation.addListener("focus", async () => {
      getData();
    });
  }, [retrieveData]);

  const getData = async () => {
    const res = await fetch(
      API_ADDRESS +
        `/invoices/get?authenticationKey=${retrieveData?.authenticationKey}`
    );
    if (res.ok) {
      const data = await res.json();
      setData(data);
      setDataLoaded(true);
    } else {
      setDataLoaded(true);
    }
  };
  return (
    <Layout noScrollView noBottomPadding>
      {params && params["id"] ? (
        <Breadcrumbs
          links={[
            {
              name: "Dashboard",
              screenName: "/",
            },
            {
              name: "Payments",
              screenName: "invoices",
            },
            {
              name: "Payments #" + params["id"],
            },
          ]}
        />
      ) : (
        <Breadcrumbs
          links={[
            {
              name: "Dashboard",
              screenName: "/",
            },
            {
              name: "Payments",
            },
          ]}
        />
      )}

      {params && params["id"] ? (
        <Invoice invoiceID={params["id"] as string} />
      ) : (
        <View style={{ flex: 1, display: "flex" }}>
          {dataLoaded ? (
            data.length > 0 ? (
              <>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  Please select an payment to view
                </Text>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 25 }}
                >
                  {data.map((e, c) => (
                    <TouchableBase
                      handleClick={() =>
                        navigate({
                          pathname: "invoices",
                          params: { id: e["invoiceID"] },
                        })
                      }
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 15,
                        backgroundColor: Colors.primary,
                        borderColor: Colors.border,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderRadius: 4,
                        marginBottom: data.length === c + 1 ? 0 : 8,
                      }}
                      key={c}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        Payment #{e["invoiceID"]}
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        {convertToDate(e["sessionEnd"], true)}
                      </Text>
                    </TouchableBase>
                  ))}
                </ScrollView>
              </>
            ) : (
              <Box style={{ paddingHorizontal: 25 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: 24,
                  }}
                >
                  There are no payments to display.{"\n"} Generate one by
                  filling up with petrol
                </Text>
              </Box>
            )
          ) : (
            <ActivityIndicator size="large" color={Colors.tertiary} />
          )}
        </View>
      )}
    </Layout>
  );
};
