import { Text } from "@components/text";
import { View } from "react-native";

import Colors from "../../constants/Colors";

export default ({ summary }: { summary: object }) => {
  if (!Object.keys(summary).length) return <></>;
  return (
    <>
      <View
        style={{
          backgroundColor: Colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Summary:</Text>
      </View>
      <View
        style={{
          backgroundColor: Colors.secondary,
          paddingHorizontal: 20,
          paddingVertical: 15,
          marginBottom: 25,
        }}
      >
        {Object.entries(summary).map(([key, value], c) => (
          <View
            key={c}
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: c === Object.entries(summary).length - 1 ? 0 : 15,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginRight: 5 }}>
              {key}:
            </Text>
            <Text style={{ fontSize: 16 }}>
              {Math.round((value as any) * 10) / 10}km
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};
