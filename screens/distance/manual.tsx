import Input from "../../components/Input";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import SubmitButton from "./submitButton";

export default ({ handleClose }: { handleClose: () => void }) => {
  const [data, setData] = useState({
    distance: "",
  });
  const [errors, setErrors] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const { navigate } = useNavigation() as any;

  useEffect(() => {
    if (data.distance && !isNaN(parseInt(data.distance))) {
      setDistance(data.distance);
    }
  }, [data]);

  const handleSubmit = async () => {
    setErrors("");
    if (!data.distance) {
      return setErrors("Please enter a distance!");
    }

    let distance: string = "";

    if (data.distance) {
      distance = data.distance;
    }

    if (parseInt(distance) <= 0 || isNaN(parseInt(data.distance)))
      return setErrors("Please enter a distance above 0!");

    if (!retrieveData) return;
    setLoading(true);
    axios
      .post(`https://petrolshare.freud-online.co.uk/distance/add`, {
        distance: distance,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(async () => {
        setLoading(false);
        handleClose();
        await SecureStore.deleteItemAsync("draft");
        await SecureStore.setItemAsync("showToast", "distanceUpdated");
        navigate("Dashboard");
      })
      .catch(({ response }) => {
        console.log(response.message);
      });
  };

  return (
    <>
      <Input
        placeholder="Enter total distance"
        label="Distance"
        keyboardType="numeric"
        value={data.distance}
        handleInput={(e) => setData({ ...data, distance: e })}
        style={{ marginBottom: 20 }}
      />
      <SubmitButton
        loading={loading}
        handleClick={handleSubmit}
        errors={errors}
        distance={distance}
      />
    </>
  );
};
