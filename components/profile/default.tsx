import { sendPostRequest } from "hooks/sendFetchRequest";
import React, { useContext } from "react";

import Bin from "../../assets/icons/bin";
import Cog from "../../assets/icons/cog";
import SignOut from "../../assets/icons/signOut";
import { API_ADDRESS } from "../../constants";
import { Alert, sendCustomEvent } from "../../hooks";
import { AuthContext } from "../../hooks/context";
import { LongButton } from "../Themed";
import { Text } from "../text";

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

  const deleteAccount = async () => {
    Alert(
      "Are you sure you want to delete\nyour account?",
      "You will recieve an email to\nconfirm this change!",
      [
        {
          text: "Yes",
          onPress: async () => {
            const res = await sendPostRequest(
              API_ADDRESS + `/user/deactivate`,
              {
                authenticationKey: retrieveData?.authenticationKey,
              },
            );
            if (res?.ok) {
              if (signOut) signOut();
              setTimeout(() => {
                sendCustomEvent(
                  "sendAlert",
                  "Your account has been\nsuccessfully deactivated!",
                );
              }, 500);
            }
          },
        },
        { text: "No", style: "cancel" },
      ],
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
        icon={<Bin width={18} height={18} color="white" fill="white" />}
        handleClick={deleteAccount}
        text="Delete my Account"
        last
        color="red"
      />
    </>
  );
};
