import {
  Breadcrumbs,
  Button,
  Layout,
  Seperator,
} from "../../components/Themed";
import SplitRow from "../dashboard/splitRow";
import Svg, { Path } from "react-native-svg";
import { AuthContext } from "../../hooks/context";
import { useContext, useState } from "react";
import Popup from "../../components/Popup";
import Input from "../../components/Input";
import Toast from "react-native-toast-message";

const ChangeEmail = ({ handleClose }: { handleClose: any }) => {
  const [emailAddress, setEmailAddress] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ emailAddress: "", validation: "" });

  const validateForm = () => {
    if (!emailAddress || !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailAddress))
      return setErrors({
        emailAddress: "Please enter a valid email address",
        validation: "",
      });
    // Send email with link to confirm email change
    handleClose();
    Toast.show({
      type: "default",
      text1:
        "A confirmation email has been sent to your inbox to change your address",
    });
  };

  return (
    <>
      <Input
        label="Email address"
        handleInput={(e) => setEmailAddress(e)}
        value={emailAddress}
        errorMessage={errors.emailAddress}
        placeholder="Enter a new email address"
        style={{ marginBottom: 20 }}
      />
      <Button handleClick={validateForm} loading={loading}>
        Change email
      </Button>
    </>
  );
};
const ChangePassword = ({ handleClose }: { handleClose: any }) => {
  const [data, setData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    validation: "",
  });

  const validateForm = () => {
    let errors: any = {};

    for (let i = 0; i < Object.keys(data).length; i++) {
      const key = Object.keys(data)[i];
      const value = data[key];
      if (!value) errors[key] = "Please complete this field!";

      if (value && key === "password" && value.length < 6) {
        errors[key] = "Please enter a password longer than 6 characters";
      }
      if (key === "confirmPassword" && value != data["password"]) {
        errors[key] = "The password you entered does not match";
      }
    }

    setErrors({ ...errors });
    if (
      Object.values(errors).filter((e) => (e as string).length).length === 0
    ) {
      // Send email with link to confirm email change
      handleClose();
      Toast.show({
        type: "default",
        text1:
          "A confirmation email has been sent to your inbox to change your address",
      });
    }
  };

  return (
    <>
      <Input
        label="Current Password"
        handleInput={(e) => setData({ ...data, currentPassword: e })}
        value={data.currentPassword}
        errorMessage={errors.currentPassword}
        placeholder="Enter your current password"
        password
        style={{ marginBottom: 20 }}
      />
      <Input
        label="New Password"
        handleInput={(e) => setData({ ...data, password: e })}
        value={data.password}
        errorMessage={errors.password}
        password
        placeholder="Enter your new password"
        style={{ marginBottom: 20 }}
      />
      <Input
        label="Confirm New Password"
        handleInput={(e) => setData({ ...data, confirmPassword: e })}
        value={data.confirmPassword}
        password
        errorMessage={errors.confirmPassword}
        placeholder="Confirm your new password"
      />
      <Seperator style={{ marginVertical: 30 }} />
      <Button handleClick={validateForm} loading={loading}>
        Change password
      </Button>
    </>
  );
};

export default () => {
  const { signOut } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [popupData, setPopupData] = useState(<></>);

  const handlePopup = (data: JSX.Element) => {
    setPopupData(data);
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
    setPopupData(<></>);
  };

  return (
    <Layout>
      <Breadcrumbs
        links={[
          {
            name: "Dashboard",
          },
          {
            name: "Settings",
          },
        ]}
      />
      <SplitRow
        buttons={[
          {
            text: "Change Email",
            icon: (
              <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M20.164 3.833H4.83A1.914 1.914 0 002.924 5.75l-.01 11.5c0 1.054.862 1.917 1.917 1.917h15.333a1.922 1.922 0 001.917-1.917V5.75a1.922 1.922 0 00-1.917-1.917zm0 3.834l-7.667 4.791-7.666-4.791V5.75l7.666 4.792 7.667-4.792v1.917z"
                ></Path>
              </Svg>
            ),
            handleClick: () =>
              handlePopup(<ChangeEmail handleClose={handleClose} />),
          },
          {
            text: "Change Password",
            icon: (
              <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M3.372 16.292h17.25a.96.96 0 01.959.958.961.961 0 01-.959.958H3.372a.961.961 0 01-.958-.958.96.96 0 01.958-.958zm-.479-4.246a.723.723 0 00.987-.268l.45-.786.46.795c.202.345.643.46.988.269a.72.72 0 00.268-.978l-.47-.805h.91a.724.724 0 00.72-.718.724.724 0 00-.72-.72h-.91l.45-.785a.72.72 0 00-.258-.987.732.732 0 00-.987.268l-.45.786-.45-.786a.732.732 0 00-.988-.268.72.72 0 00-.259.987l.45.786h-.91a.724.724 0 00-.718.719c0 .393.326.718.718.718h.91l-.46.796a.718.718 0 00.27.977zm7.667 0a.723.723 0 00.987-.268l.45-.786.46.795c.202.345.642.46.987.269a.72.72 0 00.269-.978l-.46-.795h.91a.724.724 0 00.719-.719.724.724 0 00-.719-.719h-.92l.45-.785a.728.728 0 00-.258-.988.715.715 0 00-.978.26l-.46.785-.45-.786a.711.711 0 00-.978-.259.72.72 0 00-.258.988l.45.785h-.92a.71.71 0 00-.719.71c0 .393.326.718.72.718h.91l-.46.796a.718.718 0 00.268.977zm11.979-2.491a.724.724 0 00-.719-.72h-.91l.45-.785a.729.729 0 00-.258-.987.714.714 0 00-.978.259l-.46.795-.45-.786a.71.71 0 00-.978-.259.72.72 0 00-.259.988l.45.785h-.91a.712.712 0 00-.728.71c0 .393.326.718.719.718h.91l-.46.796a.71.71 0 00.269.977.723.723 0 00.987-.268l.45-.786.46.795c.201.345.642.46.987.269a.72.72 0 00.268-.978l-.46-.795h.91a.737.737 0 00.71-.728z"
                ></Path>
              </Svg>
            ),
            handleClick: () =>
              handlePopup(<ChangePassword handleClose={handleClose} />),
          },
        ]}
      />
      <SplitRow
        style={{ marginVertical: 20 }}
        buttons={[
          {
            text: "Change Name",
            icon: (
              <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M7.685 6.23a4.318 4.318 0 004.312 4.312 4.318 4.318 0 004.313-4.313 4.318 4.318 0 00-4.313-4.312 4.318 4.318 0 00-4.312 4.312zm11.979 13.895h.958v-.958a6.717 6.717 0 00-6.708-6.709h-3.833c-3.7 0-6.709 3.01-6.709 6.709v.958h16.292z"
                ></Path>
              </Svg>
            ),
          },
          {
            text: "Manage Group",
            icon: (
              <Svg width="24" height="24" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M8.664 10.312h-.556A5.539 5.539 0 004 11.922l-.153.179v5.29h2.606v-3.003l.352-.396.16-.186a7.028 7.028 0 013.009-1.827 4.21 4.21 0 01-1.31-1.667zM21.02 11.902a5.54 5.54 0 00-4.108-1.61c-.233.001-.465.014-.696.039a4.21 4.21 0 01-1.278 1.565 6.97 6.97 0 013.194 1.917l.16.179.345.396v3.009h2.517V12.08l-.134-.178zM8.089 9.066h.198a4.12 4.12 0 011.987-4.019 2.614 2.614 0 10-2.185 4.044v-.025zM16.605 8.587c.008.147.008.294 0 .44.123.02.247.03.37.032h.122a2.613 2.613 0 10-2.383-3.948 4.171 4.171 0 011.891 3.476zM12.414 11.449a2.856 2.856 0 100-5.712 2.856 2.856 0 000 5.712z"
                ></Path>
                <Path
                  fill="#fff"
                  d="M12.568 12.97a6.192 6.192 0 00-4.543 1.724l-.16.18v4.043a1.003 1.003 0 001.023.984h7.34a1.004 1.004 0 001.023-.983v-4.032l-.154-.192a6.122 6.122 0 00-4.53-1.725z"
                ></Path>
              </Svg>
            ),
          },
        ]}
      />
      <SplitRow
        buttons={[
          {
            text: "Sign Out",
            icon: (
              <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M15.692 2.556H5.47a1.278 1.278 0 00-1.278 1.277v15.334a1.278 1.278 0 001.278 1.277h10.222a1.278 1.278 0 001.278-1.277v-3.834h-5.987a.639.639 0 110-1.277h5.987V3.833a1.278 1.278 0 00-1.278-1.277zM18.988 11.04a.638.638 0 00-.9.9l2.159 2.116H16.97v1.277h3.277l-2.16 2.21a.639.639 0 10.901.902l3.732-3.706-3.732-3.699z"
                ></Path>
              </Svg>
            ),
            handleClick: () => (signOut ? signOut() : null),
          },
          {
            text: "Delete Account",
            icon: (
              <Svg width="24" height="23" fill="none" viewBox="0 0 24 23">
                <Path
                  fill="#fff"
                  d="M19.904 5.75h-2.875V3.953c0-.793-.645-1.437-1.438-1.437H8.404c-.793 0-1.438.644-1.438 1.437V5.75H4.091a.718.718 0 00-.719.719v.718c0 .1.081.18.18.18h1.357l.554 11.747a1.44 1.44 0 001.436 1.37h10.197c.768 0 1.4-.602 1.435-1.37l.555-11.747h1.357a.18.18 0 00.18-.18V6.47a.718.718 0 00-.72-.719zm-4.493 0H8.583V4.133h6.828V5.75z"
                ></Path>
              </Svg>
            ),
            colourTheme: "red",
          },
        ]}
      />
      <Popup visible={visible} handleClose={() => setVisible(false)}>
        {popupData}
      </Popup>
    </Layout>
  );
};
