import Svg, { Path } from "react-native-svg"
import { AuthContext } from "../../hooks/context"
import { LongButton, Text } from "../Themed"
import React, { useContext } from 'react'
import { Alert, sendCustomEvent } from "../../hooks"
import axios from "axios"
import config from "../../config"

export type PropsType = {
    handleChange: (screen: string) => void
    handleClose: () => void
    handleUpdate?: () => void
}

export default ({ handleChange }: PropsType) => {
    const { retrieveData, signOut } = useContext(AuthContext)

    const logout = () => {
        Alert("Are you sure you want to sign out?", undefined, [
            {
                text: "Yes",
                onPress: async () => {
                    signOut();
                },
            },
            { text: "No", style: "cancel" },
        ]);
    }

    const deleteAccount = () => {
        Alert("Are you sure you want to delete\nyour account?", "You will recieve an email to\nconfirm this change!", [
            {
                text: "Yes",
                onPress: async () => {
                    axios
                        .post(config.REACT_APP_API_ADDRESS + `/user/deactivate`, {
                            authenticationKey: retrieveData().authenticationKey,
                        })
                        .then(async () => {
                            signOut()
                            setTimeout(() => {
                                sendCustomEvent('sendAlert', 'Your account has been\nsuccessfully deactivated!')
                            }, 500);
                        })
                        .catch((err) => { })
                },
            },
            { text: "No", style: "cancel" },
        ]);
    }

    return <>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            Hello {retrieveData()?.fullName}!
        </Text>
        <LongButton icon={<Svg width="16" height="16" fill="none" viewBox="0 0 16 17">
            <Path
                fill="#fff"
                d="M8.003 6.322c-.564 0-1.093.207-1.493.586-.399.38-.62.88-.62 1.415 0 .534.221 1.035.62 1.414.4.377.929.587 1.493.587.565 0 1.093-.21 1.493-.587.399-.379.62-.88.62-1.414a1.94 1.94 0 00-.62-1.415 2.106 2.106 0 00-.684-.435 2.197 2.197 0 00-.809-.151zm7.784 4.21l-1.235-.999a6.086 6.086 0 000-2.063l1.235-1a.57.57 0 00.192-.289.544.544 0 00-.016-.34l-.017-.047a7.822 7.822 0 00-1.503-2.462l-.034-.038a.612.612 0 00-.304-.182.638.638 0 00-.359.012l-1.533.517a6.692 6.692 0 00-1.88-1.028l-.297-1.518a.564.564 0 00-.168-.302.617.617 0 00-.319-.158L9.5.626a8.976 8.976 0 00-2.999 0l-.05.009a.617.617 0 00-.32.158.564.564 0 00-.168.302L5.664 2.62a6.771 6.771 0 00-1.867 1.025l-1.545-.52a.636.636 0 00-.36-.014.609.609 0 00-.302.183l-.034.038A7.884 7.884 0 00.053 5.794l-.017.047a.555.555 0 00.175.629l1.25 1.01a5.962 5.962 0 000 2.039l-1.246 1.01a.57.57 0 00-.191.29.544.544 0 00.015.34l.017.046c.342.9.846 1.731 1.503 2.463l.034.037a.61.61 0 00.304.182.64.64 0 00.359-.012l1.544-.52c.563.438 1.19.785 1.868 1.024l.298 1.526c.022.114.08.22.168.301a.617.617 0 00.319.158l.051.01a8.933 8.933 0 002.998 0l.051-.01a.617.617 0 00.32-.158.564.564 0 00.167-.301l.297-1.518a6.736 6.736 0 001.88-1.029l1.533.517a.637.637 0 00.36.013.61.61 0 00.303-.183l.034-.037a7.887 7.887 0 001.503-2.463l.017-.046a.558.558 0 00-.18-.626zm-7.784.934c-1.833 0-3.319-1.407-3.319-3.143 0-1.737 1.486-3.144 3.32-3.144 1.832 0 3.318 1.407 3.318 3.144 0 1.736-1.486 3.143-3.319 3.143z"
            ></Path>
        </Svg>} handleClick={() => { handleChange('Settings') }} text="Settings" />
        <LongButton icon={<Svg width="16" height="16" fill="none" viewBox="0 0 24 23">
            <Path
                fill="#fff"
                d="M15.692 2.556H5.47a1.278 1.278 0 00-1.278 1.277v15.334a1.278 1.278 0 001.278 1.277h10.222a1.278 1.278 0 001.278-1.277v-3.834h-5.987a.639.639 0 110-1.277h5.987V3.833a1.278 1.278 0 00-1.278-1.277zM18.988 11.04a.638.638 0 00-.9.9l2.159 2.116H16.97v1.277h3.277l-2.16 2.21a.639.639 0 10.901.902l3.732-3.706-3.732-3.699z"
            ></Path>
        </Svg>} handleClick={logout} text="Sign Out" />
        <LongButton icon={<Svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 18 19"
        >
            <Path
                fill="#fff"
                d="M16.904 3.75h-2.875V1.953c0-.793-.645-1.437-1.438-1.437H5.404c-.793 0-1.438.644-1.438 1.437V3.75H1.091a.718.718 0 00-.719.719v.718c0 .1.081.18.18.18h1.357l.554 11.747a1.44 1.44 0 001.436 1.37h10.197c.768 0 1.4-.602 1.435-1.37l.555-11.747h1.357a.18.18 0 00.18-.18V4.47a.718.718 0 00-.72-.719zm-4.493 0H5.583V2.133h6.828V3.75z"
            ></Path>
        </Svg>} handleClick={deleteAccount} text="Delete my Account" last style={{ backgroundColor: '#FA4F4F', borderColor: '#BA3737' }} />
    </>

}