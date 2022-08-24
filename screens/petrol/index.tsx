import Input from "../../components/Input";
import { View } from "react-native";
import {
  Layout,
  Breadcrumbs,
  FlexFull,
  Button,
  Text,
} from "../../components/Themed";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../hooks/context";

export default ({ navigation }: any) => {
  const [data, setData] = useState({
    litersFilled: "",
    totalPrice: "",
  });

  const [errors, setErrors] = useState({
    litersFilled: "",
    totalPrice: "",
    submit: "",
  });

  const [loading, setLoading] = useState(false);
  const { retrieveData } = useContext(AuthContext);

  const handleSubmit = () => {
    let errors: any = {};
    navigation.navigate("Invoices");

    Object.entries(data).map(([key, value]) => {
      if (!value) errors[key] = "Please complete this field!";
      if (value && isNaN(parseFloat(value)))
        errors[key] = "Please enter a valid numerical value";
    });
    setErrors({ ...errors });
    if (Object.keys(errors).length) return;

    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_ADDRESS + `/petrol/add`, {
        authenticationKey: retrieveData().authenticationKey,
        litersFilled: data.litersFilled,
        totalPrice: data.totalPrice,
      })
      .then((e) => {
        setLoading(false);
        navigation.navigate("Invoices", { id: 403 });
        console.log(e);
      })
      .catch(({ response }) => {
        console.log(response);
        setErrors({
          ...errors,
          submit: "There is no distance to generate petrol for!",
        });
        setLoading(false);
      });
  };

  return (
    <Layout>
      <Breadcrumbs
        links={[
          {
            name: "Dashboard",
          },
          {
            name: "Add Petrol",
          },
        ]}
      />
      <FlexFull>
        <View>
          <Input
            handleInput={(e) => setData({ ...data, litersFilled: e })}
            value={data.litersFilled}
            errorMessage={errors.litersFilled}
            label="Liters Filled"
            placeholder="Enter amount of liters filled"
            style={{ marginBottom: 20 }}
          />
          <Input
            handleInput={(e) => setData({ ...data, totalPrice: e })}
            value={data.totalPrice}
            errorMessage={errors.totalPrice}
            label="Total Cost"
            placeholder="Enter the total cost of refueling"
          />
        </View>
        <View>
          <Button loading={loading} handleClick={() => handleSubmit()}>
            Add Petrol
          </Button>
          {!!errors.submit && (
            <View
              style={{
                marginTop: 15,
                backgroundColor: "#EECFCF",
                borderRadius: 4,
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#7B1D1D",
                }}
              >
                {errors.submit}
              </Text>
            </View>
          )}
        </View>
      </FlexFull>
    </Layout>
  );
};
