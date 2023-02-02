import { useContext, useEffect, useState } from "react";
import { Box, Text, Button } from "../../components/Themed";
import { ActivityIndicator, View } from "react-native";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { useNavigation } from "@react-navigation/native";
import {
  convertToDate,
  currencyPosition,
  getGroupData,
  getItem,
} from "../../hooks";
import Toast from "react-native-toast-message";
import { convertCurrency } from "../../hooks/getCurrencies";
import config from "../../config";
import AssignDistance from "../../components/assignDistance";

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
  const [manageDistanceOpen, setManageDistanceOpen] = useState(false)

  const [groupData, setGroupData] = useState({ distance: "", currency: "", petrol: "" });

  useEffect(() => {
    init();
  }, []);

  const handleUpdate = () => {
    handleClose()
    getInvoice();
    Toast.show({
      type: "default",
      text1: "Successfully updated distances!",
    });
  }

  const handleClose = () => {
    setManageDistanceOpen(false)

  }

  const init = async () => {
    const getSymbol = await getItem("currencySymbol");
    if (getSymbol)
      setGroupData({
        ...groupData,
        currency: getSymbol || "",
      });

    const data = await getGroupData();
    if (!data) return;
    setGroupData({ ...groupData, distance: data.distance });
    const currency = await convertCurrency(data.currency);
    data.currency = currency;
    setGroupData(data);
  };

  const getInvoice = () => {
    axios
      .get(
        config.REACT_APP_API_ADDRESS +
        `/invoices/get?authenticationKey=${retrieveData().authenticationKey
        }&invoiceID=${invoiceID}`
      )
      .then(async ({ data }) => {
        setData({ ...data, invoiceData: JSON.parse(data.invoiceData) });
      })
      .catch(({ response }) => {
        console.log(response.message);
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
            {currencyPosition(data.totalPrice, groupData.currency)}
          </Text>
        </View>
        {Boolean(data.pricePerLiter) ? <View
          style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Price Per Liter:{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {currencyPosition(data.pricePerLiter, groupData.currency)}
          </Text>
        </View> : <></>}
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
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {currencyPosition(value.paymentDue, groupData.currency)}
                </Text>
                {value.liters ?
                  <Text style={{ fontSize: 16 }}>
                    {value?.liters} {groupData.petrol}
                  </Text> : <></>}
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
              {value.fullName === "Unaccounted Distance" ? (
                <Button
                  loading={loading === key}
                  size="small"
                  styles={{
                    marginTop: 10,
                    borderWidth: 0,
                    justifyContent: "center",
                  }}
                  noText
                  handleClick={() => setManageDistanceOpen(true)}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                    Assign Distance
                  </Text>
                </Button>
              ) : (
                <></>
              )}
            </Box>
          );
        }
      )}
      <AssignDistance active={manageDistanceOpen} handleClose={() => setManageDistanceOpen(false)} handleUpdate={handleUpdate} data={data.invoiceData} invoiceID={invoiceID} />
    </>
  );
};
