import { useContext, useEffect, useState } from "react";
import { Box, Text, Button } from "../../components/Themed";
import { ActivityIndicator, View } from "react-native";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { useNavigation } from "@react-navigation/native";
import { convertToDate, getGroupData } from "../../hooks";
import Toast from "react-native-toast-message";

type PropsType = {
  invoiceID: number;
};

export default ({ invoiceID }: PropsType) => {
  const [data, setData] = useState<any>({});
  const { retrieveData } = useContext(AuthContext);
  const { navigate } = useNavigation();
  useEffect(() => {
    getInvoice();
  }, []);
  const [loading, setLoading] = useState(0);

  const [groupData, setGroupData] = useState({ distance: "", currency: "" });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const data = await getGroupData();
    if (!data) return;
    console.log(data);

    setGroupData(data);
  };

  const markPaid = (userID: number) => {
    setLoading(userID);
    axios
      .post(process.env.REACT_APP_API_ADDRESS + `/invoices/pay`, {
        authenticationKey: retrieveData().authenticationKey,
        userID: userID,
        invoiceID: invoiceID,
      })
      .then(async ({ data }) => {
        Toast.show({
          type: "default",
          text1: "Successfully marked as paid!",
        });
        getInvoice();
        setLoading(0);
      })
      .catch((err) => {
        setLoading(0);
      });
  };

  const getInvoice = () => {
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
  };

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
            Invoiced By:{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>{data.fullName}</Text>
        </View>
        <View
          style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Total Distance:{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {data.totalDistance} {groupData?.distance || ""}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Amount Paid:{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {data.totalPrice} {groupData.currency}
          </Text>
        </View>
      </Box>
      {Object.entries(data.invoiceData).map(
        ([key, value]: any, count: number) => {
          return (
            <Box
              key={key}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 15,
                backgroundColor: "#0B404A",
                borderColor: "#075F71",
                marginBottom:
                  Object.keys(data.invoiceData).length === count ? 0 : 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                {value.paid ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#7CFF5B",
                      fontWeight: "bold",
                    }}
                  >
                    PAID
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#FA4F4F",
                      fontWeight: "bold",
                    }}
                  >
                    PAYMENT DUE
                  </Text>
                )}
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {value.paymentDue} NIS
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  {value.fullName} (
                  <Text style={{ fontSize: 17 }}>
                    {value.distance} {groupData.distance}
                  </Text>
                  )
                </Text>
              </View>
              {value.paid ? (
                <></>
              ) : (
                <Button
                  loading={loading === key}
                  size="small"
                  styles={{
                    marginTop: 20,
                    borderWidth: 0,
                    height: 40,
                    justifyContent: "center",
                  }}
                  noText
                  handleClick={() => markPaid(key)}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                    Mark as paid
                  </Text>
                </Button>
              )}
            </Box>
          );
        }
      )}
    </>
  );
};
