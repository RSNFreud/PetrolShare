import { AuthContext } from "../../hooks/context";
import { LongButton, Text } from "../Themed";
import React, { useContext } from "react";
import { Alert, sendCustomEvent } from "../../hooks";
import axios from "axios";
import config from "../../config";
import Cog from "../../assets/icons/cog";
import SignOut from "../../assets/icons/signOut";
import Bin from "../../assets/icons/bin";

export type PropsType = {
  handleChange: (screen: string) => void;
  handleClose: () => void;
  handleUpdate?: () => void;
};

export default ({ handleChange }: PropsType) => {
  const { retrieveData, signOut } = useContext(AuthContext);

  const logout = () => {
    Alert("Are you sure you want to sign out?", undefined, [
      {
        text: "Yes",
        onPress: async () => {
          if (signOut) signOut();
        },
      },
      { text: "No", style: "cancel" },
    ]);
  };

  const deleteAccount = () => {
    Alert(
      "Are you sure you want to delete\nyour account?",
      "You will recieve an email to\nconfirm this change!",
      [
        {
          text: "Yes",
          onPress: async () => {
            axios
              .post(config.REACT_APP_API_ADDRESS + `/user/deactivate`, {
                authenticationKey: retrieveData?.authenticationKey,
              })
              .then(async () => {
                if (signOut) signOut();
                setTimeout(() => {
                  sendCustomEvent(
                    "sendAlert",
                    "Your account has been\nsuccessfully deactivated!"
                  );
                }, 500);
              })
              .catch((err) => {});
          },
        },
        { text: "No", style: "cancel" },
      ]
    );
  };

  return (
    <>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Hello {retrieveData?.fullName}!
      </Text>
      <LongButton
        icon={<Cog width={16} height={16} />}
        handleClick={() => {
          handleChange("Settings");
        }}
        text="Settings"
      />
      <LongButton
        icon={<SignOut width={18} height={18} />}
        handleClick={logout}
        text="Sign Out"
      />
      <LongButton
        icon={<Bin width={18} height={18} color={"white"} fill={"white"} />}
        handleClick={deleteAccount}
        text="Delete my Account"
        last
        color="red"
      />
    </>
  );
};
