import Input from "../../components/Input";
import { View } from "react-native";
import {
  Button,
  Text,
  Box,
} from "../../components/Themed";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { convertToSentenceCase, getGroupData } from "../../hooks";
import config from "../../config";
import { useNavigation } from "@react-navigation/native";
import Popup from "../../components/Popup";
type PropsType = {
  handleClose: () => void
}

export default ({ handleClose }: PropsType) => {
  const { navigate } = useNavigation()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    litersFilled: "",
    totalPrice: "",
    odometer: "",
  });

  const [errors, setErrors] = useState({
    odometer: "",
    litersFilled: "",
    totalPrice: "",
    submit: "",
  });

  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const [fuelFormat, setFuelFormat] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setOpen(true)
    }, 10);

    init();
  }, []);

  const init = async () => {
    const data = await getGroupData();
    if (!data) return;

    setFuelFormat(data.petrol);
  };

  const handleSubmit = () => {
    let errors: any = {};

    Object.entries(data).map(([key, value]) => {
      if (!value) errors[key] = "Please complete this field!";
      if (value && !/^[0-9.]*$/.test(value))
        errors[key] = "Please enter a valid numerical value";
    });
    setErrors({ ...errors });
    if (Object.keys(errors).length) return;

    setLoading(true);
    axios
      .post(config.REACT_APP_API_ADDRESS + `/petrol/add`, {
        authenticationKey: retrieveData().authenticationKey,
        litersFilled: data.litersFilled,
        totalPrice: data.totalPrice,
        odometer: data.odometer,
      })
      .then(({ data }) => {
        setLoading(false);
        navigate("Payments", { id: (data as string) });
      })
      .catch(({ response }) => {
        console.log(response);
        setErrors({
          ...errors,
          submit:
            "You have no distance tracked in your session for us to generate a payment for.",
        });
        setLoading(false);
      });
  };

  return (
    <Popup visible={open} handleClose={handleClose}>
      <Box
        style={{
          paddingHorizontal: 15,
          paddingVertical: 15,
          marginBottom: 30,
        }}
      >
        <Text>
          By clicking the Add Petrol button below, a payment log will be
          generated from the distance tracked in your current session.
        </Text>
      </Box>
      <View>
        <Input
          handleInput={(e) => setData({ ...data, litersFilled: e })}
          value={data.litersFilled}
          errorMessage={errors.litersFilled}
          keyboardType={"decimal-pad"}
          label={`${convertToSentenceCase(fuelFormat)} Filled`}
          placeholder={`Enter amount of ${fuelFormat} filled`}
          style={{ marginBottom: 20 }}
        />
        <Input
          handleInput={(e) => setData({ ...data, totalPrice: e })}
          value={data.totalPrice}
          errorMessage={errors.totalPrice}
          keyboardType={"decimal-pad"}
          label="Total Cost"
          placeholder="Enter the total cost of refueling"
          style={{ marginBottom: 20 }}
        />
        <Input
          handleInput={(e) => setData({ ...data, odometer: e })}
          value={data.odometer}
          errorMessage={errors.odometer}
          keyboardType={"numeric"}
          label="Current Odometer"
          placeholder="Enter the current odometer value"
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Button loading={loading} handleClick={() => handleSubmit()}>
          Add Petrol
        </Button>
        {!!errors.submit && (
          <View
            style={{
              marginTop: 15,
              backgroundColor: "#EECFCF",
              borderRadius: 4,
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#7B1D1D",
              }}
            >
              {errors.submit}
            </Text>
          </View>
        )}
      </View>
    </Popup>
  );
};
