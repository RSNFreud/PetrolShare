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
      {firstSteps ? (<>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 20 }}>
          Welcome to PetrolShare!
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 30, lineHeight: 24 }}>
          To start using the app, either select <Text style={{ fontWeight: 'bold' }}>Join Group</Text> and enter the code or link provided by a group member (click the copy button on the dashboard to get it), or select <Text style={{ fontWeight: 'bold' }}>Create Group</Text>.
        </Text>
      </>
      ) : <Text style={{ fontSize: 18, marginBottom: 30, lineHeight: 27 }}>
        Would you like to create a group or join an existing group?
      </Text>}
      <Button styles={{ marginBottom: 20 }} handleClick={onCreateGroup}>
        Create Group
      </Button>
      <Button handleClick={onJoinGroup}>Join Group</Button>
    </View>
  );
};
