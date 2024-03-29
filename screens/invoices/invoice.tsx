import { useContext, useEffect, useState } from "react";
import { Box } from "@components/Themed";
import { Text } from "@components/text";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Share,
  View,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import {
  Alert,
  convertToDate,
  convertToSentenceCase,
  currencyPosition,
  getGroupData,
  getItem,
} from "../../hooks";
import Toast from "react-native-toast-message";
import { convertCurrency } from "../../hooks/getCurrencies";
import config from "../../config";
import AssignDistance from "@components/assignDistance";
import Colors from "../../constants/Colors";
import InvoiceItem, { InvoicePropsType } from "./invoiceItem";
import { useNavigation } from "@react-navigation/native";
import { TouchableBase } from "@components/button";
import ShareIcon from "../../assets/icons/share";

type PropsType = {
  invoiceID: number | string;
  isPublic?: boolean;
};

const SummaryItem = ({
  title,
  value,
  width,
}: {
  title: string;
  value: string;
  width: number;
}) => (
  <View style={{ opacity: width === 0 ? 0 : 1 }}>
    <Text
      style={{
        color: "white",
        fontSize: 14,
        fontWeight: "300",
        lineHeight: 21,
        width,
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        color: "white",
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 24,
        width,
      }}
    >
      {value}
    </Text>
  </View>
);

export const calculateWidth = (
  containerWidth: number,
  gap: number,
  items: number
) => {
  return containerWidth / items - gap / items;
};

export default ({ invoiceID, isPublic }: PropsType) => {
  const [data, setData] = useState<any>({});
  const [itemWidth, setItemWidth] = useState(0);
  const { retrieveData } = useContext(AuthContext);
  useEffect(() => {
    getInvoice();
  }, []);
  const [manageDistanceOpen, setManageDistanceOpen] = useState(false);
  const navigate = useNavigation();

  const [groupData, setGroupData] = useState({
    distance: "",
    currency: "",
    petrol: "",
  });

  useEffect(() => {
    init();
  }, []);

  const handleUpdate = () => {
    handleClose();
    getInvoice();
    Toast.show({
      type: "default",
      text1: "Successfully updated distances!",
    });
  };

  const handleClose = () => {
    setManageDistanceOpen(false);
  };

  const init = async () => {
    if (isPublic) return;
    const getSymbol = getItem("currencySymbol");
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
    const url = isPublic
      ? config.REACT_APP_API_ADDRESS +
        `/invoices/public/get?uniqueURL=${invoiceID}`
      : config.REACT_APP_API_ADDRESS +
        `/invoices/get?authenticationKey=${retrieveData?.authenticationKey}&invoiceID=${invoiceID}`;

    axios
      .get(url)
      .then(async ({ data }) => {
        setData({ ...data, invoiceData: JSON.parse(data.invoiceData) });
        if (isPublic)
          setGroupData({
            ...groupData,
            distance: data?.distance,
            currency: await convertCurrency(data?.currency),
            petrol: data?.petrol,
          });
      })
      .catch(({ response }) => {
        console.log(response.message);
        if (isPublic) return;
        Alert("Invalid Payment", "This payment log does not exist!");
        navigate.navigate("Payments");
      });
  };

  if (Object.keys(data).length === 0)
    return (
      <>
        <ActivityIndicator size={"large"} color={Colors.tertiary} />
      </>
    );

  const setWidth = (e: LayoutChangeEvent) => {
    setItemWidth(calculateWidth(e.nativeEvent.layout.width, 0, 2));
  };

  const sendLink = async () => {
    if (!invoiceID) return;
    if (Platform.OS === "web")
      navigate.navigate("PublicInvoice", { uniqueURL: data.uniqueURL });
    else
      Share.share({
        message: `I have filled up with petrol! Please see the following link to see how much you owe! ${config.REACT_APP_ADDRESS}payments/public/${data.uniqueURL}`,
        title: "Share Petrol Invoice",
      });
  };

  const dataObj = Object.entries(
    data.invoiceData as { fullName: string }[]
  ).filter(
    ([_, value]) =>
      value.fullName !== retrieveData?.fullName &&
      value.fullName !== "Unaccounted Distance"
  );

  const userInvoice = Object.entries(
    data.invoiceData as { fullName: string }[]
  ).filter(([_, value]) => value.fullName === retrieveData?.fullName);

  const untrackedDistance = Object.entries(
    data.invoiceData as { fullName: string }[]
  ).filter(([_, value]) => value.fullName === "Unaccounted Distance");
  const dataLength = Object.keys(data.invoiceData).length || 1;

  const globalProps = {
    isPublic: isPublic,
    groupData: groupData,
    invoiceID: invoiceID || "",
    invoicedBy: data?.emailAddress,
    authenticationKey: retrieveData?.authenticationKey,
    emailAddress: retrieveData?.emailAddress,
    invoiceLength: dataLength,
    openManageDistance: () => setManageDistanceOpen(true),
  } satisfies Partial<InvoicePropsType>;

  return (
    <>
      <Box
        style={{ paddingHorizontal: 15, marginBottom: 25 }}
        onLayout={setWidth}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 10,
            justifyContent: "space-between",
          }}
        >
          <SummaryItem
            width={itemWidth}
            title="Invoiced By:"
            value={data.fullName}
          />
          <SummaryItem
            width={itemWidth}
            title="Invoice Date:"
            value={convertToDate(data.sessionEnd)}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: Boolean(data.pricePerLiter) ? 10 : 0,
            justifyContent: "space-between",
          }}
        >
          <SummaryItem
            width={itemWidth}
            title="Amount Paid:"
            value={currencyPosition(data.totalPrice, groupData.currency)}
          />
          <SummaryItem
            width={itemWidth}
            title="Total Distance:"
            value={`${data.totalDistance} ${groupData?.distance}`}
          />
        </View>
        {Boolean(data.pricePerLiter) ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SummaryItem
              width={itemWidth}
              title={`Price Per ${convertToSentenceCase(groupData.petrol)}`}
              value={currencyPosition(data.pricePerLiter, groupData.currency)}
            />
          </View>
        ) : (
          <></>
        )}
      </Box>
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ paddingBottom: 70, gap: 10 }}
      >
        {userInvoice.map(([_, value]: any) => (
          <InvoiceItem
            key={value.fullName}
            invoiceData={value}
            {...globalProps}
          />
        ))}
        {untrackedDistance.map(([_, value]: any) => (
          <InvoiceItem
            key={value.fullName}
            invoiceData={value}
            {...globalProps}
          />
        ))}
        {dataObj.map(([_, value]: any, count: number) => (
          <InvoiceItem key={count} invoiceData={value} {...globalProps} />
        ))}
      </ScrollView>
      {!isPublic && (
        <TouchableBase handleClick={sendLink}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: Colors.tertiary,
              borderRadius: 8,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: Colors.border,
              position: "absolute",
              bottom: 15,
              right: -10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ShareIcon width={"18"} height="16" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}>
              Share
            </Text>
          </View>
        </TouchableBase>
      )}
      {isPublic ? (
        <></>
      ) : (
        <AssignDistance
          active={manageDistanceOpen}
          handleClose={() => setManageDistanceOpen(false)}
          handleUpdate={handleUpdate}
          data={data.invoiceData}
          invoiceID={invoiceID}
        />
      )}
    </>
  );
};
