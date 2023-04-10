import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Box, Breadcrumbs } from "../../components/Themed";
import Layout from "../../components/Layout";
import { Text } from "../../components/Themed";
import { Alert, convertToDate } from "../../hooks";
import { AuthContext } from "../../hooks/context";
import Invoice from "./invoice";
import config from "../../config";
import Colors from "../../constants/Colors";

export default ({ navigation }: any) => {
  const { params } = useRoute<any>();
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (retrieveData && retrieveData().authenticationKey) loaded.current = true;
    else return;
    getData();
    navigation.addListener("focus", async () => {
      getData();
    });
  }, [retrieveData]);

  const getData = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
        `/invoices/get?authenticationKey=${retrieveData().authenticationKey}`
      )
      .then(async ({ data }) => {
        setData(data);
        setDataLoaded(true);
      })
      .catch(({ response }) => {
        setDataLoaded(true);
        console.log(response);
      });
  };
  return (
    <Layout>
      {params && params["id"] ? (
        <Breadcrumbs
          links={[
            {
              name: "Dashboard",
            },
            {
              name: "Invoices",
            },
            {
              name: "Invoice #" + params["id"],
            },
          ]}
        />
      ) : (
        <Breadcrumbs
          links={[
            {
              name: "Dashboard",
            },
            {
              name: "Invoices",
            },
          ]}
        />
      )}

      {params && params["id"] ? (
        <Invoice invoiceID={params["id"]} />
      ) : (
        <>
          {dataLoaded ? (
            Boolean(data.length > 0) ? (
              <>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  Please select an invoice to view
                </Text>
                {data.map((e, c) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate("Invoices", { id: e["invoiceID"] })
                    }
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 15,
                      backgroundColor: Colors.primary,
                      borderColor: Colors.border,
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderRadius: 4,
                      marginBottom: data.length === c + 1 ? 0 : 8,
                    }}
                    key={c}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Invoice #{e["invoiceID"]}
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {convertToDate(e["sessionEnd"], true)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Box style={{ paddingHorizontal: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: 24,
                  }}
                >
                  There are no invoices to display.{"\n"} Generate one by
                  filling up with petrol
                </Text>
              </Box>
            )
          ) : (
            <ActivityIndicator size={"large"} />
          )}
        </>
      )}
    </Layout>
  );
};
