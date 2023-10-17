import axios from "axios";
import { useContext, useState } from "react";
import { View } from "react-native";
import Button from "./button";
import Input from "./input";
import { Alert } from "../hooks";
import { AuthContext } from "../hooks/context";
import config from "../config";

type PropsType = {
  firstSteps?: boolean;
  handleComplete: (data: { groupID?: string; message?: string }) => void;
  handleCancel: () => void;
};

export default ({ firstSteps, handleComplete, handleCancel }: PropsType) => {
  const { retrieveData } = useContext(AuthContext);

  const [form, setForm] = useState({
    data: "",
    errors: "",
  });
  const [loading, setLoading] = useState(false);

  const updateGroup = () => {
    if (!form.data)
      return setForm({ ...form, errors: "Please enter a group ID!" });
    else setForm({ ...form, errors: "" });
    setLoading(true);
    if (!firstSteps)
      Alert(
        "Are you sure you want to join a\nnew group?",
        "This will delete all the current data you have saved.",
        [
          {
            text: "Yes",
            onPress: async () => {
              setLoading(true);
              axios
                .post(config.REACT_APP_API_ADDRESS + `/user/change-group`, {
                  authenticationKey: retrieveData?.authenticationKey,
                  groupID: form.data,
                })
                .then(async ({ data }) => {
                  setLoading(false);
                  setForm({
                    data: "",
                    errors: "",
                  });
                  handleComplete(data);
                })
                .catch(({ response }) => {
                  setLoading(false);
                  setForm({
                    ...form,
                    errors: response.data,
                  });
                });
            },
          },
          { text: "No", style: "cancel", onPress: () => setLoading(false) },
        ]
      );
    else
      axios
        .post(config.REACT_APP_API_ADDRESS + `/user/change-group`, {
          authenticationKey: retrieveData?.authenticationKey,
          groupID: form.data,
        })
        .then(async ({ data }) => {
          setLoading(false);
          handleComplete(data);
        })
        .catch(({ response }) => {
          setLoading(false);
          setForm({
            ...form,
            errors: response.data,
          });
        });
  };

  return (
    <View>
      <Input
        placeholder="Enter new group ID"
        label="Group ID"
        value={form.data}
        handleInput={(e) => setForm({ ...form, data: e })}
        errorMessage={form.errors}
        style={{ marginBottom: 20 }}
      />
      <Button loading={loading} handleClick={updateGroup} text="Join Group" />
      <Button
        variant="ghost"
        style={{ marginTop: 20 }}
        handleClick={handleCancel}
        text="Back"
      />
    </View>
  );
};
