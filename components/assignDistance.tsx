import { API_ADDRESS } from "@constants";
import { useState, useEffect, useContext } from "react";

import Dropdown, { item } from "./Dropdown";
import Popup from "./Popup";
import Button from "./button";
import Input from "./input";
import { AuthContext } from "../hooks/context";
import { sendPostRequest } from "hooks/sendFetchRequest";

type PropsType = {
  active: boolean;
  handleClose: () => void;
  handleUpdate: () => void;
  data: {
    [key: number]: { fullName: string; distance: number; userID: number };
  };
  invoiceID: number | string;
};

export default ({
  active,
  data,
  handleClose,
  invoiceID,
  handleUpdate,
}: PropsType) => {
  const [usernames, setUsernames] = useState<item[]>([]);
  let maxDistance: { fullName: string; distance: number } | number =
    Object.values(data).filter((e) => e.fullName === "Unaccounted Distance")[0];
  if (maxDistance) maxDistance = maxDistance.distance;
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    distance: "",
  });
  const [values, setValues] = useState({ name: "", distance: "" });
  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = async () => {
    const res = await fetch(
      API_ADDRESS +
        `/group/get-members?authenticationKey=` +
        retrieveData?.authenticationKey
    );

    if (res.ok) {
      const data = await res.json();
      setUsernames(
        data.map((e: { fullName: string; userID: string }) => ({
          name: e.fullName,
          value: e.userID,
        }))
      );
    } else setLoading(false);
  };

  const submit = async () => {
    setLoading(false);
    setErrors({ name: "", distance: "" });
    const errors: { [key: string]: string } = {};
    Object.entries(values).map(([key, value]) => {
      if (key === "distance") {
        const distance = parseFloat(value);
        if (isNaN(distance)) {
          errors[key] = "Please enter a value above 0 and below " + maxDistance;
        }
        if (distance > (maxDistance as number) || distance === 0) {
          errors[key] = "Please enter a value above 0 and below " + maxDistance;
        }
      }
      if (value) return;
      errors[key] = "Please enter a value!";
    });

    setErrors(errors);
    if (Object.values(errors).length != 0 || !values.distance || !values.name)
      return;
    setLoading(true);
    const res = await sendPostRequest(API_ADDRESS + `/invoices/assign`, {
      authenticationKey: retrieveData?.authenticationKey,
      userID: values.name,
      distance: values.distance,
      invoiceID,
    });

    if (res?.ok) {
      setLoading(false);
      handleUpdate();
    } else {
      setLoading(false);
    }
  };

  return (
    <Popup visible={active} handleClose={handleClose} title="Assign Distance">
      <Input
        handleInput={(e) => setValues({ ...values, distance: e })}
        label="Distance to apply"
        errorMessage={errors.distance}
        placeholder={`Enter amount (Max: ${maxDistance})`}
        keyboardType="numbers-and-punctuation"
        inputStyle={{ paddingVertical: 10 }}
        style={{ marginBottom: 20, marginTop: 20 }}
      />
      {usernames.length ? (
        <Dropdown
          label="User"
          placeholder="Choose a username"
          data={usernames}
          handleSelected={(e) => setValues({ ...values, name: e.value })}
          value={values.name}
          errorMessage={errors.name}
          hiddenValue
        />
      ) : (
        <></>
      )}
      <Button loading={loading} handleClick={submit} text="Assign Distance" />
    </Popup>
  );
};
