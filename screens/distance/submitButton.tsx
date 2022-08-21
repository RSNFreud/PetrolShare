import { View } from "react-native";
import { Text, Button } from "../../components/Themed";

type PropsType = {
  loading: boolean;
  handleClick: () => void;
  errors: string;
  distance: string;
};

export default ({ loading, handleClick, errors, distance }: PropsType) => {
  return (
    <>
      <Button loading={loading} handleClick={handleClick}>
        <>Add Distance {distance && <>({distance}km)</>}</>
      </Button>
      {!!errors && (
        <View
          style={{
            marginTop: 15,
            backgroundColor: "#EECFCF",
            borderRadius: 4,
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text style={{ color: "#7B1D1D", fontSize: 16, fontWeight: "400" }}>
            {errors}
          </Text>
        </View>
      )}
    </>
  );
};
