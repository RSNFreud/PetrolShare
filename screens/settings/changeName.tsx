import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState, useContext } from "react";
import Toast from "react-native-toast-message";
import Input from "../../components/Input";
import { Button } from "../../components/Themed";
import { setItem } from "../../hooks";
import { AuthContext } from "../../hooks/context";

export default ({ handleClose }: { handleClose: any }) => {
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const { navigate } = useNavigation();
  const { retrieveData } = useContext(AuthContext);

  const validateForm = () => {
    if (!name) return setErrors("Please enter a valid name");
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_ADDRESS + `/user/change-name`, {
        authenticationKey: retrieveData().authenticationKey,
        newName: name,
      })
      .then(async () => {
        setLoading(false);
        handleClose();
        await setItem("showToast", "nameUpdated");
        navigate("Dashboard");
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
      <Button handleClick={validateForm} loading={loading}>
        Change name
      </Button>
    </>
  );
};
