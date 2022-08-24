import { useEffect, useState } from "react";
import { Box, Text, Button } from "../../components/Themed";
import { View } from "react-native";

type PropsType = {
  invoiceID: number;
};

export default ({ invoiceID }: PropsType) => {
  const [data, setData] = useState<any>({
    invoiceData: {
      "Your Mum": {
        paymentDue: 132.92,
        paid: false,
        distance: 7,
      },
      "Rafi H": {
        paymentDue: 189.88,
        paid: false,
        distance: 10,
      },
    },
    totalDistance: "17",
    sessionEnd: "1661291811350",
    totalPrice: "322.8",
  });

  useEffect(() => {
    // call api
  }, []);

  const convertToDate = (date: string) => {
    let x: Date = new Date(parseInt(date));
    return `${x.getDate() < 10 ? "0" : ""}${x.getDate()}/${
      x.getMonth() < 10 ? "0" : ""
    }${x.getMonth()}/${x.getFullYear()}`;
  };

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
