import { useContext, useEffect, useState } from "react";
import { Pressable } from "react-native";

import Dropdown from "./Dropdown";
import RadioButton from "./RadioButton";
import { Box } from "./Themed";
import Button from "./button";
import { Text } from "./text";
import { API_ADDRESS, postValues } from "../constants";
import { Alert, sendCustomEvent } from "../hooks";
import { AuthContext } from "../hooks/context";
import generateGroupID from "../hooks/generateGroupID";
import { getAllCurrencies } from "../hooks/getCurrencies";

type PropsType = {
  handleComplete: (e?: string, message?: string) => void;
  handleCancel?: () => void;
  newGroup?: boolean;
  hideCancel?: boolean;
};

export default ({
  handleComplete,
  hideCancel,
  handleCancel,
  newGroup,
}: PropsType) => {
  const [data, setData] = useState({
    distance: "",
    petrol: "",
    currency: "",
  });
  const [errors, setErrors] = useState({
    distance: "",
    petrol: "",
    currency: "",
  });

  const [dropdownData, setDropdownData] = useState<any[]>([]);
  const { retrieveData } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    generateDropdown();
  }, []);

  useEffect(() => {
    setData({
      distance: retrieveData?.distance || "",
      petrol: retrieveData?.petrol || "",
      currency: retrieveData?.currency || "",
    });
  }, [retrieveData]);

  const generateDropdown = async () => {
    const data: {
      name: string;
      symbol: string;
    }[] = await getAllCurrencies();
    const dropdown: any[] = [];
    Object.entries(data).map(([key, e]) => {
      dropdown.push({
        name: e.name,
        symbol: e.symbol,
        value: key,
      });
    });
    setDropdownData(dropdown);
  };

  const handleSubmit = async () => {
    const errors: any = {};

    Object.entries(data).map(([key, value]) => {
      if (key === "premium") return;
      if (!value) errors[key] = "Please complete this field!";
    });

    setErrors({ ...errors });
    if (Object.keys(errors).length) return;
    if (newGroup) return createGroup();
    Alert(
      "Are you sure you want to reset your data?",
      "By clicking yes your session will be reset back to 0 for your group.",
      [
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            const res = await fetch(API_ADDRESS + `/distance/reset`, {
              ...postValues,
              body: JSON.stringify({
                authenticationKey: retrieveData?.authenticationKey,
              }),
            });
            if (res.ok) {
              updateGroup();
            }
          },
        },
        { text: "No", style: "cancel" },
      ],
    );
  };

  const createGroup = async () => {
    const groupID = generateGroupID();
    setLoading(true);
    const res = await fetch(API_ADDRESS + "/group/create", {
      ...postValues,
      body: JSON.stringify({
        authenticationKey: retrieveData?.authenticationKey,
        groupID,
      }),
    });

    if (res.ok) {
      const { groupID, message } = await res.json();
      updateGroup(groupID, message);
    }
  };

  const updateGroup = async (groupID?: string, message?: string) => {
    setLoading(true);

    const res = await fetch(API_ADDRESS + "/group/update", {
      ...postValues,
      body: JSON.stringify({
        authenticationKey: retrieveData?.authenticationKey,
        distance: data.distance,
        petrol: data.petrol,
        currency: data.currency,
      }),
    });

    if (res.ok) {
      setLoading(false);
      if (!newGroup)
        sendCustomEvent("sendAlert", "Group settings successfully updated!");
      handleComplete(groupID, message);
    }
  };

  const handleTouch = () => {
    sendCustomEvent("bodyClicked");
  };

  return (
    <Pressable onPress={handleTouch}>
      <>
        {newGroup && (
          <Text
            style={{
              color: "white",
              marginBottom: 20,
              lineHeight: 24,
            }}
          >
            To finish creating your group, please fill out the following
            options.
          </Text>
        )}
        {!newGroup && (
          <Box
            style={{
              marginBottom: 20,
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                color: "white",
              }}
            >
              By changing group settings you will reset your current tracked
              session.
            </Text>
          </Box>
        )}
        <Text
          style={{
            fontSize: 16,
            lineHeight: 27,
            fontWeight: "700",
            color: "white",
            marginBottom: 10,
          }}
        >
          Which format do you want distance to be displayed in?
        </Text>
        <RadioButton
          value={data.distance}
          handleChange={(e) => setData({ ...data, distance: e })}
          buttons={[
            { name: "Km", value: "km" },
            { name: "Miles", value: "miles" },
          ]}
          errorMessage={errors.distance}
        />

        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            lineHeight: 27,
            fontWeight: "700",
            color: "white",
            marginTop: 30,
          }}
        >
          Which format do you want petrol to be displayed in?
        </Text>
        <RadioButton
          value={data.petrol}
          handleChange={(e) => setData({ ...data, petrol: e })}
          buttons={[
            { name: "Gallons", value: "gallons" },
            { name: "Liters", value: "liters" },
          ]}
          errorMessage={errors.petrol}
        />
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            lineHeight: 27,
            fontWeight: "700",
            color: "white",
            marginTop: 30,
          }}
        >
          Which currency format are you using?
        </Text>
        <Dropdown
          placeholder="Choose a currency"
          value={data.currency}
          search
          data={dropdownData}
          handleSelected={(e) => setData({ ...data, currency: e.value })}
          errorMessage={errors.currency}
        />
        <Button
          loading={isLoading}
          handleClick={handleSubmit}
          text={newGroup ? "Create Group" : "Save Settings"}
        />

        {!hideCancel && newGroup && (
          <Button
            handleClick={handleCancel}
            variant="ghost"
            style={{ marginTop: 20 }}
            text="Return to Menu"
          />
        )}
      </>
    </Pressable>
  );
};
