import Input from "@components/input";
import { sendPostRequest } from "hooks/sendFetchRequest";
import { useContext, useEffect, useState } from "react";

import SubmitButton from "./submitButton";
import { API_ADDRESS } from "../../constants";
import { deleteItem } from "../../hooks";
import { AuthContext } from "../../hooks/context";

export default ({ handleClose }: { handleClose: (alert?: string) => void }) => {
  const [data, setData] = useState({
    distance: "",
  });
  const [errors, setErrors] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);

  useEffect(() => {
    if (data.distance && !isNaN(parseFloat(data.distance))) {
      setDistance(data.distance);
    } else {
      setDistance("");
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

    if (parseFloat(distance) <= 0 || !/^[0-9.]*$/.test(distance))
      return setErrors("Please enter a distance above 0!");

    if (!retrieveData) return;
    setLoading(true);

    const res = await sendPostRequest(API_ADDRESS + `/distance/add`, {
      distance,
      authenticationKey: retrieveData?.authenticationKey,
    });
    if (res?.ok) {
      setLoading(false);
      handleClose("Distance successfully updated!");
      deleteItem("draft");
    }
  };

  return (
    <>
      <Input
        keyboardType="decimal-pad"
        placeholder="Enter total distance"
        label="Distance"
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
