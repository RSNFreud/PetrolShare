import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "../../components/Themed";
import Input from "../../components/Input";
import { Alert } from "../../hooks";
import { AuthContext } from "../../hooks/context";
import config from "../../config";

type PropsType = {
  firstSteps: boolean;
  onComplete: (groupID: string) => void;
  onBack: () => void;
};

export default ({ firstSteps, onComplete, onBack }: PropsType) => {
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
        "Are you sure you want to join a new group?",
        "This will delete all the current data you have saved.",
        [
          {
            text: "Yes",
            onPress: async () => {
              setLoading(true);
              axios
                .post(config.REACT_APP_API_ADDRESS + `/user/change-group`, {
                  authenticationKey: retrieveData().authenticationKey,
                  groupID: form.data,
                })
                .then(async () => {
                  setLoading(false);
                  setForm({
                    data: "",
                    errors: "",
                  });
                  onComplete(form.data);
                })
                .catch(() => {
                  setLoading(false);
                  setForm({
                    ...form,
                    errors: "There was no group found with that ID!",
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
          authenticationKey: retrieveData().authenticationKey,
          groupID: form.data,
        })
        .then(async (e) => {
          setLoading(false);
          onComplete(form.data);
        })
        .catch(() => {
          setLoading(false);
          setForm({
            ...form,
            errors: "There was no group found with that ID!",
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
      <Button loading={loading} handleClick={updateGroup}>
        Join Group
      </Button>
      <Button style="ghost" styles={{ marginTop: 20 }} handleClick={onBack}>
        Back
      </Button>
    </View>
  );
};
