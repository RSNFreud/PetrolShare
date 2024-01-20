import Popup from "@components/Popup";
import Button from "@components/button";
import Input from "@components/input";
import SplitRow from "@components/splitRow";
import { Text } from "@components/text";
import { sendPostRequest } from "hooks/sendFetchRequest";
import { useContext, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

import Bin from "../../assets/icons/bin";
import Pencil from "../../assets/icons/pencil";
import { API_ADDRESS } from "../../constants";
import Colors from "../../constants/Colors";
import { Alert, convertToDate } from "../../hooks";
import { AuthContext } from "../../hooks/context";

type PropsType = {
  fullName: string;
  id: number;
  distance: number;
  date: string;
  style?: View["props"]["style"];
  activeSession: boolean;
  pending?: boolean;
  handleComplete: () => void;
};

export default ({
  fullName,
  distance,
  date,
  pending,
  style,
  id,
  activeSession,
  handleComplete,
}: PropsType) => {
  const { retrieveData } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<string>(distance.toString());
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = () => {
    Alert("Are you sure you want to delete this log?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          const res = await sendPostRequest(API_ADDRESS + `/logs/delete`, {
            authenticationKey: retrieveData?.authenticationKey,
            logID: id,
          });
          if (res?.ok) {
            Toast.show({
              text1: "Log deleted successfully!",
              type: "default",
            });
            handleComplete();
          }
        },
      },
      { text: "No", style: "cancel" },
    ]);
  };

  const handleEdit = async () => {
    setErrorMessage("");
    setLoading(true);
    if (parseFloat(formData) <= 0 || !/^[0-9.]*$/.test(formData.toString())) {
      setErrorMessage("Please enter a valid value!");
      return setLoading(false);
    }
    const res = await sendPostRequest(API_ADDRESS + `/logs/edit`, {
      authenticationKey: retrieveData?.authenticationKey,
      logID: id,
      distance: formData,
    });
    if (res?.ok) {
      Toast.show({
        text1: "Log updated successfully!",
        type: "default",
      });
      setVisible(false);
      setLoading(false);
      handleComplete();
    } else {
      setLoading(false);
    }
  };

  const handleInput = (e: string) => {
    setFormData(e);
  };

  return (
    <>
      <View
        style={{
          borderColor: Colors.border,
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 4,
        }}
      >
        <View
          style={[
            {
              backgroundColor: Colors.primary,
              padding: 15,
              opacity: pending ? 0.5 : 1,
            },
            style,
          ]}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "300" }}>
              {convertToDate(date)}
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: "bold", color: Colors.red }}
            >
              {pending ? "PENDING" : ""}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {fullName}
              {fullName === retrieveData?.fullName && <> (You)</>}
            </Text>
            <Text style={{ fontSize: 16 }}>{distance}km</Text>
          </View>
        </View>
        {!pending && activeSession && (
          <SplitRow
            gap={0}
            style={{
              marginTop: 0,
              backgroundColor: Colors.secondary,
              alignItems: "center",
            }}
            seperator={
              <View
                style={{
                  width: 1,
                  backgroundColor: Colors.border,
                  height: "60%",
                }}
              />
            }
            elements={[
              <Button
                disabled={fullName !== retrieveData?.fullName}
                handleClick={() => setVisible(true)}
                icon={<Pencil height={14} width={14} />}
                size="medium"
                text="Edit"
                style={{ backgroundColor: "transparent", borderWidth: 0 }}
              />,
              <Button
                disabled={fullName !== retrieveData?.fullName}
                color="red"
                icon={<Bin height={14} width={14} color={Colors.red} />}
                variant="ghost"
                size="medium"
                handleClick={handleDelete}
                text="Remove"
                style={{ backgroundColor: "transparent", borderWidth: 0 }}
              />,
            ]}
          />
        )}
      </View>
      <Popup
        visible={visible}
        handleClose={() => setVisible(false)}
        title="Edit Distance"
      >
        <Input
          label="Distance"
          handleInput={handleInput}
          keyboardType="decimal-pad"
          value={formData?.toString()}
          errorMessage={errorMessage}
          placeholder="Enter new distance"
          style={{ marginBottom: 20 }}
        />
        <Button
          handleClick={handleEdit}
          loading={loading}
          text={`Update Distance ${formData ? `(${formData} km)` : ""}`}
        />
      </Popup>
    </>
  );
};
