import axios from "axios";
import { useContext, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import Input from "../../components/Input";
import Popup from "../../components/Popup";
import config from "../../config";
import { Alert, convertToDate } from "../../hooks";
import { AuthContext } from "../../hooks/context";
import Split from "./split";
import Colors from "../../constants/Colors";
import { Text, Button } from "../../components/Themed";

type PropsType = {
    fullName: string;
    id: number;
    distance: string;
    date: string;
    style: View["props"]["style"];
    activeSession: boolean;
    handleComplete: () => void;
}

export default ({
    fullName,
    distance,
    date,
    style,
    id,
    activeSession,
    handleComplete,
}: PropsType) => {
    const { retrieveData } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState(distance);

    const handleDelete = () => {
        Alert("Are you sure you want to delete this log?", undefined, [
            {
                text: "Yes",
                onPress: async () => {
                    axios
                        .post(config.REACT_APP_API_ADDRESS + `/logs/delete`, {
                            authenticationKey: retrieveData().authenticationKey,
                            logID: id,
                        })
                        .then(async (e) => {
                            Toast.show({
                                text1: "Log deleted successfully!",
                                type: "default",
                            });
                            handleComplete();
                        })
                        .catch(({ response }) => {
                            console.log(response.message);
                        });
                },
            },
            { text: "No", style: "cancel" },
        ]);
    };

    const handleEdit = () => {
        axios
            .post(config.REACT_APP_API_ADDRESS + `/logs/edit`, {
                authenticationKey: retrieveData().authenticationKey,
                logID: id,
                distance: formData,
            })
            .then(async (e) => {
                Toast.show({
                    text1: "Log updated successfully!",
                    type: "default",
                });
                setVisible(false);
                handleComplete();
            })
            .catch(({ response }) => {
                console.log(response.message);
            });
    };

    return (
        <View
            style={[
                { backgroundColor: Colors.primary, borderColor: Colors.border, borderStyle: 'solid', borderWidth: 1, borderRadius: 4, padding: 15 },
                style,
            ]}
        >
            <Text style={{ fontSize: 14, fontWeight: "300", marginBottom: 5 }}>
                {convertToDate(date)}
            </Text>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {fullName}
                    {fullName === retrieveData().fullName && <> (You)</>}
                </Text>
                <Text style={{ fontSize: 16 }}>{distance}km</Text>
            </View>

            {activeSession && (
                <Split>
                    <Button
                        disabled={fullName !== retrieveData().fullName}
                        styles={{
                            paddingVertical: 0,
                            paddingHorizontal: 0,
                            width: "auto",
                            backgroundColor: Colors.tertiary,
                            borderColor: Colors.border,
                            minHeight: 0,
                            justifyContent: "center",
                            height: 32,
                            alignItems: "center",
                        }}
                        handleClick={() => setVisible(true)}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Edit</Text>
                    </Button>
                    <Button
                        disabled={fullName !== retrieveData().fullName}
                        color="red"
                        styles={{
                            paddingVertical: 0,
                            backgroundColor: "transparent",
                            borderColor: "#FA4F4F",
                            paddingHorizontal: 0,
                            width: "auto",
                            minHeight: 0,
                            justifyContent: "center",
                            height: 32,
                            alignItems: "center",
                        }}
                        handleClick={handleDelete}
                        noText
                    >
                        <Text
                            style={{ fontSize: 14, fontWeight: "bold", color: "#FA4F4F" }}
                        >
                            Remove
                        </Text>
                    </Button>
                </Split>
            )}
            <Popup visible={visible} handleClose={() => setVisible(false)}>
                <Input
                    label="Distance"
                    handleInput={(e) => setFormData(e)}
                    value={formData.toString()}
                    placeholder="Enter new distance"
                    style={{ marginBottom: 20 }}
                />
                <Button handleClick={handleEdit}>
                    <>Update Distance {formData && <>({formData}km)</>}</>
                </Button>
            </Popup>
        </View>
    );
};