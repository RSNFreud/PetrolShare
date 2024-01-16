import { useContext, useEffect, useState } from "react";
import { Text } from "@components/text";
import Button from "@components/button";
import { getGroupData } from "../../hooks";
import axios from "axios";
import config from "../../config";
import { AuthContext } from "../../hooks/context";

type PropTypes = {
  assignedBy: string;
  distance: string;
  id: string;
  handleComplete: () => void;
};

export default ({ assignedBy, distance, handleComplete, id }: PropTypes) => {
  const [groupData, setGroupData] = useState();
  const { retrieveData } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      let i = await getGroupData();
      if (!i) return;
      setGroupData(i.distance);
    })();
  }, []);

  const dismiss = () => {
    axios
      .post(config.REACT_APP_API_ADDRESS + `/distance/dismiss`, {
        authenticationKey: retrieveData?.authenticationKey,
        logID: id,
      })
      .then(() => {
        handleComplete();
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  };

  const approve = () => {
    axios
      .post(config.REACT_APP_API_ADDRESS + `/distance/approve`, {
        authenticationKey: retrieveData?.authenticationKey,
        logID: id,
      })
      .then(() => {
        handleComplete();
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  };

  return (
    <>
      <Text style={{ lineHeight: 24 }}>
        <Text style={{ fontWeight: "bold" }}>{assignedBy || "Someone"}</Text>{" "}
        has requested to add{" "}
        <Text style={{ fontWeight: "bold" }}>
          {distance}
          {groupData}
        </Text>{" "}
        to
      </Text>
      <Text style={{ lineHeight: 24 }}>your account.</Text>
      <Text style={{ lineHeight: 24, marginTop: 10 }}>
        Click the <Text style={{ fontWeight: "bold" }}>Approve</Text> button to
        add it to your account or the{" "}
        <Text style={{ fontWeight: "bold" }}>Dismiss</Text> button to ignore the
        request and add it to the Untracked Distance at the end.
      </Text>
      <Button
        style={{ marginBottom: 20, marginTop: 30 }}
        handleClick={approve}
        text="Approve"
      />
      <Button variant="ghost" handleClick={dismiss} text="Dismiss" />
    </>
  );
};
