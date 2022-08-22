import Input from "../../components/Input";
import { View } from "react-native";
import { Layout, Breadcrumbs, FlexFull, Button } from "../../components/Themed";

export default () => {
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
            label="Current Odometer"
            placeholder="Enter current odometer value"
            style={{ marginBottom: 20 }}
          />
          <Input
            label="Total Cost"
            placeholder="Enter the total cost of refueling"
          />
        </View>
        <View>
          <Button>Add Petrol</Button>
        </View>
      </FlexFull>
    </Layout>
  );
};
