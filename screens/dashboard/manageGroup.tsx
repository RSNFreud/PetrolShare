import { useContext, useEffect, useState } from "react";
import Popup from "../../components/Popup";

import { View, TouchableWithoutFeedback } from "react-native";
import { Button, Text, Box } from "../../components/Themed";
import Input from "../../components/Input";
import generateGroupID from "../../hooks/generateGroupID";
import Svg, { Path } from "react-native-svg";
import * as Clipboard from "expo-clipboard";
import { AuthContext } from "../../hooks/context";
import axios from "axios";
import { Alert } from "../../hooks";

type PropsType = {
  onComplete: () => void;
  closeButton?: boolean;
  firstSteps?: boolean;
  initialVisible?: boolean;
  handleClose?: () => void;
};

type DefaultType = {
  firstSteps: boolean;
  createGroup: () => void;
  joinGroup: () => void;
};

const Default = ({ firstSteps, createGroup, joinGroup }: DefaultType) => {
  console.log(firstSteps);

  return (
    <View>
      {firstSteps && (
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
          Welcome to PetrolShare!
        </Text>
      )}
      <Text style={{ fontSize: 18, marginBottom: 30, lineHeight: 27 }}>
        Would you like to create a group or join an existing group?
      </Text>
      <Button styles={{ marginBottom: 20 }} handleClick={createGroup}>
        Create a new group
      </Button>
      <Button handleClick={joinGroup}>Join an existing group</Button>
    </View>
  );
};

export default ({
  onComplete,
  handleClose,
  closeButton = false,
  firstSteps = true,
  initialVisible = true,
}: PropsType) => {
  const [groupID, setGroupID] = useState(generateGroupID());
  const [animating, setAnimating] = useState(firstSteps ? false : true);
  const { retrieveData } = useContext(AuthContext);

  const DefaultProps: DefaultType = {
    firstSteps: firstSteps,
    createGroup: () => createGroup(),
    joinGroup: () => setPopupData(<JoinGroup firstSteps={firstSteps} />),
  };

  useEffect(() => {
    setVisible(initialVisible);
    console.log(firstSteps, DefaultProps);
  }, [initialVisible]);

  useEffect(() => {
    console.log(firstSteps, DefaultProps);
  }, [firstSteps]);

  const Complete = ({ groupID }: { groupID: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
      Clipboard.setStringAsync(groupID || "test");
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 500);
    };

    return (
      <View>
        <Box>
          <Text style={{ fontSize: 16, lineHeight: 25 }}>
            {firstSteps && (
              <>
                Thank you for registering for PetrolShare{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {retrieveData && retrieveData().fullName}
                </Text>
                .{"\n"}
                {"\n"}
              </>
            )}
            Your Group ID number is:
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 32, marginVertical: 21 }}
            >
              {groupID}
            </Text>
            <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
              {copied ? (
                <Svg width="26" height="26" fill="none" viewBox="0 0 26 26">
                  <Path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.469 14.219l5.687 5.687L21.531 7.72"
                  ></Path>
                </Svg>
              ) : (
                <Svg width="26" height="26" fill="none" viewBox="0 0 26 26">
                  <Path
                    fill="#fff"
                    d="M21.306 5.056H7.583A1.083 1.083 0 006.5 6.139v17.333a1.084 1.084 0 001.083 1.084h13.723a1.084 1.084 0 001.083-1.084V6.14a1.083 1.083 0 00-1.083-1.083zm-.362 18.055h-13V6.5h13v16.611z"
                  ></Path>
                  <Path
                    fill="#fff"
                    d="M18.778 2.528a1.083 1.083 0 00-1.083-1.084H3.972A1.083 1.083 0 002.89 2.528V19.86a1.083 1.083 0 001.083 1.083h.361V2.89h14.445v-.361z"
                  ></Path>
                </Svg>
              )}
            </TouchableWithoutFeedback>
          </View>
          <Text style={{ fontSize: 16, lineHeight: 25 }}>
            Share this with other members in your group to add them to your
            account. You can access this ID number at any time from your
            dashboard.
          </Text>
        </Box>
        <Button styles={{ marginTop: 20 }} handleClick={close}>
          Close
        </Button>
      </View>
    );
  };

  const JoinGroup = ({ firstSteps }: { firstSteps: boolean }) => {
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
      setGroupID(form.data);
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
                  .post(
                    process.env.REACT_APP_API_ADDRESS + `/user/change-group`,
                    {
                      authenticationKey: retrieveData().authenticationKey,
                      groupID: form.data,
                    }
                  )
                  .then(async (e) => {
                    setLoading(false);
                    setVisible(false);

                    setForm({
                      data: "",
                      errors: "",
                    });
                    setPopupData(<Complete groupID={form.data} />);
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
          .post(process.env.REACT_APP_API_ADDRESS + `/user/change-group`, {
            authenticationKey: retrieveData().authenticationKey,
            groupID: form.data,
          })
          .then(async (e) => {
            setLoading(false);
            setPopupData(<Complete groupID={form.data} />);
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
        <Button
          style="ghost"
          styles={{ marginTop: 20 }}
          handleClick={() => setPopupData(<Default {...DefaultProps} />)}
        >
          Back
        </Button>
      </View>
    );
  };

  const [visible, setVisible] = useState(initialVisible);
  const [popupData, setPopupData] = useState(<Default {...DefaultProps} />);

  const close = () => {
    setAnimating(true);
    setVisible(false);
    setPopupData(<Default {...DefaultProps} firstSteps={false} />);
    onComplete();
  };

  const createGroup = () => {
    if (!retrieveData) return;
    setPopupData(<Complete groupID={groupID} />);
    axios.post(process.env.REACT_APP_API_ADDRESS + "/user/create-group", {
      authenticationKey: retrieveData().authenticationKey,
      groupID: groupID,
    });
  };
  return (
    <Popup
      showClose={closeButton}
      animate={animating}
      visible={visible}
      handleClose={() => (firstSteps ? null : handleClose && handleClose())}
      children={popupData}
    />
  );
};
