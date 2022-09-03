import { View } from "react-native";
import { Button, Text } from "../../components/Themed";

type DefaultType = {
  firstSteps: boolean;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
};

export default ({ firstSteps, onCreateGroup, onJoinGroup }: DefaultType) => {
  return (
    <View>
      {firstSteps && (
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
          Welcome to PetrolShare!
        </Text>
      )}
      <Text style={{ fontSize: 18, marginBottom: 30, lineHeight: 27 }}>
        Would you like to create a group or join an existing group?
      </Text>
      <Button styles={{ marginBottom: 20 }} handleClick={onCreateGroup}>
        Create a new group
      </Button>
      <Button handleClick={onJoinGroup}>Join an existing group</Button>
    </View>
  );
};
