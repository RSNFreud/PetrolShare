import { API_ADDRESS, postHeaders, postValues } from "@constants";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import Purchases from "react-native-purchases";

import Popup from "./Popup";
import Button from "./button";
import { Text } from "./text";
import Colors from "../constants/Colors";
import { Alert, sendCustomEvent } from "../hooks";
import { AuthContext } from "../hooks/context";

export default () => {
  const [premium, setPremium] = useState<null | boolean>(null);
  const [showPremiumInfo, setShowPremiumInfo] = useState(false);
  const { retrieveData, isLoading, setPremiumStatus, updateData } =
    useContext(AuthContext);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (Platform.OS === "web") return;
    if (retrieveData?.groupID)
      Purchases.logIn(retrieveData?.groupID).then(({ customerInfo }) => {
        if (
          typeof customerInfo.entitlements.active["premium"] !== "undefined"
        ) {
          setPremium(true);
        } else if (
          typeof customerInfo.entitlements.active["premium"] === "undefined" &&
          premium
        ) {
          setPremium(false);
          if (setPremiumStatus && typeof premium === "boolean")
            setPremiumStatus(false);
          unsubscribe();
        }
      });
  }, [premium]);

  useEffect(() => {
    if (setPremiumStatus && typeof premium === "boolean")
      setPremiumStatus(premium);
    if (!premium) expand();
    else minimise();
    if (!retrieveData?.premium && premium) {
      subscribe();
    }
  }, [premium]);

  const subscribe = async () => {
    try {
      const res = await fetch(API_ADDRESS + "/group/subscribe", {
        ...postHeaders,
        body: JSON.stringify({
          authenticationKey: retrieveData?.authenticationKey,
        }),
      });

      if (res.ok) {
        setTimeout(() => {
          Alert(
            "Premium Applied",
            "Your group has succesfully activated premium membership! Thank you for joining PetrolShare",
          );
        }, 400);
      }
    } catch {}
  };

  const unsubscribe = async () => {
    try {
      await fetch(API_ADDRESS + "/group/unsubscribe", {
        ...postHeaders,
        body: JSON.stringify({
          authenticationKey: retrieveData?.authenticationKey,
        }),
      });
    } catch {}
  };

  useEffect(() => {
    if (Platform.OS === "web") return;
    Purchases.addCustomerInfoUpdateListener((info) => {
      if (info.entitlements.active["premium"]?.isActive) setPremium(true);
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (premium !== null) sendCustomEvent("closeSplash");
    if (retrieveData?.premium) setPremium(true);
    else setPremium(false);
  }, [isLoading]);

  const openPayment = async () => {
    if (Platform.OS === "web") return;
    const product = await Purchases.getProducts(
      ["premium_subscription"],
      Purchases.PRODUCT_CATEGORY.NON_SUBSCRIPTION,
    );
    Purchases.purchaseStoreProduct(product[0], null)
      .then(() => {
        setShowPremiumInfo(false);
        fetch(API_ADDRESS + "/group/subscribe", {
          ...postValues,
          body: JSON.stringify({
            authenticationKey: retrieveData?.authenticationKey,
          }),
        })
          .then(async () => {
            updateData && updateData();
          })
          .catch(() => {});
        setPremium(true);
      })
      .catch((err) => {
        if (err.message === "The payment is pending.") {
          setShowPremiumInfo(false);
          setTimeout(() => {
            Alert(
              "Your payment is being processed",
              "Thank you for choosing to upgrade! Your payment is currently being processed and will be applied automatically when complete!",
            );
          }, 700);
        }
      });
  };

  const expand = () => {
    Animated.timing(heightAnim, {
      toValue: 68,
      delay: 400,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const minimise = () => {
    Animated.timing(heightAnim, {
      toValue: 0,
      delay: 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  if (width > 768) return <></>;

  return (
    <>
      <Animated.View
        style={{
          alignItems: "center",
          backgroundColor: Colors.tertiary,
          maxHeight: heightAnim,
        }}
      >
        <TouchableWithoutFeedback onPress={() => setShowPremiumInfo(true)}>
          <Text
            style={{
              maxWidth: 300,
              textAlign: "center",
              fontSize: 14,
              lineHeight: 24,
              padding: 10,
            }}
          >
            You are currently using the trial version of PetrolShare!
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              {" "}
              Click here to learn more...
            </Text>
          </Text>
        </TouchableWithoutFeedback>
      </Animated.View>

      <Popup
        visible={showPremiumInfo}
        handleClose={() => setShowPremiumInfo(false)}
        title="PetrolShare Premium"
      >
        <Text style={{ lineHeight: 24, marginBottom: 30 }}>
          You are currently using the free version of the PetrolShare app
          allowing you to have a maximum amount of 2 users in your group.
          {"\n\n"}
          By upgrading to our premium version, you gain access to have an
          unlimited amount of users in your group, plus other cool features to
          come!
        </Text>
        <Button
          style={{ marginBottom: 20 }}
          handleClick={openPayment}
          text="Purchase Premium"
        />
        <Button
          variant="ghost"
          handleClick={() => setShowPremiumInfo(false)}
          text="Dismiss"
        />
      </Popup>
    </>
  );
};
