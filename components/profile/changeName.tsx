import axios from "axios";
import React, { useState, useContext } from "react";
import Input from "../input";
import Button from "../button";
import { setItem } from "../../hooks";
import { AuthContext } from "../../hooks/context";
import config from "../../config";
import { PropsType } from "./default";

export default ({ handleClose, handleChange, handleUpdate }: PropsType) => {
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const { retrieveData } = useContext(AuthContext);

  const validateForm = () => {
    if (!name) return setErrors("Please enter a valid name");
    setLoading(true);
    axios
      .post(config.REACT_APP_API_ADDRESS + `/user/change-name`, {
        authenticationKey: retrieveData?.authenticationKey,
        newName: name,
      })
      .then(async () => {
        setLoading(false);
        handleUpdate && handleUpdate();
        handleClose();
        setItem("delayedAlert", "Your name has been\nsuccessfully updated!");
      })
      .catch((err) => {});
  };

  return (
    <>
      <Input
        label="Name"
        handleInput={(e) => setName(e)}
        value={name}
        errorMessage={errors}
        placeholder="Enter a new name"
        style={{ marginBottom: 20 }}
      />
      <Button
        handleClick={validateForm}
        loading={loading}
        style={{ marginBottom: 15 }}
        text="Change name"
      />
      <Button
        handleClick={() => handleChange("Settings")}
        variant={"ghost"}
        text="Back"
      />
    </>
  );
};
