import { useContext, useEffect, useState } from "react";
import { Box, Text, Button } from "../../components/Themed";
import { ActivityIndicator, View } from "react-native";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { useNavigation } from "@react-navigation/native";
import { convertToDate } from "../../hooks";

type PropsType = {
  invoiceID: number;
};

export default ({ invoiceID }: PropsType) => {
  const [data, setData] = useState<any>({});
  const { retrieveData } = useContext(AuthContext);
  const { navigate } = useNavigation();

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `/invoices/get?authenticationKey=${
            retrieveData().authenticationKey
          }&invoiceID=${invoiceID}`
      )
      .then(async ({ data }) => {
        setData({ ...data, invoiceData: JSON.parse(data.invoiceData) });
      })
      .catch((err) => {
        navigate("Invoices");
      });
  }, []);

  if (Object.keys(data).length === 0)
    return (
      <>
        <ActivityIndicator size={"large"} />
      </>
    );

  return (
    <>
      <Box style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View
          style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Invoice Date:{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>{convertToDate(data.sessionEnd)}</Text>
        </View>
        <View
          style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Total Distance:{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>{data.totalDistance}km</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Amount Paid:{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>{data.totalPrice} NIS</Text>
        </View>
      </Box>
      {Object.entries(data.invoiceData).map(
        ([key, value]: any, count: number) => {
          return (
            <Box
              style={{
                paddingHorizontal: 15,
                paddingVertical: 15,
                backgroundColor: "#0B404A",
                borderColor: "#075F71",
                marginBottom:
                  Object.keys(data.invoiceData).length === count ? 0 : 10,
              }}
            >
              {value.paymentDue && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#FA4F4F",
                    marginBottom: 10,
                    fontWeight: "bold",
                  }}
                >
                  PAYMENT DUE
                </Text>
              )}
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    {key}
                  </Text>
                  <Text style={{ fontSize: 14 }}>{value.distance}km</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {value.paymentDue} NIS
                </Text>
              </View>
              <Button size="small" disabled>
                Mark as paid
              </Button>
            </Box>
          );
        }
      )}
    </>
  );
};
