import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Text, Pressable, View } from "react-native";
import { getItem, sendCustomEvent } from "../hooks";
import { AuthContext } from "../hooks/context";
import { getAllCurrencies } from "../hooks/getCurrencies";
import Dropdown from "./Dropdown";
import RadioButton from "./RadioButton";
import { Button, Box } from "./Themed";

export default ({
  handleClose,
  firstSteps,
}: {
  handleClose: (e?: string) => void;
  firstSteps?: boolean;
}) => {
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

  const [dropdownData, setDropdownData] = useState<Array<any>>([]);
  const { retrieveData } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    generateDropdown();
  }, []);

  useEffect(() => {
    if (firstSteps)
      setData({
        distance: "",
        petrol: "",
        currency: "",
      });
    else setGroupData();
  }, [firstSteps]);

  const setGroupData = async () => {
    const groupData = await getItem("groupData");
    if (!groupData || firstSteps) return;
    setData(JSON.parse(groupData));
  };

  const generateDropdown = async () => {
    const data: Array<{ name: string; symbol: string }> =
      await getAllCurrencies();
    const dropdown: Array<any> = [];
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
    let errors: any = {};

    Object.entries(data).map(([key, value]) => {
      if (!value) errors[key] = "Please complete this field!";
    });

    setErrors({ ...errors });
    if (Object.keys(errors).length) return;
    setLoading(true);
    await axios
      .post(process.env.REACT_APP_API_ADDRESS + "/group/update", {
        authenticationKey: retrieveData().authenticationKey,
        distance: data.distance,
        petrol: data.petrol,
        currency: data.currency,
      })
      .then(() => {
        setLoading(false);
        handleClose();
      });
  };

  const handleTouch = () => {
    sendCustomEvent("bodyClicked");
  };

  return (
    <Pressable onPress={handleTouch}>
      <>
        {firstSteps && (
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
              Thank you for creating a group, please select your preferences
              below.
            </Text>
          </Box>
        )}
        <Text
          style={{
            fontSize: 18,
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
            fontSize: 18,
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
            fontSize: 18,
            marginBottom: 10,
            lineHeight: 27,
            fontWeight: "700",
            color: "white",
            marginTop: 30,
          }}
        >
          What currency are you using?
        </Text>
        <Dropdown
          value={data.currency}
          data={dropdownData}
          handleSelected={(e) =>
            setData({ ...data, currency: e.value || e.name })
          }
          errorMessage={errors.currency}
        />
        <Button loading={isLoading} handleClick={handleSubmit}>
          Save Settings
        </Button>
      </>
    </Pressable>
  );
};
