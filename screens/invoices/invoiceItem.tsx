import { Box, Seperator } from "@components/Themed";
import Button, { TouchableBase } from "@components/button";
import { Text } from "@components/text";
import { sendPostRequest } from "hooks/sendFetchRequest";
import { useState } from "react";
import { View } from "react-native";

import Bell from "../../assets/icons/bell";
import Tick from "../../assets/icons/tick";
import { APP_ADDRESS } from "../../constants";
import Colors from "../../constants/Colors";
import { Alert, currencyPosition } from "../../hooks";

export type InvoicePropsType = {
  invoiceData: {
    fullName?: string;
    paymentDue: number;
    distance: number;
    liters?: number;
    emailAddress?: string;
  };
  invoiceID: number | string;
  emailAddress?: string;
  groupData: { currency: string; petrol: string; distance: string };
  openManageDistance: () => void | void;
  authenticationKey?: string;
  isPublic?: boolean;
  invoicedBy?: string;
  invoiceLength: number;
};

export default ({
  invoiceData,
  emailAddress,
  groupData,
  openManageDistance,
  authenticationKey,
  invoiceID,
  isPublic,
  invoicedBy,
  invoiceLength,
}: InvoicePropsType) => {
  const [alertSent, setAlertSent] = useState(false);

  const sendAlert = async () => {
    setAlertSent(true);
    const res = await sendPostRequest(APP_ADDRESS + `/invoices/alert`, {
      authenticationKey,
      invoiceID,
      fullName: invoiceData.fullName,
    });
    if (res?.ok) {
      setAlertSent(false);
      Alert(
        "Notification sent!",
        `A notification has been succesfully sent to ${invoiceData.fullName}!`,
      );
    } else {
      setAlertSent(false);
      Alert("Notification failed!", await res?.text());
    }
  };

  if (!invoiceData) return <></>;

  return (
    <>
      <Box
        style={{
          paddingHorizontal: 15,
          paddingVertical: 15,
          backgroundColor: Colors.primary,
          borderColor: Colors.border,
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
            {currencyPosition(invoiceData.paymentDue, groupData.currency)}
          </Text>
          {invoiceData.liters ? (
            <Text style={{ fontSize: 16 }}>
              {invoiceData?.liters} {groupData.petrol}
            </Text>
          ) : (
            <></>
          )}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {invoiceData.emailAddress === emailAddress && !isPublic
              ? "You"
              : invoiceData.fullName}{" "}
            (
            <Text style={{ fontSize: 17 }}>
              {invoiceData.distance} {groupData.distance}
            </Text>
            )
          </Text>
          {invoiceData.emailAddress === emailAddress ||
          invoiceData.emailAddress === invoicedBy ||
          isPublic ||
          invoiceData.fullName === "Unaccounted Distance" ? (
            <></>
          ) : (
            <TouchableBase handleClick={sendAlert}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: Colors.tertiary,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                {alertSent ? (
                  <Tick width="14" height="14" />
                ) : (
                  <Bell width="14" height="68" />
                )}
              </View>
            </TouchableBase>
          )}
        </View>
        {!isPublic && invoiceData.fullName === "Unaccounted Distance" ? (
          <Button
            size="medium"
            style={{
              marginTop: 10,
              justifyContent: "center",
            }}
            noText
            handleClick={openManageDistance}
            analyticsLabel="Assign Distance"
          >
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              Assign Distance
            </Text>
          </Button>
        ) : (
          <></>
        )}
      </Box>
      {invoiceData.emailAddress === emailAddress &&
      !isPublic &&
      invoiceLength > 1 ? (
        <Seperator style={{ marginVertical: 15 }} />
      ) : (
        <></>
      )}
    </>
  );
};
